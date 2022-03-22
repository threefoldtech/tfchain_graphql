import {
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { ContractState, PublicIp, NameContract, NodeContract } from "../model";
import { SmartContractModuleContractCreatedEvent } from "../types/events";


export async function contractCreated(ctx: EventHandlerContext) {
  let contractCreatedEvent = new SmartContractModuleContractCreatedEvent(ctx)

  if (!contractCreatedEvent.isV9) return

  console.log(`got contract V9 event: ${contractCreatedEvent.asV9}`)
  const contractCreatedEventV9 = contractCreatedEvent.asV9

  let state = ContractState.Created
  switch (contractCreatedEventV9.state.toString()) {
    case 'Created': break
    case 'Deleted':
      state = ContractState.Deleted
      break
    case 'OutOfFunds':
      state = ContractState.OutOfFunds
      break
  }

  let contract
  if (contractCreatedEventV9.contractType.__kind === "NameContract") {
    let newNameContract = new NameContract()
    newNameContract.id = ctx.event.id
    contract = contractCreatedEventV9.contractType.value
    newNameContract.name = contract.name.toString()
    newNameContract.contractID = contractCreatedEventV9.contractId
    newNameContract.version = contractCreatedEventV9.version
    newNameContract.twinID = contractCreatedEventV9.twinId
    newNameContract.state = state
    await ctx.store.save<NameContract>(newNameContract)
  }
  else if (contractCreatedEventV9.contractType.__kind === "NodeContract") {
    let newNodeContract = new NodeContract()
    newNodeContract.id = ctx.event.id

    contract = contractCreatedEventV9.contractType.value

    newNodeContract.contractID = contractCreatedEventV9.contractId
    newNodeContract.version = contractCreatedEventV9.version
    newNodeContract.twinID = contractCreatedEventV9.twinId
    newNodeContract.nodeID = contract.nodeId
    newNodeContract.numberOfPublicIPs = contract.publicIps
    newNodeContract.deploymentData = contract.deploymentData.toString()
    newNodeContract.deploymentHash = contract.deploymentHash.toString()
    newNodeContract.state = state
    await ctx.store.save<NodeContract>(newNodeContract)

    contract.publicIpsList.forEach(async ip => {
      const savedIp = await ctx.store.get(PublicIp, { where: { ip: ip.ip.toString() } })

      if (savedIp) {
        // savedIp.contractId = newNodeContract.contractId
        await ctx.store.save<PublicIp>(savedIp)
      }
    })
  }
}

// export async function contractUpdated({
//   store,
//   event,
//   block,
//   extrinsic,
// }: EventContext & StoreContext) {
//   const [contract] = new SmartContractModule.ContractUpdatedEvent(event).params

//   const SavedNodeContract = await store.get(NodeContract, { where: { contractId: contract.contract_id.toNumber() } })
//   if (SavedNodeContract) {
//     await updateNodeContract(contract, SavedNodeContract, store)
//   }

//   const SavedNameContract = await store.get(NameContract, { where: { contractId: contract.contract_id.toNumber() } })
//   if (SavedNameContract) {
//     await updateNameContract(contract, SavedNameContract, store)
//   }
// }

// async function updateNodeContract(ctr: any, contract: NodeContract, store: DatabaseManager) {
//   const parsedNodeContract = ctr.contract_type.asNodeContract

//   contract.contractId = ctr.contract_id.toNumber()
//   contract.version = ctr.version.toNumber()
//   contract.twinId = ctr.twin_id.toNumber()
//   contract.nodeId = parsedNodeContract.node_id.toNumber()
//   contract.numberOfPublicIPs = parsedNodeContract.public_ips.toNumber()
//   contract.deploymentData = parsedNodeContract.deployment_data.toString()
//   contract.deploymentHash = parsedNodeContract.deployment_hash.toString()

//   let state = ContractState.Created
//   switch (ctr.state.toString()) {
//     case 'Created': break
//     case 'Deleted':
//       state = ContractState.Deleted
//       break
//     case 'OutOfFunds':
//       state = ContractState.OutOfFunds
//       break
//   }
//   contract.state = state
//   await store.save<NodeContract>(contract)
// }

// async function updateNameContract(ctr: any, contract: NameContract, store: DatabaseManager) {
//   const parsedNameContract = ctr.contract_type.asNameContract

//   contract.contractId = ctr.contract_id.toNumber()
//   contract.version = ctr.version.toNumber()
//   contract.twinId = ctr.twin_id.toNumber()
//   contract.name = hex2a(Buffer.from(contract.name.toString()).toString())

//   let state = ContractState.Created
//   switch (parsedNameContract.state.toString()) {
//     case 'Created': break
//     case 'Deleted':
//       state = ContractState.Deleted
//       break
//     case 'OutOfFunds':
//       state = ContractState.OutOfFunds
//       break
//   }
//   contract.state = state

//   await store.save<NameContract>(contract)
// }

// export async function nodeContractCanceled({
//   store,
//   event,
//   block,
//   extrinsic,
// }: EventContext & StoreContext) {
//   const [id] = new SmartContractModule.NodeContractCanceledEvent(event).params

//   const savedContract = await store.get(NodeContract, { where: { contractId: id.toNumber() } })

//   if (!savedContract) return

//   const savedIps = await store.getMany(PublicIp, { where: { contractId: id.toNumber() } })
//   await savedIps.forEach(async ip => {
//     ip.contractId = 0
//     await store.save<PublicIp>(ip)
//   })

//   savedContract.state = ContractState.Deleted

//   console.log(`saving contract to delete state ${id}`)

//   await store.save<NodeContract>(savedContract)
// }

// export async function contractCanceled({
//   store,
//   event,
//   block,
//   extrinsic,
// }: EventContext & StoreContext) {
//   const [id] = new ContractCanceledEvent(event).params

//   const savedContract = await store.get(NodeContract, { where: { contractId: id.toNumber() } })

//   if (!savedContract) return

//   const savedIps = await store.getMany(PublicIp, { where: { contractId: id.toNumber() } })
//   await savedIps.forEach(async ip => {
//     ip.contractId = 0
//     await store.save<PublicIp>(ip)
//   })

//   savedContract.state = ContractState.Deleted

//   console.log(`saving contract to delete state ${id}`)

//   await store.save<NodeContract>(savedContract)
// }

// export async function nameContractCanceled({
//   store,
//   event,
//   block,
//   extrinsic,
// }: EventContext & StoreContext) {
//   const [id] = new SmartContractModule.NameContractCanceledEvent(event).params

//   const savedContract = await store.get(NameContract, { where: { contractId: id.toNumber() } })

//   if (!savedContract) return

//   savedContract.state = ContractState.Deleted

//   await store.save<NameContract>(savedContract)
// }

// export async function nruConsumptionReportReceived({
//   store,
//   event,
//   block,
//   extrinsic,
// }: EventContext & StoreContext) {
//   const newConsumptionReport = new NruConsumption()
//   const [consumptionReport] = new SmartContractModule.NruConsumptionReportReceivedEvent(event).params

//   newConsumptionReport.contractId = consumptionReport.contract_id.toNumber()
//   newConsumptionReport.timestamp = consumptionReport.timestamp.toNumber()
//   newConsumptionReport.window = consumptionReport.window.toBn()
//   newConsumptionReport.nru = consumptionReport.nru.toBn()

//   await store.save<NruConsumption>(newConsumptionReport)
// }

// export async function contractBilled({
//   store,
//   event,
//   block,
//   extrinsic,
// }: EventContext & StoreContext) {
//   const newContractBilledReport = new ContractBillReport()
//   const [contract_billed_event] = new SmartContractModule.ContractBilledEvent(event).params

//   newContractBilledReport.contractId = contract_billed_event.contract_id.toNumber()

//   let level = DiscountLevel.None
//   switch (contract_billed_event.discount_level.toString()) {
//     case 'None': break
//     case 'Default':
//       level = DiscountLevel.Default
//       break
//     case 'Bronze':
//       level = DiscountLevel.Bronze
//       break
//     case 'Silver':
//       level = DiscountLevel.Silver
//       break
//     case 'Gold': level = DiscountLevel.Gold
//   }
//   newContractBilledReport.discountReceived = level
//   newContractBilledReport.amountBilled = contract_billed_event.amount_billed.toBn()
//   newContractBilledReport.timestamp = contract_billed_event.timestamp.toNumber()

//   await store.save<ContractBillReport>(newContractBilledReport)
// }

// export async function contractUpdateUsedResources({
//   store,
//   event,
//   block,
//   extrinsic,
// }: EventContext & StoreContext) {
//   const contractUsedResources = new ContractUsedResources()
//   const [usedResources] = new SmartContractModule.UpdatedUsedResourcesEvent(event).params

//   const savedContract = await store.get(NodeContract, { where: { contractId: usedResources.contract_id.toNumber() } })
//   if (!savedContract) return

//   contractUsedResources.cru = usedResources.used.cru.toBn()
//   contractUsedResources.sru = usedResources.used.sru.toBn()
//   contractUsedResources.hru = usedResources.used.hru.toBn()
//   contractUsedResources.mru = usedResources.used.mru.toBn()

//   savedContract.resourcesUsed = contractUsedResources

//   await store.save<NodeContract>(savedContract)
// }

// // Deprecated event types
// import { createTypeUnsafe } from "@polkadot/types/create";
// import { SubstrateEvent } from "@subsquid/hydra-common";
// import { Codec } from "@polkadot/types/types";
// import { typeRegistry } from "../chain/index";

// import { u64 } from "@polkadot/types";

// export class ContractCanceledEvent {
//   public readonly expectedParamTypes = ["u64"];

//   constructor(public readonly ctx: SubstrateEvent) { }

//   get params(): [u64] {
//     return [
//       createTypeUnsafe<u64 & Codec>(typeRegistry, "u64", [
//         this.ctx.params[0].value,
//       ]),
//     ];
//   }

//   validateParams(): boolean {
//     if (this.expectedParamTypes.length !== this.ctx.params.length) {
//       return false;
//     }
//     let valid = true;
//     this.expectedParamTypes.forEach((type, i) => {
//       if (type !== this.ctx.params[i].type) {
//         valid = false;
//       }
//     });
//     return valid;
//   }
// }
