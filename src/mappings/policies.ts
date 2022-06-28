import {
    EventHandlerContext,
  } from "@subsquid/substrate-processor";
import { PricingPolicy, FarmingPolicy, Policy, FarmCertification, NodeCertification, Farm } from "../model";
import { TfgridModulePricingPolicyStoredEvent, TfgridModuleFarmingPolicyStoredEvent, TfgridModuleFarmingPolicyUpdatedEvent, TfgridModuleFarmingPolicySetEvent, TfgridModuleFarmCertificationSetEvent } from "../types/events";
import * as ss58 from "@subsquid/ss58";

export async function pricingPolicyStored(ctx: EventHandlerContext) {
  let pricingPolicyEvent = new TfgridModulePricingPolicyStoredEvent(ctx)

  let pricingPolicyEventParsed

  if (pricingPolicyEvent.isV9) {
    pricingPolicyEventParsed = pricingPolicyEvent.asV9
  } else if (pricingPolicyEvent.isV51) {
    pricingPolicyEventParsed = pricingPolicyEvent.asV51
  } else if (pricingPolicyEvent.isV101) {
    pricingPolicyEventParsed = pricingPolicyEvent.asV101
  }

  if (!pricingPolicyEventParsed) return
  
  let pricingPolicy = new PricingPolicy()
  pricingPolicy.id = ctx.event.id

  const savedPolicy = await ctx.store.get(PricingPolicy, { where: { pricingPolicyID: pricingPolicyEventParsed.id }})
  if (savedPolicy) {
    pricingPolicy = savedPolicy
  }

  pricingPolicy.gridVersion = pricingPolicyEventParsed.version
  pricingPolicy.pricingPolicyID = pricingPolicyEventParsed.id
  pricingPolicy.name = pricingPolicyEventParsed.name.toString()
  pricingPolicy.dedicatedNodeDiscount = 0

  const foundationAccount = ss58.codec("substrate").encode(pricingPolicyEventParsed.foundationAccount);
  const certifiedSalesAccount = ss58.codec("substrate").encode(pricingPolicyEventParsed.certifiedSalesAccount);

  pricingPolicy.foundationAccount = foundationAccount
  pricingPolicy.certifiedSalesAccount = certifiedSalesAccount

  const suPolicy = new Policy()
  suPolicy.value = pricingPolicyEventParsed.su.value
  suPolicy.unit = pricingPolicyEventParsed.su.unit.toString()

  const nuPolicy = new Policy()
  nuPolicy.value = pricingPolicyEventParsed.nu.value
  nuPolicy.unit = pricingPolicyEventParsed.nu.unit.toString()

  const cuPolicy = new Policy()
  cuPolicy.value = pricingPolicyEventParsed.cu.value
  cuPolicy.unit = pricingPolicyEventParsed.cu.unit.toString()

  const IpuPolicy = new Policy()
  IpuPolicy.value = pricingPolicyEventParsed.ipu.value
  IpuPolicy.unit = pricingPolicyEventParsed.ipu.unit.toString()

  pricingPolicy.su = suPolicy
  pricingPolicy.cu = cuPolicy
  pricingPolicy.nu = nuPolicy
  pricingPolicy.ipu = IpuPolicy

  if (pricingPolicyEvent.isV51) {
    let policyAsV50 = pricingPolicyEvent.asV51
    pricingPolicy.dedicatedNodeDiscount = policyAsV50.discountForDedicatedNodes
  }

  await ctx.store.save<PricingPolicy>(pricingPolicy)
}

export async function farmingPolicyStored(ctx: EventHandlerContext) {
  const farmingPolicyEvent = new TfgridModuleFarmingPolicyStoredEvent(ctx)

  if (!farmingPolicyEvent.isV63) {
    return
  }

  const farmingPolicyStoredEvent = farmingPolicyEvent.asV63

  const newFarmingPolicy = new FarmingPolicy()
  newFarmingPolicy.id = ctx.event.id
  newFarmingPolicy.gridVersion = farmingPolicyStoredEvent.version
  newFarmingPolicy.farmingPolicyID = farmingPolicyStoredEvent.id
  newFarmingPolicy.name = farmingPolicyStoredEvent.name.toString()

  newFarmingPolicy.cu = farmingPolicyStoredEvent.cu
  newFarmingPolicy.su = farmingPolicyStoredEvent.su
  newFarmingPolicy.nu = farmingPolicyStoredEvent.nu
  newFarmingPolicy.ipv4 = farmingPolicyStoredEvent.ipv4
  newFarmingPolicy.policyCreated = farmingPolicyStoredEvent.policyCreated
  newFarmingPolicy.policyEnd = farmingPolicyStoredEvent.policyEnd
  newFarmingPolicy.immutable = farmingPolicyStoredEvent.immutable
  newFarmingPolicy.default = farmingPolicyStoredEvent.default

  const certificationTypeAsString = farmingPolicyStoredEvent.nodeCertification.__kind.toString()
  let nodeCertType = NodeCertification.Diy
  switch (certificationTypeAsString) {
    case 'Diy': 
      nodeCertType = NodeCertification.Diy
      break
    case 'Certified': 
      nodeCertType = NodeCertification.Certified
      break
  }
  newFarmingPolicy.nodeCertification = nodeCertType

  const farmCertificationTypeAsString = farmingPolicyStoredEvent.farmCertification.__kind.toString()
  let farmCertType = FarmCertification.NotCertified
  switch (farmCertificationTypeAsString) {
    case 'NotCertified': 
      farmCertType = FarmCertification.NotCertified
      break
    case 'Gold': 
      farmCertType = FarmCertification.Gold
      break
  }
  newFarmingPolicy.farmCertification = farmCertType

  await ctx.store.save<FarmingPolicy>(newFarmingPolicy)
}

export async function farmingPolicyUpdated(ctx: EventHandlerContext) {
  const farmingPolicyEvent = new TfgridModuleFarmingPolicyUpdatedEvent(ctx)

  if (!farmingPolicyEvent.isV63) {
    return
  }

  const farmingPolicyUpdatedEvent = farmingPolicyEvent.asV63

  const savedPolicy = await ctx.store.get(FarmingPolicy, { where: { farmingPolicyID: farmingPolicyUpdatedEvent.id } })
  if (!savedPolicy) return

  savedPolicy.gridVersion = farmingPolicyUpdatedEvent.version
  savedPolicy.farmingPolicyID = farmingPolicyUpdatedEvent.id
  savedPolicy.name = farmingPolicyUpdatedEvent.name.toString()

  savedPolicy.cu = farmingPolicyUpdatedEvent.cu
  savedPolicy.su = farmingPolicyUpdatedEvent.su
  savedPolicy.nu = farmingPolicyUpdatedEvent.nu
  savedPolicy.ipv4 = farmingPolicyUpdatedEvent.ipv4
  savedPolicy.policyCreated = farmingPolicyUpdatedEvent.policyCreated
  savedPolicy.policyEnd = farmingPolicyUpdatedEvent.policyEnd
  savedPolicy.immutable = farmingPolicyUpdatedEvent.immutable
  savedPolicy.default = farmingPolicyUpdatedEvent.default

  const certificationTypeAsString = farmingPolicyUpdatedEvent.nodeCertification.__kind.toString()
  let nodeCertType = NodeCertification.Diy
  switch (certificationTypeAsString) {
    case 'Diy': 
      nodeCertType = NodeCertification.Diy
      break
    case 'Certified': 
      nodeCertType = NodeCertification.Certified
      break
  }
  savedPolicy.nodeCertification = nodeCertType

  const farmCertificationTypeAsString = farmingPolicyUpdatedEvent.farmCertification.__kind.toString()
  let farmCertType = FarmCertification.NotCertified
  switch (farmCertificationTypeAsString) {
    case 'NotCertified': 
      farmCertType = FarmCertification.NotCertified
      break
    case 'Gold': 
      farmCertType = FarmCertification.Gold
      break
  }
  savedPolicy.farmCertification = farmCertType

  await ctx.store.save<FarmingPolicy>(savedPolicy)
}