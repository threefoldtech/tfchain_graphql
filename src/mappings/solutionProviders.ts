import {
  EventHandlerContext,
  Store
} from "@subsquid/substrate-processor";
import { Provider, SolutionProvider } from "../model";
import { SmartContractModuleSolutionProviderApprovedEvent, SmartContractModuleSolutionProviderCreatedEvent } from "../types/events";

export async function solutionProviderCreated(ctx: EventHandlerContext) {
  let providerCreatedEvent = new SmartContractModuleSolutionProviderCreatedEvent(ctx).asV105

  let provider = new SolutionProvider()

  provider.id = ctx.event.id
  provider.solutionProviderID = Number(providerCreatedEvent.solutionProviderId)
  provider.description = providerCreatedEvent.description.toString()
  provider.link = providerCreatedEvent.link.toString()
  provider.approved = false

  await ctx.store.save<SolutionProvider>(provider)

  provider.providers = providerCreatedEvent.providers.map(p => {
    let prov = new Provider()
    prov.id = ctx.event.id
    prov.solutionProvider = provider
    prov.take = p.take
    prov.who = p.who.toString()
    return prov
  })

  provider.providers

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