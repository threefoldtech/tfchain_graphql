const { map, flatten } = require("lodash");
const format = require("pg-format");
const { createCapacityContract } = require('./lib/mappings/contractMappers/v119')
const { createDeployment } = require('./lib/mappings/deploymentMappers/v119')
const v119 = require('./lib/types/v119')
require('dotenv/config')
const typeormConfig = require('@subsquid/typeorm-config');
const typeorm = require('typeorm')
const { NodeContract, PublicIp, NodeResourcesTotal, RentContract, DeploymentContract, CapacityReservationContract, Node, ContractState, ContractResources } = require('./lib/model/index')

const { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } = process.env;

async function main() {
  const ormconfig = {
    type: 'postgres',
    migrations: [__dirname + 'db/migrations/*.js'],
    // entities: [NodeContract, NameContract, RentContract, DeploymentContract, CapacityContract],
    entities: [require.resolve('./lib/model')],
    synchronize: false,
    migrationsRun: false,
    dropSchema: false,
    logging: ["query", "error", "schema"],
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    database: process.env.DB_NAME || 'tfgrid-graphql',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres'
  }

  const connetion = await typeorm.createConnection(typeormConfig.createOrmConfig(ormconfig))
  await connetion.runMigrations({ transaction: 'all' })
  const entityManager = connetion.createEntityManager()

  // Get all NodeContracts
  const nodeContracts = await entityManager.find(NodeContract, { where: { state: ContractState.Created }, relations: { relation: true } })

  // Get all RentContracts
  const rentContracts = await entityManager.find(RentContract, { where: { state: ContractState.Created } })

  // Get all Nodes
  const nodes = await entityManager.find(Node)

  const capacityRentContracts = rentContracts.map(async rentContract => {
    console.log(`migrating rent contract ${rentContract.nodeID}`)

    const foundNode = nodes.find(n => n.nodeID === rentContract.nodeID)
    if (!foundNode) return
    const resources = await entityManager.find(NodeResourcesTotal, { where: { node: foundNode } })

    const parsedResources = {
      cru: BigInt(0),
      hru: BigInt(0),
      mru: BigInt(0),
      sru: BigInt(0)
    }

    if (resources.length > 0) {
      parsedResources.cru = resources[0].cru
      parsedResources.hru = resources[0].hru
      parsedResources.mru = resources[0].mru
      parsedResources.sru = resources[0].sru
    }

    const capacityContract = {
      version: rentContract.gridVersion,
      state: rentContract.state,
      contractId: rentContract.contractID,
      twinId: rentContract.twinID,
      contractType: {
        __kind: 'CapacityReservationContract',
        value: {
          nodeId: rentContract.nodeID,
          publicIps: 0,
          resources: {
            totalResources: {
              cru: resources.cru,
              hru: resources.hru,
              mru: resources.mru,
              sru: resources.sru,
            },
            usedResources: {
              cru: resources.cru,
              hru: resources.hru,
              mru: resources.mru,
              sru: resources.sru,
            },
          }
        },
        groupId: undefined,
        publicIps: 0,
        deploymentContracts: []
      }
    }

    return createCapacityContract(rentContract.id, capacityContract, entityManager)
  })

  await Promise.all(capacityRentContracts)

  const deploymentCapacityContracts = nodeContracts.map(async nodeC => {
    const toExecute = []
    // console.log(`migrating contract ${nodeC.contractID}`)
    const contractResources = await entityManager.find(ContractResources, { where: { contract: nodeC } })
    const publicIPs = await entityManager.find(PublicIp, { where: { contractId: nodeC.contractID } })

    const resources = {
      cru: BigInt(0),
      hru: BigInt(0),
      mru: BigInt(0),
      sru: BigInt(0)
    }

    if (contractResources.length > 0) {
      resources.cru = contractResources[0].cru
      resources.hru = contractResources[0].hru
      resources.mru = contractResources[0].mru
      resources.sru = contractResources[0].sru
    }

    const capacityContract = {
      version: nodeC.gridVersion,
      state: nodeC.state,
      contractId: nodeC.contractID,
      twinId: nodeC.twinID,
      contractType: {
        __kind: 'CapacityReservationContract',
        value: {
          nodeId: nodeC.nodeID,
          publicIps: nodeC.numberOfPublicIPs,
          resources: {
            totalResources: {
              cru: resources.cru,
              hru: resources.hru,
              mru: resources.mru,
              sru: resources.sru,
            },
            usedResources: {
              cru: resources.cru,
              hru: resources.hru,
              mru: resources.mru,
              sru: resources.sru,
            },
          }
        },
        groupId: undefined,
        publicIps: nodeC.numberOfPublicIPs,
        deploymentContracts: []
      }
    }

    // Only create capacity contract it was not already created by parsing rent contracts
    if (!rentContracts.includes(c => c.nodeID === nodeC.nodeID)) {
      createCapacityContract(nodeC.id, capacityContract, entityManager)
    }

    const parsedPublicIps = publicIPs.map(ip => {
      return {
        ip: ip.ip,
        gateway: ip.gateway,
        contractId: nodeC.contractID
      }
    })

    const deploymentContract = {
      id: nodeC.contractID,
      twinId: nodeC.twinID,
      capacityReservationId: nodeC.contractID,
      deploymentHash: nodeC.deploymentHash,
      deploymentData: nodeC.deploymentData,
      publicIps: nodeC.numberOfPublicIPs,
      publicIpsList: parsedPublicIps,
      resources: {
        hru: resources.hru,
        sru: resources.sru,
        cru: resources.cru,
        mru: resources.mru,
      }
    }

    toExecute.push(createDeployment(nodeC.id, BigInt(nodeC.createdAt), deploymentContract, entityManager))

    return toExecute
  })

  await Promise.all(deploymentCapacityContracts)
}



main()