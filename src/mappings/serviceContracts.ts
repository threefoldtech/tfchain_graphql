import {
    EventHandlerContext,
    Store
} from "@subsquid/substrate-processor";
import { ServiceContract, ServiceContractState, ServiceContractBill } from "../model";
import { SmartContractModuleServiceContractCreatedEvent, SmartContractModuleServiceContractApprovedEvent, SmartContractModuleServiceContractCanceledEvent, SmartContractModuleServiceContractBilledEvent } from "../types/events";

export async function serviceContractCreated(ctx: EventHandlerContext) {
    let serviceContractCreatedEvent = new SmartContractModuleServiceContractCreatedEvent(ctx).asV122

    let serviceContract = new ServiceContract()

    serviceContract.id = ctx.event.id
    serviceContract.serviceContractID = serviceContractCreatedEvent.serviceContractId
    serviceContract.twinID = serviceContractCreatedEvent.serviceTwinId
    serviceContract.consumerTwinID = serviceContractCreatedEvent.consumerTwinId
    serviceContract.baseFee = BigInt(0)
    serviceContract.variableFee = BigInt(0)
    serviceContract.metadata = ""
    serviceContract.acceptedByService = false
    serviceContract.acceptedByConsmer = false
    serviceContract.lastBilled = BigInt(0)
    serviceContract.state = ServiceContractState.Created

    await ctx.store.save<ServiceContract>(serviceContract)
}

export async function serviceContractApproved(ctx: EventHandlerContext) {
    let serviceContractApprovedEvent = new SmartContractModuleServiceContractApprovedEvent(ctx).asV122

    const savedServiceContract = await ctx.store.get(ServiceContract, { where: { serviceContractId: serviceContractApprovedEvent.serviceContractId } })
    if (savedServiceContract) {
        savedServiceContract.acceptedByService = true
        savedServiceContract.acceptedByConsmer = true
        savedServiceContract.state = ServiceContractState.ApprovedByBoth

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
    serviceContractBill.serviceContractID = serviceContractBilledEvent.serviceContractId
    serviceContractBill.variableAmount = serviceContractBilledEvent.bill.variableAmount
    serviceContractBill.window = serviceContractBilledEvent.bill.window
    serviceContractBill.metadata = serviceContractBilledEvent.bill.metadata.toString()

    await ctx.store.save<ServiceContractBill>(serviceContractBill)
}