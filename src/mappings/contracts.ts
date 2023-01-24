import { Store } from '@subsquid/typeorm-store'
import { Ctx } from '../processor'
import { EventItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'

import { 
  ContractState, PublicIp, NameContract, 
  NodeContract, ContractBillReport, DiscountLevel, 
  ContractResources, Node, RentContract, NruConsumption 
} from "../model";
import { 
  SmartContractModuleContractCreatedEvent, SmartContractModuleContractUpdatedEvent, 
  SmartContractModuleNodeContractCanceledEvent, SmartContractModuleNameContractCanceledEvent, 
  SmartContractModuleContractBilledEvent, SmartContractModuleUpdatedUsedResourcesEvent, 
  SmartContractModuleNruConsumptionReportReceivedEvent, SmartContractModuleRentContractCanceledEvent, 
  SmartContractModuleContractGracePeriodStartedEvent, SmartContractModuleContractGracePeriodEndedEvent 
} from "../types/events";

export async function contractCreated(
  ctx: Ctx,
  item: EventItem<'SmartContractModule.ContractCreated', { event: { args: true } }>,
  timestamp: number
): Promise<void> {
  let contractCreatedEvent = new SmartContractModuleContractCreatedEvent(ctx, item.event)

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
  }

  if (!contractEvent) return

  let state = ContractState.Created

  let contract
  if (contractEvent.contractType.__kind === "NameContract") {
    let newNameContract = new NameContract()
    newNameContract.id = item.event.id
    contract = contractEvent.contractType.value
    newNameContract.name = contract.name.toString()
    newNameContract.contractID = contractEvent.contractId
    newNameContract.gridVersion = contractEvent.version
    newNameContract.twinID = contractEvent.twinId
    newNameContract.state = state
    newNameContract.createdAt = BigInt(timestamp)
    if (contractCreatedEvent.isV105) {
      contractEvent = contractCreatedEvent.asV105
      newNameContract.solutionProviderID = Number(contractEvent.solutionProviderId) || 0
    }
    await ctx.store.save<NameContract>(newNameContract)
  }
  else if (contractEvent.contractType.__kind === "NodeContract") {
    let newNodeContract = new NodeContract()
    newNodeContract.id = item.event.id

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
    if (contract.deploymentHash.toString().indexOf('\x00')  >= 0) {
      newNodeContract.deploymentHash = ""
    } else {
      newNodeContract.deploymentHash = contract.deploymentHash.toString()
    }

    // newNodeContract.deploymentHash = contract.deploymentHash.toString()
    newNodeContract.state = state
    newNodeContract.createdAt = BigInt(timestamp)
    if (contractCreatedEvent.isV105) {
      contractEvent = contractCreatedEvent.asV105
      newNodeContract.solutionProviderID = Number(contractEvent.solutionProviderId) || 0
    }

    const ipPromises = contract.publicIpsList.map(async ip => {
      if (ip.ip.toString().indexOf('\x00') >= 0) {
        return
      }
      const savedIp = await ctx.store.get(PublicIp, { where: { ip: ip.ip.toString() } ,relations: { farm: true } })

      if (savedIp) {
        savedIp.contractId = newNodeContract.contractID
        return ctx.store.save<PublicIp>(savedIp)
      }
    })

    await Promise.all(ipPromises)

    await ctx.store.save<NodeContract>(newNodeContract)
  } else if (contractEvent.contractType.__kind === "RentContract") {
    let newRentContract = new RentContract()
    newRentContract.id = item.event.id

    contract = contractEvent.contractType.value

    newRentContract.contractID = contractEvent.contractId
    newRentContract.gridVersion = contractEvent.version
    newRentContract.twinID = contractEvent.twinId
    newRentContract.nodeID = contract.nodeId
    newRentContract.state = state
    newRentContract.createdAt = BigInt(timestamp)
    if (contractCreatedEvent.isV105) {
      contractEvent = contractCreatedEvent.asV105
      newRentContract.solutionProviderID = Number(contractEvent.solutionProviderId) || 0
    }
    await ctx.store.save<RentContract>(newRentContract)
  }
}

export async function contractUpdated(
  ctx: Ctx,
  item: EventItem<'SmartContractModule.ContractUpdated', { event: { args: true } }>,
  timestamp: number
) {
  const contractUpdatedEvent = new SmartContractModuleContractUpdatedEvent(ctx, item.event)

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
  if (contract.deploymentHash.toString().indexOf('\x00')  >= 0) {
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

export async function nodeContractCanceled(
  ctx: Ctx,
  item: EventItem<'SmartContractModule.NodeContractCanceled', { event: { args: true } }>,
) {
  let cancel = new SmartContractModuleNodeContractCanceledEvent(ctx, item.event)

  let contractID = BigInt(0)
  if (cancel.isV49) {
    contractID = cancel.asV49[0]
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

  const savedPublicIP = await ctx.store.get(PublicIp, { where: { contractId: savedContract.contractID }, relations: { farm: true } })
  if (savedPublicIP) {
    savedPublicIP.contractId = BigInt(0)
    await ctx.store.save<PublicIp>(savedPublicIP)
  }
}

export async function nameContractCanceled(
  ctx: Ctx,
  item: EventItem<'SmartContractModule.NameContractCanceled', { event: { args: true } }>,
) {
  const cancel = new SmartContractModuleNameContractCanceledEvent(ctx, item.event)

  let contractID = BigInt(0)
  if (cancel.isV49) {
    contractID = cancel.asV49
  } else if (cancel.isV105) {
    contractID = cancel.asV105.contractId
  }

  if (contractID === BigInt(0)) return

  const savedContract = await ctx.store.get(NameContract, { where: { contractID } })

  if (!savedContract) return

  savedContract.state = ContractState.Deleted

  await ctx.store.save<NameContract>(savedContract)
}

export async function rentContractCanceled(
  ctx: Ctx,
  item: EventItem<'SmartContractModule.RentContractCanceled', { event: { args: true } }>,
) {
  const cancel = new SmartContractModuleRentContractCanceledEvent(ctx, item.event)

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

export function collectContractBillReports (ctx: Ctx): ContractBillReport[] {
  let list: ContractBillReport[] = []
  for (let block of ctx.blocks) {
    for (let item of block.items) {
      if (item.name === "SmartContractModule.ContractBilled") {
        const contractBilledEvent = new SmartContractModuleContractBilledEvent(ctx, item.event).asV9

        const newContractBilledReport = new ContractBillReport()

        newContractBilledReport.id = item.event.id
        newContractBilledReport.contractID = contractBilledEvent.contractId
      
        let level = DiscountLevel.None
        switch (contractBilledEvent.discountLevel.__kind) {
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
        newContractBilledReport.amountBilled = contractBilledEvent.amountBilled
        newContractBilledReport.timestamp = contractBilledEvent.timestamp

        list.push(newContractBilledReport)
      }
    }
  }

  return list
}

export async function contractBilled(
  ctx: Ctx,
  item: EventItem<'SmartContractModule.ContractBilled', { event: { args: true } }>,
) {
  const contract_billed_event = new SmartContractModuleContractBilledEvent(ctx, item.event).asV9

  const newContractBilledReport = new ContractBillReport()

  newContractBilledReport.id = item.event.id
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

export async function contractUpdateUsedResources(
  ctx: Ctx,
  item: EventItem<'SmartContractModule.UpdatedUsedResources', { event: { args: true } }>,
) {
  const usedResources = new SmartContractModuleUpdatedUsedResourcesEvent(ctx, item.event).asV49

  const contractUsedResources = new ContractResources()

  const savedContract = await ctx.store.get(NodeContract, { where: { contractID: usedResources.contractId } })
  if (!savedContract) return

  const savedContractResources = await ctx.store.get(ContractResources, { where: { contract: { contractID: savedContract.contractID } }, relations: { contract: true } })
  if (savedContractResources) {
    savedContractResources.cru = usedResources.used.cru
    savedContractResources.sru = usedResources.used.sru
    savedContractResources.hru = usedResources.used.hru
    savedContractResources.mru = usedResources.used.mru
    await ctx.store.save<ContractResources>(savedContractResources)

    savedContract.resourcesUsed = savedContractResources
    await ctx.store.save<NodeContract>(savedContract)
  } else {
    contractUsedResources.id = item.event.id
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

export async function nruConsumptionReportReceived(
  ctx: Ctx,
  item: EventItem<'SmartContractModule.NruConsumptionReportReceived', { event: { args: true } }>,
) {
  const nruConsumptionReportEvent = new SmartContractModuleNruConsumptionReportReceivedEvent(ctx, item.event).asV49

  const nruConsumption = new NruConsumption()

  nruConsumption.id = item.event.id
  nruConsumption.contractID = nruConsumptionReportEvent.contractId
  nruConsumption.nru = nruConsumptionReportEvent.nru
  nruConsumption.timestamp = nruConsumptionReportEvent.timestamp
  nruConsumption.window = nruConsumptionReportEvent.window

  await ctx.store.save<NruConsumption>(nruConsumption)
}

export async function contractGracePeriodStarted(
  ctx: Ctx,
  item: EventItem<'SmartContractModule.ContractGracePeriodStarted', { event: { args: true } }>,
) {
  const contractGracePeriodStartedEvent = new SmartContractModuleContractGracePeriodStartedEvent(ctx, item.event)
  let contractID

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


export async function contractGracePeriodEnded(
  ctx: Ctx,
  item: EventItem<'SmartContractModule.ContractGracePeriodEnded', { event: { args: true } }>,
) {
  const contractGracePeriodEnded = new SmartContractModuleContractGracePeriodEndedEvent(ctx, item.event)
  let contractID

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
