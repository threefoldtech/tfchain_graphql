import { Store } from '@subsquid/typeorm-store'
import { Ctx } from '../processor'
import { EventItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'
import { In } from 'typeorm'

import {
  ContractState, PublicIp, Contract,
  ContractBillReport, DiscountLevel,
  Node, NruConsumption, ContractType, Farm
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
  timestamp: bigint
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
    let newNameContract = new Contract()
    newNameContract.id = item.event.id
    newNameContract.type = ContractType.Name
    contract = contractEvent.contractType.value
    newNameContract.name = contract.name.toString()
    newNameContract.contractID = contractEvent.contractId
    newNameContract.gridVersion = contractEvent.version
    newNameContract.twinID = contractEvent.twinId
    newNameContract.state = state
    newNameContract.createdAt = timestamp
    if (contractCreatedEvent.isV105) {
      contractEvent = contractCreatedEvent.asV105
      newNameContract.solutionProviderID = Number(contractEvent.solutionProviderId) || 0
    }

    await ctx.store.save<Contract>(newNameContract)
  }
  else if (contractEvent.contractType.__kind === "NodeContract") {
    let newNodeContract = new Contract()
    newNodeContract.id = item.event.id
    newNodeContract.type = ContractType.Node

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
    newNodeContract.createdAt = timestamp
    if (contractCreatedEvent.isV105) {
      contractEvent = contractCreatedEvent.asV105
      newNodeContract.solutionProviderID = Number(contractEvent.solutionProviderId) || 0
    }

    // Gather IPS and update them
    let touchedIps: PublicIp[] = await ctx.store.find(PublicIp, {
      where: {
        ip: In([...new Set(contract.publicIpsList.map(ip => ip.ip.toString())).keys()])
      }, relations: { farm: true }
    })

    touchedIps = await Promise.all(touchedIps.map(async (ip) => {
      ip.contractId = newNodeContract.contractID
      let farm = await ctx.store.get(Farm, { where: { farmID: ip.farm.farmID } })
      if (farm) {
        farm.freeIps -= 1
        await ctx.store.save<Farm>(farm)
      }
      return ip
    }))

    if (contract.publicIps > 0 && touchedIps.length == 0) {
      console.log(`something went wrong with contract ${contractEvent.contractId}`)
      console.log(`ips: ${contract.publicIpsList}`)
    }

    if (newNodeContract.contractID === BigInt(17661)) {
      console.log('contract found')
      console.log(touchedIps)
    }

    await ctx.store.save(touchedIps)
    await ctx.store.save<Contract>(newNodeContract)
  } else if (contractEvent.contractType.__kind === "RentContract") {
    let newRentContract = new Contract()
    newRentContract.id = item.event.id
    newRentContract.type = ContractType.Rent
    contract = contractEvent.contractType.value

    newRentContract.contractID = contractEvent.contractId
    newRentContract.gridVersion = contractEvent.version
    newRentContract.twinID = contractEvent.twinId
    newRentContract.nodeID = contract.nodeId
    newRentContract.state = state
    newRentContract.createdAt = timestamp
    if (contractCreatedEvent.isV105) {
      contractEvent = contractCreatedEvent.asV105
      newRentContract.solutionProviderID = Number(contractEvent.solutionProviderId) || 0
    }
    await ctx.store.save<Contract>(newRentContract)

    // Update node to dedicated if it is rented
    const savedNode = await ctx.store.get(Node, { where: { nodeID: contract.nodeId }, relations: { location: true, interfaces: true } })
    if (savedNode) {
      savedNode.dedicated = true
      savedNode.rentedBy = newRentContract.twinID
      await ctx.store.save<Node>(savedNode)
    }
  }
}

export async function contractUpdated(
  ctx: Ctx,
  item: EventItem<'SmartContractModule.ContractUpdated', { event: { args: true } }>,
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

  const SavedNodeContract = await ctx.store.get(Contract, { where: { contractID: contractEvent.contractId } })
  if (SavedNodeContract) {
    await updateNodeContract(contractEvent, SavedNodeContract, ctx.store)
    return
  }

  const SavedNameContract = await ctx.store.get(Contract, { where: { contractID: contractEvent.contractId } })
  if (SavedNameContract) {
    await updateNameContract(contractEvent, SavedNameContract, ctx.store)
    return
  }
}

async function updateNodeContract(ctr: any, contract: Contract, store: Store) {
  if (ctr.contractType.__kind !== "NodeContract") return

  const parsedNodeContract = ctr.contractType.value

  contract.contractID = ctr.contractId
  contract.gridVersion = ctr.version
  contract.twinID = ctr.twinId
  contract.nodeID = parsedNodeContract.nodeId
  contract.numberOfPublicIPs = parsedNodeContract.publicIps
  contract.deploymentData = parsedNodeContract.deploymentData
  contract.deploymentHash = parsedNodeContract.deploymentHash

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
  await store.save<Contract>(contract)
}

async function updateNameContract(ctr: any, contract: Contract, store: Store) {
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
  await store.save<Contract>(contract)
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

  const savedContract = await ctx.store.get(Contract, { where: { contractID } })
  if (!savedContract) return

  savedContract.state = ContractState.Deleted
  await ctx.store.save<Contract>(savedContract)

  let savedPublicIPs: PublicIp[] = await ctx.store.find(PublicIp, { where: { contractId: contractID }, relations: { farm: true } })
  Promise.all(savedPublicIPs.map(async (ip) => {
    ip.contractId = null
    const farm = await ctx.store.get(Farm, { where: { farmID: ip.farm.farmID } })
    if (farm) {
      farm.freeIps += 1
      await ctx.store.save<Farm>(farm)
    }

    await ctx.store.save<PublicIp>(ip)
  }))

  if (savedContract.nodeID) {
    const savedNode = await ctx.store.get(Node, { where: { nodeID: savedContract.nodeID } })
    if (!savedNode) return
    savedNode.freeMRU += savedContract.usedMRU || BigInt(0)
    savedNode.freeSRU += savedContract.usedSRU || BigInt(0)
    savedNode.freeHRU += savedContract.usedHRU || BigInt(0)

    await ctx.store.save<Node>(savedNode)
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

  const savedContract = await ctx.store.get(Contract, { where: { contractID } })

  if (!savedContract) return

  savedContract.state = ContractState.Deleted

  await ctx.store.save<Contract>(savedContract)
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

  const savedContract = await ctx.store.get(Contract, { where: { contractID } })

  if (!savedContract) return

  savedContract.state = ContractState.Deleted

  await ctx.store.save<Contract>(savedContract)

  // Update node dedicated status, if the node has an extra fee set, it means it's dedicated
  if (savedContract.nodeID) {
    const savedNode = await ctx.store.get(Node, { where: { nodeID: savedContract.nodeID }, relations: { location: true, interfaces: true } })
    if (savedNode) {
      savedNode.dedicated = savedNode.extraFee !== null
      savedNode.rentedBy = null
      await ctx.store.save<Node>(savedNode)
    }
  }
}

export function collectContractBillReports(ctx: Ctx): ContractBillReport[] {
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

  const savedContract = await ctx.store.get(Contract, { where: { contractID: usedResources.contractId } })
  if (!savedContract) return

  if (savedContract.nodeID) {
    const savedNode = await ctx.store.get(Node, { where: { nodeID: savedContract.nodeID } })
    if (!savedNode) return

    savedNode.freeMRU += (savedContract.usedMRU || BigInt(0)) - usedResources.used.mru
    savedNode.freeHRU += (savedContract.usedHRU || BigInt(0)) - usedResources.used.hru
    savedNode.freeSRU += (savedContract.usedSRU || BigInt(0)) - usedResources.used.sru

    await ctx.store.save<Node>(savedNode)
  }

  savedContract.usedCRU = usedResources.used.cru
  savedContract.usedHRU = usedResources.used.hru
  savedContract.usedMRU = usedResources.used.mru
  savedContract.usedSRU = usedResources.used.sru

  await ctx.store.save<Contract>(savedContract)
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

  const savedNodeContract = await ctx.store.get(Contract, { where: { contractID } })
  if (savedNodeContract) {
    savedNodeContract.state = ContractState.GracePeriod
    await ctx.store.save<Contract>(savedNodeContract)
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

  const contract = await ctx.store.get(Contract, { where: { contractID } })
  if (contract) {
    contract.state = ContractState.Created
    await ctx.store.save<Contract>(contract)
    return
  }
}
