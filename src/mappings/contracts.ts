import {
  EventHandlerContext,
  Store
} from "@subsquid/substrate-processor";
import {
  ContractState, PublicIp, NameContract, NodeContract, ContractBillReport, DiscountLevel,
  ContractResources, Node, RentContract, NruConsumption,
  CapacityReservationContract, Resources, ConsumableResources
} from "../model";
import {
  SmartContractModuleContractCreatedEvent, SmartContractModuleContractUpdatedEvent, SmartContractModuleNodeContractCanceledEvent,
  SmartContractModuleNameContractCanceledEvent, SmartContractModuleContractBilledEvent, SmartContractModuleUpdatedUsedResourcesEvent,
  SmartContractModuleNruConsumptionReportReceivedEvent, SmartContractModuleRentContractCanceledEvent, SmartContractModuleContractGracePeriodStartedEvent,
  SmartContractModuleContractGracePeriodEndedEvent, SmartContractModuleCapacityReservationContractCanceledEvent,
} from "../types/events";
import { processContractV119Create, processContractV119Update } from './contractMappers/v120'

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
  } else if (contractCreatedEvent.isV101) {
    contractEvent = contractCreatedEvent.asV101
  } else if (contractCreatedEvent.isV105) {
    contractEvent = contractCreatedEvent.asV105
  } else if (contractCreatedEvent.isV120) {
    return processContractV119Create(contractCreatedEvent, ctx)
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
    if (contractCreatedEvent.isV105) {
      contractEvent = contractCreatedEvent.asV105
      newNameContract.solutionProviderID = Number(contractEvent.solutionProviderId) || 0
    }
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

    if (contract.deploymentData.toString().indexOf('\x00') >= 0) {
      newNodeContract.deploymentData = ""
    } else {
      newNodeContract.deploymentData = contract.deploymentData.toString()
    }
    if (contract.deploymentHash.toString().indexOf('\x00') >= 0) {
      newNodeContract.deploymentHash = ""
    } else {
      newNodeContract.deploymentHash = contract.deploymentHash.toString()
    }

    // newNodeContract.deploymentHash = contract.deploymentHash.toString()
    newNodeContract.state = state
    newNodeContract.createdAt = BigInt(ctx.event.blockTimestamp)
    if (contractCreatedEvent.isV105) {
      contractEvent = contractCreatedEvent.asV105
      newNodeContract.solutionProviderID = Number(contractEvent.solutionProviderId) || 0
    }

    await ctx.store.save<NodeContract>(newNodeContract)

    contract.publicIpsList.forEach(async ip => {
      if (ip.ip.toString().indexOf('\x00') >= 0) {
        return
      }
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
    if (contractCreatedEvent.isV105) {
      contractEvent = contractCreatedEvent.asV105
      newRentContract.solutionProviderID = Number(contractEvent.solutionProviderId) || 0
    }
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
  } else if (contractUpdatedEvent.isV101) {
    contractEvent = contractUpdatedEvent.asV101
  } else if (contractUpdatedEvent.isV120) {
    return processContractV119Update(contractUpdatedEvent, ctx)
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

  if (contract.deploymentData.toString().indexOf('\x00') >= 0) {
    contract.deploymentData = ""
  } else {
    contract.deploymentData = contract.deploymentData.toString()
  }
  if (contract.deploymentHash.toString().indexOf('\x00') >= 0) {
    contract.deploymentHash = ""
  } else {
    contract.deploymentHash = contract.deploymentHash.toString()
  }

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
  let cancel = new SmartContractModuleNodeContractCanceledEvent(ctx)

  let contractID = BigInt(0)
  if (cancel.isV19) {
    contractID = cancel.asV19[0]
  } else if (cancel.isV105) {
    contractID = cancel.asV105.contractId
  }

  if (contractID === BigInt(0)) return

  const savedContract = await ctx.store.get(NodeContract, { where: { contractID } })

  if (!savedContract) return

  savedContract.state = ContractState.Deleted
  await ctx.store.save<NodeContract>(savedContract)

  const savedNode = await ctx.store.get(Node, { where: { nodeID: savedContract.nodeID } })
  if (!savedNode) return

  const savedPublicIP = await ctx.store.get(PublicIp, { where: { contractId: savedContract.contractID } })
  if (savedPublicIP) {
    savedPublicIP.contractId = BigInt(0)
    await ctx.store.save<PublicIp>(savedPublicIP)
  }
}

export async function nameContractCanceled(ctx: EventHandlerContext) {
  const cancel = new SmartContractModuleNameContractCanceledEvent(ctx)

  let contractID = BigInt(0)
  if (cancel.isV19) {
    contractID = cancel.asV19
  } else if (cancel.isV105) {
    contractID = cancel.asV105.contractId
  }

  if (contractID === BigInt(0)) return

  const savedContract = await ctx.store.get(NameContract, { where: { contractID } })

  if (!savedContract) return

  savedContract.state = ContractState.Deleted

  await ctx.store.save<NameContract>(savedContract)
}

export async function rentContractCanceled(ctx: EventHandlerContext) {
  const cancel = new SmartContractModuleRentContractCanceledEvent(ctx)

  let contractID = BigInt(0)
  if (cancel.isV50) {
    contractID = cancel.asV50
  } else if (cancel.isV105) {
    contractID = cancel.asV105.contractId
  }

  if (contractID === BigInt(0)) return

  const savedContract = await ctx.store.get(RentContract, { where: { contractID } })

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

  const savedContractResources = await ctx.store.get(ContractResources, { where: { contract: savedContract } })
  if (savedContractResources) {
    savedContractResources.cru = usedResources.used.cru
    savedContractResources.sru = usedResources.used.sru
    savedContractResources.hru = usedResources.used.hru
    savedContractResources.mru = usedResources.used.mru
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
  let contractID = BigInt(0)

  const contractGracePeriodStartedEvent = new SmartContractModuleContractGracePeriodStartedEvent(ctx)
  if (contractGracePeriodStartedEvent.isV59) {
    contractID = contractGracePeriodStartedEvent.asV59[0]
  } else if (contractGracePeriodStartedEvent.isV105) {
    contractID = contractGracePeriodStartedEvent.asV105.contractId
  }

  const savedNodeContract = await ctx.store.get(NodeContract, { where: { contractID } })
  if (savedNodeContract) {
    savedNodeContract.state = ContractState.GracePeriod
    await ctx.store.save<NodeContract>(savedNodeContract)
    return
  }

  const savedRentContract = await ctx.store.get(RentContract, { where: { contractID } })
  if (savedRentContract) {
    savedRentContract.state = ContractState.GracePeriod
    await ctx.store.save<RentContract>(savedRentContract)
    return
  }

  const savedNameContract = await ctx.store.get(NameContract, { where: { contractID } })
  if (savedNameContract) {
    savedNameContract.state = ContractState.GracePeriod
    await ctx.store.save<NameContract>(savedNameContract)
    return
  }
}

export async function contractGracePeriodEnded(ctx: EventHandlerContext) {
  let contractID = BigInt(0)

  const contractGracePeriodEnded = new SmartContractModuleContractGracePeriodEndedEvent(ctx)
  if (contractGracePeriodEnded.isV59) {
    contractID = contractGracePeriodEnded.asV59[0]
  } else if (contractGracePeriodEnded.isV105) {
    contractID = contractGracePeriodEnded.asV105.contractId
  }

  const savedNodeContract = await ctx.store.get(NodeContract, { where: { contractID } })
  if (savedNodeContract) {
    savedNodeContract.state = ContractState.Created
    await ctx.store.save<NodeContract>(savedNodeContract)
    return
  }

  const savedRentContract = await ctx.store.get(RentContract, { where: { contractID } })
  if (savedRentContract) {
    savedRentContract.state = ContractState.Created
    await ctx.store.save<RentContract>(savedRentContract)
    return
  }

  const savedNameContract = await ctx.store.get(NameContract, { where: { contractID } })
  if (savedNameContract) {
    savedNameContract.state = ContractState.Created
    await ctx.store.save<NameContract>(savedNameContract)
    return
  }
}

export async function capacityReservationContractCanceled(ctx: EventHandlerContext) {
  const contractID = new SmartContractModuleCapacityReservationContractCanceledEvent(ctx).asV120.contractId

  const savedContract = await ctx.store.get(CapacityReservationContract, { where: { contractID } })

  if (!savedContract) return

  savedContract.state = ContractState.Deleted

  await ctx.store.save<CapacityReservationContract>(savedContract)
}

