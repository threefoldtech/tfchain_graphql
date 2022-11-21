import { Store, EventHandlerContext } from "@subsquid/substrate-processor";
import { CapacityReservationContract, ConsumableResources, Resources, ContractState, NameContract } from "../../model";
// import { updateNameContract } from '../contracts'
import { Contract as ContractV119 } from "../../types/v119";
import { SmartContractModuleContractUpdatedEvent, SmartContractModuleContractCreatedEvent } from "../../types/events"

export async function processContractV119Create(event: SmartContractModuleContractCreatedEvent, ctx: EventHandlerContext) {
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
        return createCapacityContract(ctx.event.id, contractEvent, ctx.store)
    }
}


export async function processContractV119Update(event: SmartContractModuleContractUpdatedEvent, ctx: EventHandlerContext) {
    let contractEvent = event.asV119

    if (!contractEvent) return

    if (contractEvent.contractType.__kind === 'NameContract') {
        await updateNameContract(contractEvent, ctx.store)
    }

    if (contractEvent.contractType.__kind === 'CapacityReservationContract') {
        await updateCapacityContract(contractEvent, ctx.store)
    }
}

export async function createCapacityContract(id: string, ctr: ContractV119, store: Store) {
    let cap
    if (ctr.contractType.__kind === 'CapacityReservationContract') {
        cap = ctr.contractType.value
    }

    if (!cap) return

    let newCapacityReservationContract = new CapacityReservationContract()
    newCapacityReservationContract.id = id
    newCapacityReservationContract.contractID = ctr.contractId
    newCapacityReservationContract.publicIPs = cap.publicIps

    newCapacityReservationContract.state = ContractState.Created
    newCapacityReservationContract.nodeID = cap.nodeId
    await store.save<CapacityReservationContract>(newCapacityReservationContract)

    const consumableResources = new ConsumableResources()
    consumableResources.id = id
    consumableResources.contract = newCapacityReservationContract

    const resourcesTotal = new Resources()
    resourcesTotal.cru = cap.resources.totalResources.cru
    resourcesTotal.sru = cap.resources.totalResources.sru
    resourcesTotal.hru = cap.resources.totalResources.hru
    resourcesTotal.mru = cap.resources.totalResources.mru
    consumableResources.total = resourcesTotal

    const resourcesUsed = new Resources()
    resourcesUsed.cru = cap.resources.usedResources.cru
    resourcesUsed.sru = cap.resources.usedResources.cru
    resourcesUsed.hru = cap.resources.usedResources.cru
    resourcesUsed.mru = cap.resources.usedResources.cru
    consumableResources.used = resourcesUsed

    await store.save<ConsumableResources>(consumableResources)

    // newCapacityReservationContract.resources = consumableResources

    await store.save<CapacityReservationContract>(newCapacityReservationContract)
}

export async function updateCapacityContract(ctr: ContractV119, store: Store) {
    let savedCapacityContract = await store.get(CapacityReservationContract, { where: { contractID: ctr.contractId } })
    if (!savedCapacityContract) return

    let cap
    if (ctr.contractType.__kind === 'CapacityReservationContract') {
        cap = ctr.contractType.value
    }

    if (!cap) return

    let state = ContractState.OutOfFunds
    switch (ctr.state.__kind) {
        case 'Created':
            state = ContractState.Created
            break
        case 'Deleted':
            state = ContractState.Deleted
            break
    }

    savedCapacityContract.state = state
    savedCapacityContract.nodeID = Number(cap?.nodeId || 0)
    savedCapacityContract.publicIPs = Number(cap?.publicIps || 0)
    await store.save<CapacityReservationContract>(savedCapacityContract)

    let savedResources = await store.get(ConsumableResources, { where: { savedCapacityContract } })
    if (!savedResources) return

    savedResources.total.cru = cap.resources.totalResources.cru
    savedResources.total.sru = cap.resources.totalResources.sru
    savedResources.total.hru = cap.resources.totalResources.hru
    savedResources.total.mru = cap.resources.totalResources.mru

    savedResources.used.cru = cap.resources.usedResources.cru
    savedResources.used.sru = cap.resources.usedResources.sru
    savedResources.used.hru = cap.resources.usedResources.hru
    savedResources.used.mru = cap.resources.usedResources.mru

    await store.save<ConsumableResources>(savedResources)
}

async function updateNameContract(ctr: any, store: Store) {
    let savedNameContract = await store.get(NameContract, { where: { contractID: ctr.contractId } })
    if (!savedNameContract) return

    if (ctr.contractType.__kind !== "NameContract") return

    const parsedNameContract = ctr.contractType.value

    savedNameContract.contractID = ctr.contractId
    savedNameContract.gridVersion = ctr.version
    savedNameContract.twinID = ctr.twinId
    savedNameContract.name = parsedNameContract.name.toString()

    let state = ContractState.OutOfFunds
    switch (ctr.state.__kind) {
        case 'Created':
            state = ContractState.Created
            break
        case 'Deleted':
            state = ContractState.Deleted
            break
    }
    savedNameContract.state = state
    await store.save<NameContract>(savedNameContract)
}