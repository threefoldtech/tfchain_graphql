import * as ss58 from "@subsquid/ss58"
import { Provider, SolutionProvider } from "../model"
import { SmartContractModuleSolutionProviderApprovedEvent, SmartContractModuleSolutionProviderCreatedEvent } from "../types/events"
import {
  EventHandlerContext,
} from "../types/context";

export async function solutionProviderCreated(ctx: EventHandlerContext) {
  let providerCreatedEvent = new SmartContractModuleSolutionProviderCreatedEvent(ctx).asV105

  let provider = new SolutionProvider()

  provider.id = ctx.event.id
  provider.solutionProviderID = providerCreatedEvent.solutionProviderId
  provider.description = providerCreatedEvent.description.toString()
  provider.link = providerCreatedEvent.link.toString()
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

export async function solutionProviderApproved(ctx: EventHandlerContext) {
  let providerApprovedEvent = new SmartContractModuleSolutionProviderApprovedEvent(ctx).asV105

  const savedProvider = await ctx.store.get(SolutionProvider, { where: { solutionProviderID: providerApprovedEvent[0] } })
  if (savedProvider) {
    savedProvider.approved = true
    await ctx.store.save<SolutionProvider>(savedProvider)
  }
}