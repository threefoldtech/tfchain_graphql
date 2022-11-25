import {
    EventHandlerContext,
} from "@subsquid/substrate-processor";
import { Deployment } from "../model";
import {
    SmartContractModuleDeploymentCreatedEvent,
    SmartContractModuleDeploymentUpdatedEvent,
    SmartContractModuleDeploymentCanceledEvent
} from "../types/events";
import { createDeployment, updateDeployment } from "./deploymentMappers/v120"

export async function deploymentCreated(ctx: EventHandlerContext) {
    let event = new SmartContractModuleDeploymentCreatedEvent(ctx).asV120
    return createDeployment(ctx.event.id, BigInt(ctx.event.blockTimestamp), event, ctx.store)
}

export async function deploymentUpdated(ctx: EventHandlerContext) {
    let event = new SmartContractModuleDeploymentUpdatedEvent(ctx).asV120
    return updateDeployment(event, ctx.store)
}

export async function deploymentCanceled(ctx: EventHandlerContext) {
    let { deploymentId } = new SmartContractModuleDeploymentCanceledEvent(ctx).asV120

    const savedDeployment = await ctx.store.get(Deployment, { where: { deploymentID: deploymentId } })

    if (!savedDeployment) return

    await ctx.store.delete(Deployment, savedDeployment)
}