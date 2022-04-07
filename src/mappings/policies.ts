import {
    EventHandlerContext,
  } from "@subsquid/substrate-processor";
import { PricingPolicy, FarmingPolicy, Policy, CertificationType } from "../model";
import { TfgridModulePricingPolicyStoredEvent, TfgridModuleFarmingPolicyStoredEvent } from "../types/events";
import * as ss58 from "@subsquid/ss58";

export async function pricingPolicyStored(ctx: EventHandlerContext) {
  let pricingPolicyEvent = new TfgridModulePricingPolicyStoredEvent(ctx)

  let pricingPolicyEventParsed

  if (pricingPolicyEvent.isV9) {
    pricingPolicyEventParsed = pricingPolicyEvent.asV9
  } else if (pricingPolicyEvent.isV51) {
    pricingPolicyEventParsed = pricingPolicyEvent.asV51
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
  const farmingPolicyEvent = new TfgridModuleFarmingPolicyStoredEvent(ctx).asV9

  const newFarmingPolicy = new FarmingPolicy()
  newFarmingPolicy.id = ctx.event.id
  newFarmingPolicy.gridVersion = farmingPolicyEvent.version
  newFarmingPolicy.farmingPolicyID = farmingPolicyEvent.id
  newFarmingPolicy.name = farmingPolicyEvent.name.toString()

  newFarmingPolicy.cu = farmingPolicyEvent.cu
  newFarmingPolicy.su = farmingPolicyEvent.su
  newFarmingPolicy.nu = farmingPolicyEvent.nu
  newFarmingPolicy.ipv4 = farmingPolicyEvent.ipv4
  newFarmingPolicy.timestamp = farmingPolicyEvent.timestamp

  const certificationTypeAsString = farmingPolicyEvent.certificationType.toString()
  let certType = CertificationType.Diy
  switch (certificationTypeAsString) {
    case 'Diy': 
      certType = CertificationType.Diy
      break
    case 'Certified': 
      certType = CertificationType.Certified
      break
  }

  newFarmingPolicy.certificationType = certType

  await ctx.store.save<FarmingPolicy>(newFarmingPolicy)
}