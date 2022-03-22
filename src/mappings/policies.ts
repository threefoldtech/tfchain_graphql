import {
    EventHandlerContext,
  } from "@subsquid/substrate-processor";
  import { PricingPolicy, FarmingPolicy, Policy, CertificationType } from "../model";
  import { TfgridModulePricingPolicyStoredEvent, TfgridModuleFarmingPolicyStoredEvent } from "../types/events";
  
export async function pricingPolicyStored(ctx: EventHandlerContext) {
  let pricingPolicyEvent = new TfgridModulePricingPolicyStoredEvent(ctx).asV9
  
  let pricingPolicy = new PricingPolicy()
  pricingPolicy.id = ctx.event.id

  const savedPolicy = await ctx.store.get(PricingPolicy, { where: { pricingPolicyID: pricingPolicyEvent.id }})
  if (savedPolicy) {
    pricingPolicy = savedPolicy
  }

  pricingPolicy.gridVersion = pricingPolicyEvent.version
  pricingPolicy.pricingPolicyID = pricingPolicyEvent.id
  pricingPolicy.name = pricingPolicyEvent.name.toString()

  pricingPolicy.foundationAccount = pricingPolicyEvent.foundationAccount.toString()
  pricingPolicy.certifiedSalesAccount = pricingPolicyEvent.certifiedSalesAccount.toString()

  const suPolicy = new Policy()
  suPolicy.value = pricingPolicyEvent.su.value
  suPolicy.unit = pricingPolicyEvent.su.unit.toString()

  const nuPolicy = new Policy()
  nuPolicy.value = pricingPolicyEvent.nu.value
  nuPolicy.unit = pricingPolicyEvent.nu.unit.toString()

  const cuPolicy = new Policy()
  cuPolicy.value = pricingPolicyEvent.cu.value
  cuPolicy.unit = pricingPolicyEvent.cu.unit.toString()

  const IpuPolicy = new Policy()
  IpuPolicy.value = pricingPolicyEvent.ipu.value
  IpuPolicy.unit = pricingPolicyEvent.ipu.unit.toString()

  pricingPolicy.su = suPolicy
  pricingPolicy.cu = cuPolicy
  pricingPolicy.nu = nuPolicy
  pricingPolicy.ipu = IpuPolicy

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