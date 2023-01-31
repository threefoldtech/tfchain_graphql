import {
    EventHandlerContext,
    Store
} from "@subsquid/substrate-processor";
import { NodePower, PowerState, Power } from "../model";
import { TfgridModulePowerTargetChangedEvent, TfgridModulePowerStateChangedEvent } from "../types/events";
import assert from 'assert'

export async function powerTargetChanged(ctx: EventHandlerContext) {
    let powerTargetChangedEvent = new TfgridModulePowerTargetChangedEvent(ctx).asV123

    let target = Power.Up
    switch (powerTargetChangedEvent.powerTarget.__kind) {
        case 'Up':
            target = Power.Up
            break
        case 'Down':
            target = Power.Down
            break
    }

    const savedNodePower = await ctx.store.get(NodePower, { where: { nodeID: powerTargetChangedEvent.nodeId } })
    if (savedNodePower) {
        assert(savedNodePower.farmID === powerTargetChangedEvent.farmId)
        assert(savedNodePower.nodeID === powerTargetChangedEvent.nodeId)
        savedNodePower.target = target
        await ctx.store.save<NodePower>(savedNodePower)
    } else {
        let newNodePower = new NodePower()
        newNodePower.id = ctx.event.id
        newNodePower.farmID = powerTargetChangedEvent.farmId
        newNodePower.nodeID = powerTargetChangedEvent.nodeId
        newNodePower.state = PowerState.Up
        newNodePower.target = target
        await ctx.store.save<NodePower>(newNodePower)
    }
}

export async function powerStateChanged(ctx: EventHandlerContext) {
    let powerStateChangedEvent = new TfgridModulePowerStateChangedEvent(ctx).asV123

    let state = PowerState.Up
    switch (powerStateChangedEvent.powerState.__kind) {
        case 'Up':
            state = PowerState.Up
            break
        case 'Down':
            state = PowerState.Down
            break
    }

    const savedNodePower = await ctx.store.get(NodePower, { where: { nodeID: powerStateChangedEvent.nodeId } })
    if (savedNodePower) {
        assert(savedNodePower.farmID === powerStateChangedEvent.farmId)
        assert(savedNodePower.nodeID === powerStateChangedEvent.nodeId)
        savedNodePower.state = state
        await ctx.store.save<NodePower>(savedNodePower)
    } else {
        let newNodePower = new NodePower()
        newNodePower.id = ctx.event.id
        newNodePower.farmID = powerStateChangedEvent.farmId
        newNodePower.nodeID = powerStateChangedEvent.nodeId
        newNodePower.state = state
        newNodePower.target = Power.Up
        await ctx.store.save<NodePower>(newNodePower)
    }
}