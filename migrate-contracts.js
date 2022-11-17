const { map, flatten } = require("lodash");
const format = require("pg-format");
// const { parseCapacityContractCreate } = require('./src/mappings/v119')
const v119 = require('./lib/types/v119')
require('dotenv/config')
const typeormConfig = require('@subsquid/typeorm-config');
const typeorm = require('typeorm')
const { NodeContract, Country, NameContract, RentContract, DeploymentContract, CapacityReservationContract, Node, ContractState } = require('./lib/model/index')

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

  let x = new CapacityReservationContract()
  x.id = "blabla"
  console.log(x)

  // Get all NodeContracts
  const nodeContracts = await entityManager.find(NodeContract, { where: { state: ContractState.Created } })
  console.log(`contract: ${nodeContracts}`)

  // Get all RentContracts
  const rentContracts = await entityManager.find(RentContract, { where: { state: ContractState.Created } })
  console.log(`rent contract: ${rentContracts}`)

  const rentContractNodeIds = rentContracts.map(c => {
    return {
      contractID: c.contractID,
      nodeID: c.nodeID
    }
  })

  // If nodeContract is deployed on the same node as the rent contract => set capacity reservation ID
  // If nodeContract is not deployed on a rent contract => create capacity contract & deployment contract

  console.log(rentContractNodeIds)

  // Get 

  const createCapacityContracts = rentContracts.map(rentC => {
    const contract = {
      version: rentC.gridVersion,
      state: rentC.state,
      contractId: rentC.contractID,
      twinId: rentC.twinID,
      contractType: {
        nodeId: rentC.nodeID,
        // get total from Node Object 
        resources: {
          totalResources: {
            cru: 0,
            hru: 0,
            mru: 0,
            hru: 0,
          },
          usedResources: {
            cru: 0,
            hru: 0,
            mru: 0,
            hru: 0,
          },
        },
        groupId: undefined,
        publicIps: 0,
        deploymentContracts: []
      },
      solutionProviderId: rentC.solutionProviderID
    }


    return parseCapacityContractCreate(rentC.id, contract, entityManager)
  })

  await Promise.all(createCapacityContracts)
  // await parseCapacityContractCreate("some", undefined, client)

  process.exit(0)
  // const capacityContract = new v119.Contract()
}

// export interface Contract {
//   version: number
//   state: ContractState
//   contractId: bigint
//   twinId: number
//   contractType: ContractData
//   solutionProviderId: (bigint | undefined)
// }

// export interface CapacityReservationContract {
//   nodeId: number
//   resources: ConsumableResources
//   groupId: (number | undefined)
//   publicIps: number
//   deploymentContracts: bigint[]
// }


main()