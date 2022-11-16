import {
  EventHandlerContext,
  Store
} from "@subsquid/substrate-processor";
import { ContractState, PublicIp, NameContract, NodeContract, ContractBillReport, DiscountLevel, ContractResources, NodeResourcesTotal, Node, RentContract, Farm, NruConsumption, CapacityReservationContract, ConsumableResources, ResourcesType, DeploymentContract, DeploymentContractResources } from "../model";
import { SmartContractModuleContractCreatedEvent, SmartContractModuleContractUpdatedEvent, SmartContractModuleNodeContractCanceledEvent, SmartContractModuleNameContractCanceledEvent, SmartContractModuleContractBilledEvent, SmartContractModuleUpdatedUsedResourcesEvent, SmartContractModuleNruConsumptionReportReceivedEvent, SmartContractModuleRentContractCanceledEvent, SmartContractModuleContractGracePeriodStartedEvent, SmartContractModuleContractGracePeriodEndedEvent, SmartContractModuleDeploymentContractCanceledEvent, SmartContractModuleCapacityReservationContractCanceledEvent } from "../types/events";
import { Contract as ContractV119 } from "../types/v119";

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
  } else if (contractCreatedEvent.isV119) {
    return processContractV119(contractCreatedEvent, ctx)
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
    if (contract.deploymentHash.toString().indexOf('\x00')  >= 0) {
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

async function processContractV119(event: SmartContractModuleContractCreatedEvent, ctx: EventHandlerContext) {
  let contractEvent = event.asV119

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
    newNameContract.solutionProviderID = Number(contractEvent.solutionProviderId) || 0
    await ctx.store.save<NameContract>(newNameContract)
  }

  if (contractEvent.contractType.__kind === 'CapacityReservationContract') {
    let newCapacityReservationContract = new CapacityReservationContract()
    newCapacityReservationContract.id = ctx.event.id
    newCapacityReservationContract.contractID = contractEvent.contractId

    contract = contractEvent.contractType.value

    newCapacityReservationContract.state = state
    newCapacityReservationContract.nodeID = contract.nodeId
    let resources = new ConsumableResources()
    
    let totalResources = new ResourcesType()
    totalResources.cru = contract.resources.totalResources.cru
    totalResources.sru = contract.resources.totalResources.sru
    totalResources.hru = contract.resources.totalResources.hru
    totalResources.mru = contract.resources.totalResources.mru
    resources.total = totalResources

    let usedResources = new ResourcesType()
    usedResources.cru = contract.resources.usedResources.cru
    usedResources.sru = contract.resources.usedResources.sru
    usedResources.hru = contract.resources.usedResources.hru
    usedResources.mru = contract.resources.usedResources.mru
    resources.used = usedResources

    newCapacityReservationContract.resources = resources

    newCapacityReservationContract.publicIPs = contract.publicIps

    await ctx.store.save<CapacityReservationContract>(newCapacityReservationContract)
  }

  if (contractEvent.contractType.__kind === 'DeploymentContract') {
    let newDeploymentContract = new DeploymentContract()
    newDeploymentContract.id = ctx.event.id
    newDeploymentContract.contractID = contractEvent.contractId
    newDeploymentContract.twinID = contractEvent.twinId

    contract = contractEvent.contractType.value

    newDeploymentContract.state = state
    newDeploymentContract.createdAt = BigInt(ctx.event.blockTimestamp)

    if (contract.deploymentData.toString().indexOf('\x00') >= 0) {
      newDeploymentContract.deploymentData = ""
    } else {
      newDeploymentContract.deploymentData = contract.deploymentData.toString()
    }
    if (contract.deploymentHash.toString().indexOf('\x00')  >= 0) {
      newDeploymentContract.deploymentHash = ""
    } else {
      newDeploymentContract.deploymentHash = contract.deploymentHash.toString()
    }
    
    newDeploymentContract.capacityReservationID = contract.capacityReservationId
    newDeploymentContract.numberOfPublicIPs = contract.publicIps
    newDeploymentContract.solutionProviderID = Number(contractEvent.solutionProviderId) || 0

    await ctx.store.save<DeploymentContract>(newDeploymentContract)

    let contractResources = new DeploymentContractResources()
    contractResources.id = ctx.event.id
    contractResources.contract = newDeploymentContract

    contractResources.cru = contract.resources.cru
    contractResources.sru = contract.resources.sru
    contractResources.hru = contract.resources.hru
    contractResources.mru = contract.resources.mru

    newDeploymentContract.resourcesUsed = contractResources

    await ctx.store.save<DeploymentContractResources>(contractResources)
    await ctx.store.save<DeploymentContract>(newDeploymentContract)

    contract.publicIpsList.forEach(async ip => {
      if (ip.ip.toString().indexOf('\x00') >= 0) {
        return
      }
      const savedIp = await ctx.store.get(PublicIp, { where: { ip: ip.ip.toString() } })

      if (savedIp) {
        savedIp.contractId = newDeploymentContract.contractID
        await ctx.store.save<PublicIp>(savedIp)
      }
    })
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
  } else if (contractUpdatedEvent.isV119) {
    processContractV119Update(contractUpdatedEvent, ctx)
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

async function processContractV119Update(event: SmartContractModuleContractUpdatedEvent, ctx: EventHandlerContext) {
  let contractEvent = event.asV119

  if (!contractEvent) return

  if (contractEvent.contractType.__kind === 'NameContract') {
    const SavedNameContract = await ctx.store.get(NameContract, { where: { contractID: contractEvent.contractId } })
    if (SavedNameContract) {
      await updateNameContract(contractEvent, SavedNameContract, ctx.store)
    }
  }

  if (contractEvent.contractType.__kind === 'CapacityReservationContract') {
    const savedCapacityContract = await ctx.store.get(CapacityReservationContract, { where: { contractID: contractEvent.contractId } })
    if (savedCapacityContract) {
      await updateCapacityReservationContract(contractEvent, savedCapacityContract, ctx.store)
    }
  }

  if (contractEvent.contractType.__kind === 'DeploymentContract') {
    const savedDeploymentContract = await ctx.store.get(DeploymentContract, { where: { contractID: contractEvent.contractId } })
    if (savedDeploymentContract) {
      await updateDeploymentContract(contractEvent, savedDeploymentContract, ctx.store)
    }
  }
}

async function updateCapacityReservationContract(ctr: any, contract: CapacityReservationContract, store: Store) {
  const parsedCapacityContract = ctr.contractType.value as CapacityReservationContract

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

  contract.nodeID = parsedCapacityContract.nodeID
  contract.publicIPs = parsedCapacityContract.publicIPs

  let totalResources = new ResourcesType()
  totalResources.cru = parsedCapacityContract.resources?.total.cru
  totalResources.sru = parsedCapacityContract.resources?.total.sru
  totalResources.hru = parsedCapacityContract.resources?.total.hru
  totalResources.mru = parsedCapacityContract.resources?.total.mru

  let usedResources = new ResourcesType()
  usedResources.cru = parsedCapacityContract.resources?.used.cru
  usedResources.sru = parsedCapacityContract.resources?.used.sru
  usedResources.hru = parsedCapacityContract.resources?.used.hru
  usedResources.mru = parsedCapacityContract.resources?.used.mru

  let resources = new ConsumableResources()

  contract.resources = resources
  contract.resources.total = totalResources
  contract.resources.used = usedResources

  await store.save<CapacityReservationContract>(contract)
}

async function updateDeploymentContract(ctr: any, contract: DeploymentContract, store: Store) {
    if (ctr.contractType.__kind !== 'DeploymentContract') return

    const parsedDeploymentContract = ctr.contractType.value

    contract.contractID = ctr.contractId
    contract.twinID = ctr.twinId
    contract.numberOfPublicIPs = parsedDeploymentContract.publicIps

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
  
    const savedDeploymentContractRsources = await store.get(DeploymentContractResources, { where: { contract }})
    if (savedDeploymentContractRsources) {
      savedDeploymentContractRsources.cru = ctr.resources.cru 
      savedDeploymentContractRsources.sru = ctr.resources.sru 
      savedDeploymentContractRsources.hru = ctr.resources.hru 
      savedDeploymentContractRsources.mru = ctr.resources.mru 
      await store.save<DeploymentContractResources>(savedDeploymentContractRsources)
    }
  
    contract.resourcesUsed = savedDeploymentContractRsources
    
    await store.save<DeploymentContract>(contract)
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
  const contractID = new SmartContractModuleCapacityReservationContractCanceledEvent(ctx).asV119.contractId

  const savedContract = await ctx.store.get(CapacityReservationContract, { where: { contractID } })

  if (!savedContract) return

  savedContract.state = ContractState.Deleted

  await ctx.store.save<CapacityReservationContract>(savedContract)
}

export async function deploymentContractCanceled(ctx: EventHandlerContext) {
  const contractID = new SmartContractModuleDeploymentContractCanceledEvent(ctx).asV119.contractId

  const savedContract = await ctx.store.get(DeploymentContract, { where: { contractID } })

  if (!savedContract) return

  savedContract.state = ContractState.Deleted

  await ctx.store.save<DeploymentContract>(savedContract)
}