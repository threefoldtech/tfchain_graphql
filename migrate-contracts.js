const {
  createCapacityContract,
  updateCapacityContract,
} = require("./lib/mappings/contractMappers/v119")
const { createDeployment } = require("./lib/mappings/deploymentMappers/v119")
require("dotenv/config")
const typeormConfig = require("@subsquid/typeorm-config")
const typeorm = require("typeorm")
const {
  NodeContract,
  PublicIp,
  NodeResourcesTotal,
  RentContract,
  Node,
  ContractState,
  ContractResources,
} = require("./lib/model/index")
const {
  CapacityReservationContract,
} = require("./lib/model/generated/capacityReservationContract.model")

async function main () {
  const ormconfig = {
    type: "postgres",
    migrations: [__dirname + "db/migrations/*.js"],
    entities: [require.resolve("./lib/model")],
    synchronize: false,
    migrationsRun: false,
    dropSchema: false,
    logging: ["query", "error", "schema"],

    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    database: process.env.DB_NAME || "tfgrid-graphql",
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "postgres",
  }

  const connetion = await typeorm.createConnection(
    typeormConfig.createOrmConfig(ormconfig)
  )
  await connetion.runMigrations({ transaction: "all" })

  const entityManager = connetion.createEntityManager()

  // Get all NodeContracts
  const nodeContracts = await entityManager.find(NodeContract, {
    where: { state: ContractState.Created },
    relations: { relation: true },
  })

  // Get all RentContracts
  const rentContracts = await entityManager.find(RentContract, {
    where: { state: ContractState.Created },
  })

  // Get all Nodes
  const nodes = await entityManager.find(Node)

  const capacityRentContracts = rentContracts.map(async (rentContract) => {
    // console.log(`migrating rent contract ${rentContract.nodeID}`)

    const foundNode = nodes.find((n) => n.nodeID === rentContract.nodeID)
    if (!foundNode) return
    const resources = await entityManager.find(NodeResourcesTotal, {
      where: { node: foundNode },
    })

    const parsedResources = {
      cru: BigInt(0),
      hru: BigInt(0),
      mru: BigInt(0),
      sru: BigInt(0),
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
        __kind: "CapacityReservationContract",
        value: {
          nodeId: rentContract.nodeID,
          publicIps: 0,
          resources: {
            totalResources: {
              cru: parsedResources.cru,
              hru: parsedResources.hru,
              mru: parsedResources.mru,
              sru: parsedResources.sru,
            },
            usedResources: {
              cru: parsedResources.cru,
              hru: parsedResources.hru,
              mru: parsedResources.mru,
              sru: parsedResources.sru,
            },
          },
        },
        groupId: undefined,
        publicIps: 0,
        deploymentContracts: [],
      },
    }

    return createCapacityContract(
      rentContract.id,
      capacityContract,
      entityManager
    )
  })

  await Promise.all(capacityRentContracts)

  const deploymentCapacityContracts = nodeContracts.map(async (nodeC) => {
    const toExecute = []
    // console.log(`migrating contract ${nodeC.contractID}`)
    const contractResources = await entityManager.find(ContractResources, {
      where: { contract: nodeC },
    })
    const publicIPs = await entityManager.find(PublicIp, {
      where: { contractId: nodeC.contractID },
    })

    const resources = {
      cru: BigInt(0),
      hru: BigInt(0),
      mru: BigInt(0),
      sru: BigInt(0),
    }

    if (contractResources.length > 0) {
      resources.cru = contractResources[0].cru
      resources.hru = contractResources[0].hru
      resources.mru = contractResources[0].mru
      resources.sru = contractResources[0].sru
    }

    // Only create capacity contract it was not already created by parsing rent contracts
    if (!rentContracts.includes((c) => c.nodeID === nodeC.nodeID)) {
      const capacityContract = {
        version: nodeC.gridVersion,
        state: nodeC.state,
        contractId: nodeC.contractID,
        twinId: nodeC.twinID,
        contractType: {
          __kind: "CapacityReservationContract",
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
                cru: BigInt(0),
                hru: BigInt(0),
                mru: BigInt(0),
                sru: BigInt(0),
              },
            },
          },
          groupId: undefined,
          publicIps: nodeC.numberOfPublicIPs,
          deploymentContracts: [],
        },
      }

      toExecute.push(
        createCapacityContract(nodeC.id, capacityContract, entityManager)
      )
    } else {
      console.log("includes in rentcontracts")
      let capacityContract = await entityManager.find(
        CapacityReservationContract,
        { where: { nodeID: nodeC.nodeID } }
      )[0]
      if (!capacityContract) {
        console.log(`capacity contract for node ${nodeC.nodeID} not found`)
      }

      capacityContract.contractType.value.resoruces.usedResources.cru +=
        resources.cru
      capacityContract.contractType.value.resoruces.usedResources.sru +=
        resources.sru
      capacityContract.contractType.value.resoruces.usedResources.hru +=
        resources.hru
      capacityContract.contractType.value.resoruces.usedResources.mru +=
        resources.mru

      console.log("had to update capacity contract")
      toExecute.push(updateCapacityContract(capacityContract, entityManager))
    }

    const parsedPublicIps = publicIPs.map((ip) => {
      return {
        ip: ip.ip,
        gateway: ip.gateway,
        contractId: nodeC.contractID,
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
      },
    }

    toExecute.push(
      createDeployment(
        nodeC.id,
        BigInt(nodeC.createdAt),
        deploymentContract,
        entityManager
      )
    )

    return toExecute
  })

  await Promise.all(deploymentCapacityContracts)
}

main()
