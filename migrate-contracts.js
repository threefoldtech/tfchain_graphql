require('dotenv/config')
const typeormConfig = require('@subsquid/typeorm-config')
const typeorm = require('typeorm')
const {
  NodeContract,
  PublicIp,
  NodeResourcesTotal,
  ExecutedContractMigration,
  Deployment,
  DeploymentPublicIp,
  DeploymentResources,
  RentContract,
  Node,
  ContractState,
  ContractResources,
  NodeConsumableResources,
  ConsumableResources,
  Resources,
} = require('./lib/model/index')
const {
  CapacityReservationContract
} = require('./lib/model/generated/capacityReservationContract.model')

async function main () {
  const ormconfig = {
    type: 'postgres',
    migrations: [__dirname + 'db/migrations/*.js'],
    entities: [require.resolve('./lib/model')],
    synchronize: false,
    migrationsRun: false,
    dropSchema: false,
    logging: ['query', 'error', 'schema'],

    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    database: process.env.DB_NAME || 'tfgrid-graphql',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres'
  }

  const connetion = await typeorm.createConnection(
    typeormConfig.createOrmConfig(ormconfig)
  )
  await connetion.runMigrations({ transaction: 'all' })

  const entityManager = connetion.createEntityManager()

  const executedMigration = await entityManager.find(ExecutedContractMigration)
  if (executedMigration.length > 0) {
    if (executedMigration[0].executed) {
      console.log(`contract migration executed, aborting now ...`)
      process.exit(0)
    }
  }

  // Get all NodeContracts
  const nodeContracts = await entityManager.find(NodeContract, {
    where: { state: ContractState.Created },
    relations: { relation: true }
  })

  // Get all RentContracts
  const rentContracts = await entityManager.find(RentContract, {
    where: { state: ContractState.Created }
  })

  // Get all Nodes
  const nodes = await entityManager.find(Node)
  console.log(`- MIGRATING NODE RESOURCES: amount of nodes: ${nodes.length}`)

  const migrateNodeResources = nodes.map(async node => {   
    const { id } = node
    const nodeResources = await entityManager.find(NodeResourcesTotal, { where: { node } })

    const total = new Resources()
    
    if (nodeResources.length > 0) {
      total.cru = nodeResources[0].cru
      total.hru = nodeResources[0].hru
      total.mru = nodeResources[0].mru
      total.sru = nodeResources[0].sru
    }
    
    const used = new Resources()
    used.cru = BigInt(0)
    used.sru = BigInt(0)
    used.hru = BigInt(0)
    used.mru = BigInt(0)

    const consumableResources = {
      id,
      total,
      used,
      node,
    }

    return entityManager.save(NodeConsumableResources, consumableResources)
  })
  await Promise.all(migrateNodeResources)

  console.log(`- MIGRATING RENT CONTRACTS: amount of contract: ${rentContracts.length}`)
  rentContracts.forEach(async (rentContract) => {
    const foundNode = nodes.find((n) => n.nodeID === rentContract.nodeID)
    if (!foundNode) return

    const nodeResourcesTotal = await entityManager.find(NodeResourcesTotal, {
      where: { node: foundNode }
    })

    const totalResources = new Resources()
    if (nodeResourcesTotal.length > 0) {
      totalResources.cru = nodeResourcesTotal[0].cru
      totalResources.hru = nodeResourcesTotal[0].hru
      totalResources.mru = nodeResourcesTotal[0].mru
      totalResources.sru = nodeResourcesTotal[0].sru
    }

    const usedResources = new Resources()
    usedResources.cru = BigInt(0)
    usedResources.hru = BigInt(0)
    usedResources.mru = BigInt(0)
    usedResources.sru = BigInt(0)

    await createCapacityContract(
      entityManager,
      rentContract.id,
      rentContract.nodeID,
      rentContract.contractID,
      0,
      totalResources,
      usedResources,
      nodes,
    )
  })

  console.log(`- MIGRATING NODE CONTRACTS: amount of contract: ${nodeContracts.length}`)
  nodeContracts.forEach(async (nodeC) => {
    const { id, nodeID, twinID, contractID } = nodeC

    const contractResources = await entityManager.find(ContractResources, {
      where: { contract: nodeC }
    })

    const publicIPs = await entityManager.find(PublicIp, {
      where: { contractId: contractID }
    })

    const totalContractResources = new Resources()
    if (contractResources.length > 0) {
      totalContractResources.cru = contractResources[0].cru
      totalContractResources.hru = contractResources[0].hru
      totalContractResources.mru = contractResources[0].mru
      totalContractResources.sru = contractResources[0].sru
    } else {
      totalContractResources.cru = BigInt(0)
      totalContractResources.hru = BigInt(0)
      totalContractResources.mru = BigInt(0)
      totalContractResources.sru = BigInt(0)
    }

    const hasRentContract = rentContracts.filter(c => c.nodeID === nodeID).length > 0
    // Only create capacity contract if it was not already created by parsing rent contracts
    if (!hasRentContract) {
      // Used resources is equal to total resources
      await createCapacityContract(
        entityManager,
        id,
        nodeID,
        contractID,
        nodeC.numberOfPublicIPs,
        totalContractResources,
        totalContractResources,
        nodes
      )
    } else {
      // fetch and increment used resources on the node
      const capacityContract = await entityManager.find(CapacityReservationContract, { where: { nodeID }})
      if (capacityContract.length > 0) {
        const consumableResources = await entityManager.find(ConsumableResources, { where : { contract: capacityContract[0] }})

        if (consumableResources.length > 0) {
          consumableResources[0].used.cru += totalContractResources.cru
          consumableResources[0].used.hru += totalContractResources.hru
          consumableResources[0].used.sru += totalContractResources.sru
          consumableResources[0].used.mru += totalContractResources.mru

          await entityManager.save(ConsumableResources, consumableResources[0])
        }

        const node = nodes.filter(n => n.nodeID === nodeID)[0]
        if (!node) return
      
        const nodeConsumableResources = await entityManager.find(NodeConsumableResources, {
          where: { node }
        })
        if (nodeConsumableResources.length > 0) {
          nodeConsumableResources[0].used.cru += totalContractResources.cru
          nodeConsumableResources[0].used.sru += totalContractResources.sru
          nodeConsumableResources[0].used.hru += totalContractResources.hru
          nodeConsumableResources[0].used.mru += totalContractResources.mru
          await entityManager.save(NodeConsumableResources, nodeConsumableResources)
        }
      }
    }

    const newDeployment = new Deployment()
    newDeployment.id = id
    newDeployment.deploymentID = contractID
    newDeployment.twinID = twinID
    newDeployment.capacityReservationID = contractID
    newDeployment.deploymentData = nodeC.deploymentData
    newDeployment.deploymentHash = nodeC.deploymentHash
    newDeployment.numberOfPublicIPs = nodeC.numberOfPublicIPs
    newDeployment.createdAt = nodeC.createdAt

    newDeployment.publicIps = publicIPs.map((ip) => {
      let depIp = new DeploymentPublicIp()
      depIp.ip = ip.ip
      depIp.gateway = ip.gateway
      return depIp
    })

    await entityManager.save(Deployment, newDeployment)

    const deploymentResources = new DeploymentResources()
    deploymentResources.id = id
    deploymentResources.contract = newDeployment
    deploymentResources.hru = totalContractResources.hru
    deploymentResources.sru = totalContractResources.sru
    deploymentResources.mru = totalContractResources.mru
    deploymentResources.cru = totalContractResources.cru

    await entityManager.save(DeploymentResources, deploymentResources)
  })

  let setExecutedMigration = new ExecutedContractMigration()
  setExecutedMigration.executed = true
  setExecutedMigration.id = "someid"
  await entityManager.save(ExecutedContractMigration, setExecutedMigration)
}

async function createCapacityContract(entityManager, id, nodeID, contractID, publicIps, totalResources, usedResources, nodes) {
  const capContract = new CapacityReservationContract()
  capContract.id = id
  capContract.nodeID = nodeID
  capContract.contractID = contractID
  capContract.publicIPs = BigInt(publicIps)
  capContract.state = 'Created'
  await entityManager.save(CapacityReservationContract, capContract)

  const consumableResources = new ConsumableResources()
  consumableResources.id = id
  consumableResources.contract = capContract
  consumableResources.total = totalResources
  consumableResources.used = usedResources
  await entityManager.save(ConsumableResources, consumableResources)

  const node = nodes.filter(n => n.nodeID === nodeID)[0]
  if (!node) return

  const nodeConsumableResources = await entityManager.find(NodeConsumableResources, {
    where: { node }
  })
  if (nodeConsumableResources.length > 0) {
    nodeConsumableResources[0].used.cru += usedResources.cru
    nodeConsumableResources[0].used.sru += usedResources.sru
    nodeConsumableResources[0].used.hru += usedResources.hru
    nodeConsumableResources[0].used.mru += usedResources.mru
    await entityManager.save(NodeConsumableResources, nodeConsumableResources)
  }
}

main()
