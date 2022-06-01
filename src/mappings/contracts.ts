import {
  EventHandlerContext,
  Store
} from "@subsquid/substrate-processor";
import { ContractState, PublicIp, NameContract, NodeContract, ContractBillReport, DiscountLevel, ContractResources, NodeResourcesTotal, Node, RentContract, Farm, NruConsumption } from "../model";
import { SmartContractModuleContractCreatedEvent, SmartContractModuleContractUpdatedEvent, SmartContractModuleNodeContractCanceledEvent, SmartContractModuleNameContractCanceledEvent, SmartContractModuleContractBilledEvent, SmartContractModuleUpdatedUsedResourcesEvent, SmartContractModuleNruConsumptionReportReceivedEvent, SmartContractModuleRentContractCanceledEvent, SmartContractModuleContractGracePeriodStartedEvent, SmartContractModuleContractGracePeriodEndedEvent } from "../types/events";

export async function contractCreated(ctx: EventHandlerContext) {
  let contractCreatedEvent = new SmartContractModuleContractCreatedEvent(ctx)

  let contractEvent
  if (contractCreatedEvent.isV9) {
    contractEvent = contractCreatedEvent.asV9
  } else if (contractCreatedEvent.isV25) {
    contractEvent = contractCreatedEvent.asV25
  } else if (contractCreatedEvent.isV50) {
    contractEvent = contractCreatedEvent.asV50
  } else if (contractCreatedEvent.isV59) {
    contractEvent = contractCreatedEvent.asV59
  }

  if (!contractEvent) return

  let state = ContractState.Created

  let contract
  if (contractEvent.contractType.__kind === "NameContract") {
    let newNameContract = new NameContract()
    newNameContract.id = ctx.event.id
    contract = contractEvent.contractType.value
    newNameContract.name = contract.name.toString()
    newNameContract.contractID = contractEvent.contractId
    newNameContract.gridVersion = contractEvent.version
    newNameContract.twinID = contractEvent.twinId
    newNameContract.state = state
    newNameContract.createdAt = BigInt(ctx.event.blockTimestamp)
    await ctx.store.save<NameContract>(newNameContract)
  }
  else if (contractEvent.contractType.__kind === "NodeContract") {
    let newNodeContract = new NodeContract()
    newNodeContract.id = ctx.event.id

    contract = contractEvent.contractType.value

    newNodeContract.contractID = contractEvent.contractId
    newNodeContract.gridVersion = contractEvent.version
    newNodeContract.twinID = contractEvent.twinId
    newNodeContract.nodeID = contract.nodeId
    newNodeContract.numberOfPublicIPs = contract.publicIps
    newNodeContract.deploymentData = contract.deploymentData.toString()
    newNodeContract.deploymentHash = contract.deploymentHash.toString()
    newNodeContract.state = state
    newNodeContract.createdAt = BigInt(ctx.event.blockTimestamp)
    await ctx.store.save<NodeContract>(newNodeContract)

    contract.publicIpsList.forEach(async ip => {
      const savedIp = await ctx.store.get(PublicIp, { where: { ip: ip.ip.toString() } })

      if (savedIp) {
        savedIp.contractId = newNodeContract.contractID
        await ctx.store.save<PublicIp>(savedIp)
      }
    })
  } else if (contractEvent.contractType.__kind === "RentContract") {
    let newRentContract = new RentContract()
    newRentContract.id = ctx.event.id

    contract = contractEvent.contractType.value

    newRentContract.contractID = contractEvent.contractId
    newRentContract.gridVersion = contractEvent.version
    newRentContract.twinID = contractEvent.twinId
    newRentContract.nodeID = contract.nodeId
    newRentContract.state = state
    newRentContract.createdAt = BigInt(ctx.event.blockTimestamp)

    await ctx.store.save<RentContract>(newRentContract)
  }
}

export async function contractUpdated(ctx: EventHandlerContext) {
  const contractUpdatedEvent = new SmartContractModuleContractUpdatedEvent(ctx)

  let contractEvent
  if (contractUpdatedEvent.isV9) {
    contractEvent = contractUpdatedEvent.asV9
  } else if (contractUpdatedEvent.isV25) {
    contractEvent = contractUpdatedEvent.asV25
  } else if (contractUpdatedEvent.isV50) {
    contractEvent = contractUpdatedEvent.asV50
  } else if (contractUpdatedEvent.isV59) {
    contractEvent = contractUpdatedEvent.asV59
  }

  if (!contractEvent) return

  const SavedNodeContract = await ctx.store.get(NodeContract, { where: { contractID: contractEvent.contractId } })
  if (SavedNodeContract) {
    await updateNodeContract(contractEvent, SavedNodeContract, ctx.store)
  }

  const SavedNameContract = await ctx.store.get(NameContract, { where: { contractID: contractEvent.contractId } })
  if (SavedNameContract) {
    await updateNameContract(contractEvent, SavedNameContract, ctx.store)
  }
}

async function updateNodeContract(ctr: any, contract: NodeContract, store: Store) {
  if (ctr.contractType.__kind !== "NodeContract") return

  const parsedNodeContract = ctr.contractType.value

  contract.contractID = ctr.contractId
  contract.gridVersion = ctr.version
  contract.twinID = ctr.twinId
  contract.nodeID = parsedNodeContract.nodeId
  contract.numberOfPublicIPs = parsedNodeContract.publicIps
  contract.deploymentData = parsedNodeContract.deploymentData.toString()
  contract.deploymentHash = parsedNodeContract.deploymentHash.toString()

  let state = ContractState.OutOfFunds
  switch (ctr.state.__kind) {
    case 'Created': 
      state = ContractState.Created
      break
    case 'Deleted':
      state = ContractState.Deleted
      break
  }
  contract.state = state
  await store.save<NodeContract>(contract)
}

async function updateNameContract(ctr: any, contract: NameContract, store: Store) {
  if (ctr.contractType.__kind !== "NameContract") return

  const parsedNameContract = ctr.contractType.value

  contract.contractID = ctr.contractId
  contract.gridVersion = ctr.version
  contract.twinID = ctr.twinId
  contract.name = parsedNameContract.name.toString()

  let state = ContractState.OutOfFunds
  switch (ctr.state.__kind) {
    case 'Created': 
      state = ContractState.Created
      break
    case 'Deleted':
      state = ContractState.Deleted
      break
  }
  contract.state = state
  await store.save<NameContract>(contract)
}

export async function nodeContractCanceled(ctx: EventHandlerContext) {
  const cancelEvent = new SmartContractModuleNodeContractCanceledEvent(ctx).asV19

  const savedContract = await ctx.store.get(NodeContract, { where: { contractID: cancelEvent[0] } })

  if (!savedContract) return

  savedContract.state = ContractState.Deleted
  await ctx.store.save<NodeContract>(savedContract)
  
  const savedNode = await ctx.store.get(Node, { where: { nodeID: savedContract.nodeID }})
  if (!savedNode) return
    
  const savedPublicIP = await ctx.store.get(PublicIp, { where: { contractId: savedContract.contractID }})
  if (savedPublicIP) {
    savedPublicIP.contractId = BigInt(0)
    await ctx.store.save<PublicIp>(savedPublicIP)
  }
}

export async function nameContractCanceled(ctx: EventHandlerContext) {
  const id = new SmartContractModuleNameContractCanceledEvent(ctx).asV19

  const savedContract = await ctx.store.get(NameContract, { where: { contractID: id } })

  if (!savedContract) return

  savedContract.state = ContractState.Deleted

  await ctx.store.save<NameContract>(savedContract)
}

export async function rentContractCanceled(ctx: EventHandlerContext) {
  const id = new SmartContractModuleRentContractCanceledEvent(ctx).asV50

  const savedContract = await ctx.store.get(RentContract, { where: { contractID: id } })

  if (!savedContract) return

  savedContract.state = ContractState.Deleted

  await ctx.store.save<RentContract>(savedContract)
}

export async function contractBilled(ctx: EventHandlerContext) {
  const contract_billed_event = new SmartContractModuleContractBilledEvent(ctx).asV9
  
  const newContractBilledReport = new ContractBillReport()

  newContractBilledReport.id = ctx.event.id
  newContractBilledReport.contractID = contract_billed_event.contractId

  let level = DiscountLevel.None
  switch (contract_billed_event.discountLevel.__kind) {
    case 'None': break
    case 'Default':
      level = DiscountLevel.Default
      break
    case 'Bronze':
      level = DiscountLevel.Bronze
      break
    case 'Silver':
      level = DiscountLevel.Silver
      break
    case 'Gold': level = DiscountLevel.Gold
  }
  newContractBilledReport.discountReceived = level
  newContractBilledReport.amountBilled = contract_billed_event.amountBilled
  newContractBilledReport.timestamp = contract_billed_event.timestamp

  await ctx.store.save<ContractBillReport>(newContractBilledReport)
}

export async function contractUpdateUsedResources(ctx: EventHandlerContext) {
  const usedResources = new SmartContractModuleUpdatedUsedResourcesEvent(ctx).asV49

  const contractUsedResources = new ContractResources()

  const savedContract = await ctx.store.get(NodeContract, { where: { contractID: usedResources.contractId } })
  if (!savedContract) return

  const savedContractResources = await ctx.store.get(ContractResources, { where: { contract: savedContract }})
  if (savedContractResources) {
    contractUsedResources.cru = usedResources.used.cru
    contractUsedResources.sru = usedResources.used.sru
    contractUsedResources.hru = usedResources.used.hru
    contractUsedResources.mru = usedResources.used.mru
    await ctx.store.save<ContractResources>(savedContractResources)

    savedContract.resourcesUsed = savedContractResources
    await ctx.store.save<NodeContract>(savedContract)
  } else {
    contractUsedResources.id = ctx.event.id
    contractUsedResources.cru = usedResources.used.cru
    contractUsedResources.sru = usedResources.used.sru
    contractUsedResources.hru = usedResources.used.hru
    contractUsedResources.mru = usedResources.used.mru
    contractUsedResources.contract = savedContract
    await ctx.store.save<ContractResources>(contractUsedResources)
  
    savedContract.resourcesUsed = contractUsedResources
    await ctx.store.save<NodeContract>(savedContract)
  }
}

export async function nruConsumptionReportReceived(ctx: EventHandlerContext) {
  const nruConsumptionReportEvent = new SmartContractModuleNruConsumptionReportReceivedEvent(ctx).asV49

  const nruConsumption = new NruConsumption()

  nruConsumption.id = ctx.event.id
  nruConsumption.contractID = nruConsumptionReportEvent.contractId
  nruConsumption.nru = nruConsumptionReportEvent.nru
  nruConsumption.timestamp = nruConsumptionReportEvent.timestamp
  nruConsumption.window = nruConsumptionReportEvent.window

  await ctx.store.save<NruConsumption>(nruConsumption)
}

export async function contractGracePeriodStarted(ctx: EventHandlerContext) {
  const contractGracePeriodStartedEvent = new SmartContractModuleContractGracePeriodStartedEvent(ctx).asV59
  
  let savedContract
  savedContract = await ctx.store.get(NodeContract, { where: { contractID: contractGracePeriodStartedEvent[0] } })
  
  if (!savedContract) {
    savedContract = await ctx.store.get(RentContract, { where: { contractID: contractGracePeriodStartedEvent[0] } })
    if (!savedContract) {
      savedContract = await ctx.store.get(NameContract, { where: { contractID: contractGracePeriodStartedEvent[0] } })
      if (!savedContract) return
      else {
        savedContract.state = ContractState.GracePeriod
        await ctx.store.save<NameContract>(savedContract)
      }
    } else {
      savedContract.state = ContractState.GracePeriod
      await ctx.store.save<RentContract>(savedContract)
    }
  } else {
    savedContract.state = ContractState.GracePeriod
    await ctx.store.save<NodeContract>(savedContract)
  }
}


export async function contractGracePeriodEnded(ctx: EventHandlerContext) {
  const contractGracePeriodEnded = new SmartContractModuleContractGracePeriodEndedEvent(ctx).asV59
  
  let savedContract
  savedContract = await ctx.store.get(NodeContract, { where: { contractID: contractGracePeriodEnded[0] } })
  
  if (!savedContract) {
    savedContract = await ctx.store.get(RentContract, { where: { contractID: contractGracePeriodEnded[0] } })
    if (!savedContract) {
      savedContract = await ctx.store.get(NameContract, { where: { contractID: contractGracePeriodEnded[0] } })
      if (!savedContract) return
      else {
        savedContract.state = ContractState.GracePeriod
        await ctx.store.save<NameContract>(savedContract)
      }
    } else {
      savedContract.state = ContractState.GracePeriod
      await ctx.store.save<RentContract>(savedContract)
    }
  } else {
    savedContract.state = ContractState.GracePeriod
    await ctx.store.save<NodeContract>(savedContract)
  }
}
