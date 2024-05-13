import * as ss58 from "@subsquid/ss58"
import { Ctx } from '../processor'
import { EventItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'

import { Provider, SolutionProvider } from "../model"
import {
    SmartContractModuleSolutionProviderApprovedEvent,
    SmartContractModuleSolutionProviderCreatedEvent
} from "../types/events"
import { validateString } from "./nodes";

export async function solutionProviderCreated(
    ctx: Ctx,
    item: EventItem<'SmartContractModule.SolutionProviderCreated', { event: { args: true } }>,
) {
    let providerCreatedEvent = new SmartContractModuleSolutionProviderCreatedEvent(ctx, item.event).asV105

    let provider = new SolutionProvider()

    provider.id = item.event.id
    provider.solutionProviderID = providerCreatedEvent.solutionProviderId
    provider.description = validateString(ctx, providerCreatedEvent.description.toString())
    provider.link = validateString(ctx, providerCreatedEvent.link.toString())
    provider.approved = false
    provider.providers = []

    await ctx.store.save<SolutionProvider>(provider)

    provider.providers = providerCreatedEvent.providers.map(p => {
        let prov = new Provider()
        prov.take = p.take
        prov.who = ss58.codec("substrate").encode(p.who)
        return prov
    })

    await ctx.store.save<SolutionProvider>(provider)
}

export async function solutionProviderApproved(
    ctx: Ctx,
    item: EventItem<'SmartContractModule.SolutionProviderApproved', { event: { args: true } }>,
) {
    let providerApprovedEvent = new SmartContractModuleSolutionProviderApprovedEvent(ctx, item.event).asV105

    const savedProvider = await ctx.store.get(SolutionProvider, { where: { solutionProviderID: providerApprovedEvent[0] } })
    if (savedProvider) {
        savedProvider.approved = true
        await ctx.store.save<SolutionProvider>(savedProvider)
    }
}