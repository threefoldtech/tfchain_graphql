import {
    EventHandlerContext,
    Store
} from "@subsquid/substrate-processor";
import { ServiceContract, ServiceContractState, ServiceContractBill } from "../model";
import { SmartContractModuleServiceContractCreatedEvent, SmartContractModuleServiceContractMetadataSetEvent, SmartContractModuleServiceContractFeesSetEvent, SmartContractModuleServiceContractApprovedEvent, SmartContractModuleServiceContractCanceledEvent, SmartContractModuleServiceContractBilledEvent } from "../types/events";

export async function serviceContractCreated(ctx: EventHandlerContext) {
    let serviceContractCreatedEvent = new SmartContractModuleServiceContractCreatedEvent(ctx).asV122

    let serviceContract = new ServiceContract()

    serviceContract.id = ctx.event.id
    serviceContract.serviceContractID = serviceContractCreatedEvent.serviceContractId
    serviceContract.serviceTwinID = serviceContractCreatedEvent.serviceTwinId
    serviceContract.consumerTwinID = serviceContractCreatedEvent.consumerTwinId
    serviceContract.baseFee = BigInt(0)
    serviceContract.variableFee = BigInt(0)
    serviceContract.metadata = ""
    serviceContract.acceptedByService = false
    serviceContract.acceptedByConsumer = false
    serviceContract.lastBill = BigInt(0)
    serviceContract.state = ServiceContractState.Created
    await ctx.store.save<ServiceContract>(serviceContract)
}

export async function serviceContractMetadataSet(ctx: EventHandlerContext) {
    let serviceContractMetadataSetEvent = new SmartContractModuleServiceContractMetadataSetEvent(ctx).asV122

    const savedServiceContract = await ctx.store.get(ServiceContract, { where: { serviceContractId: serviceContractMetadataSetEvent.serviceContractId } })
    if (savedServiceContract) {
        savedServiceContract.metadata = serviceContractMetadataSetEvent.metadata.toString()

        let state = ServiceContractState.Created
        switch (serviceContractMetadataSetEvent.state.__kind) {
            case 'AgreementReady':
                state = ServiceContractState.AgreementReady
                break
            case 'ApprovedByBoth':
                state = ServiceContractState.ApprovedByBoth
                break
        }
        savedServiceContract.state = state
        await ctx.store.save<ServiceContract>(savedServiceContract)
    }
}

export async function serviceContractFeesSet(ctx: EventHandlerContext) {
    let serviceContractFeesSetEvent = new SmartContractModuleServiceContractFeesSetEvent(ctx).asV122

    const savedServiceContract = await ctx.store.get(ServiceContract, { where: { serviceContractId: serviceContractFeesSetEvent.serviceContractId } })
    if (savedServiceContract) {
        savedServiceContract.baseFee = serviceContractFeesSetEvent.baseFee
        savedServiceContract.variableFee = serviceContractFeesSetEvent.variableFee

        let state = ServiceContractState.Created
        switch (serviceContractFeesSetEvent.state.__kind) {
            case 'AgreementReady':
                state = ServiceContractState.AgreementReady
                break
            case 'ApprovedByBoth':
                state = ServiceContractState.ApprovedByBoth
                break
        }
        savedServiceContract.state = state
        await ctx.store.save<ServiceContract>(savedServiceContract)
    }
}

export async function serviceContractApproved(ctx: EventHandlerContext) {
    let serviceContractApprovedEvent = new SmartContractModuleServiceContractApprovedEvent(ctx).asV122

    const savedServiceContract = await ctx.store.get(ServiceContract, { where: { serviceContractId: serviceContractApprovedEvent.serviceContractId } })
    if (savedServiceContract) {
        savedServiceContract.acceptedByService = serviceContractApprovedEvent.acceptedByService
        savedServiceContract.acceptedByConsumer = serviceContractApprovedEvent.acceptedByConsumer
        savedServiceContract.lastBill = serviceContractApprovedEvent.lastBill

        let state = ServiceContractState.Created
        switch (serviceContractApprovedEvent.state.__kind) {
            case 'AgreementReady':
                state = ServiceContractState.AgreementReady
                break
            case 'ApprovedByBoth':
                state = ServiceContractState.ApprovedByBoth
                break
        }
        savedServiceContract.state = state
        await ctx.store.save<ServiceContract>(savedServiceContract)
    }
}

export async function serviceContractCanceled(ctx: EventHandlerContext) {
    const serviceContractCanceledEvent = new SmartContractModuleServiceContractCanceledEvent(ctx).asV122

    const savedServiceContract = await ctx.store.get(ServiceContract, { where: { serviceContractId: serviceContractCanceledEvent.serviceContractId } })

    if (savedServiceContract) {
        await ctx.store.remove(savedServiceContract)
    }
}

export async function serviceContractBilled(ctx: EventHandlerContext) {
    const serviceContractBilledEvent = new SmartContractModuleServiceContractBilledEvent(ctx).asV122

    const serviceContractBill = new ServiceContractBill()

    serviceContractBill.id = ctx.event.id
    serviceContractBill.serviceContractID = serviceContractBilledEvent.serviceContract.serviceContractId
    serviceContractBill.variableAmount = serviceContractBilledEvent.bill.variableAmount
    serviceContractBill.window = serviceContractBilledEvent.bill.window
    serviceContractBill.metadata = serviceContractBilledEvent.bill.metadata.toString()
    serviceContractBill.amount = serviceContractBilledEvent.amount
    await ctx.store.save<ServiceContractBill>(serviceContractBill)

    const savedServiceContract = await ctx.store.get(ServiceContract, { where: { serviceContractId: serviceContractBilledEvent.serviceContract.serviceContractId } })
    if (savedServiceContract) {
        savedServiceContract.lastBill = serviceContractBilledEvent.serviceContract.lastBill
        await ctx.store.save<ServiceContract>(savedServiceContract)
    }
}