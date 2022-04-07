import {
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { Farm, CertificationType, PublicIp } from "../model";
import { TfgridModuleFarmStoredEvent, TfgridModuleFarmDeletedEvent, TfgridModuleFarmUpdatedEvent, TfgridModuleFarmPayoutV2AddressRegisteredEvent } from "../types/events";

export async function farmStored(ctx: EventHandlerContext) {
  const farmStoredEvent  = new TfgridModuleFarmStoredEvent(ctx).asV9

  const newFarm = new Farm()
  
  newFarm.id = ctx.event.id
  newFarm.gridVersion = farmStoredEvent.version
  newFarm.farmID = farmStoredEvent.id
  newFarm.name = farmStoredEvent.name.toString()
  newFarm.twinID = farmStoredEvent.twinId
  newFarm.pricingPolicyID = farmStoredEvent.pricingPolicyId

  const certificationTypeAsString = farmStoredEvent.certificationType.toString()
  let certType = CertificationType.Diy
  switch (certificationTypeAsString) {
    case 'Diy': 
      certType = CertificationType.Diy
      break
    case 'Certified': 
      certType = CertificationType.Certified
      break
  }

  newFarm.certificationType = certType
  newFarm.publicIPs = []

  await ctx.store.save<Farm>(newFarm)

  const ipPromises = farmStoredEvent.publicIps.map(ip => {
    const newIP = new PublicIp()

    newIP.id = ctx.event.id
    newIP.ip = ip.ip.toString()
    newIP.gateway = ip.gateway.toString()
    newIP.contractId = ip.contractId
    newIP.farm = newFarm

    newFarm.publicIPs?.push(newIP)

    return ctx.store.save<PublicIp>(newIP)
  })
  await Promise.all(ipPromises)
  await ctx.store.save<Farm>(newFarm)
}

export async function farmUpdated(ctx: EventHandlerContext) {
  const farmUpdatedEvent  = new TfgridModuleFarmUpdatedEvent(ctx).asV9
  
  const savedFarm = await ctx.store.get(Farm, { where: { farmID: farmUpdatedEvent.id } })
  if (!savedFarm) return

  savedFarm.gridVersion = farmUpdatedEvent.version
  savedFarm.name = farmUpdatedEvent.name.toString()
  savedFarm.twinID = farmUpdatedEvent.twinId
  savedFarm.pricingPolicyID = farmUpdatedEvent.pricingPolicyId

  await farmUpdatedEvent.publicIps.forEach(async ip => {
    const savedIP = await ctx.store.get(PublicIp, { where: { ip: ip.ip.toString() }})
    // ip is already there in storage, don't save it again
    if (savedIP) return
    
    const newIP = new PublicIp()
    newIP.id = ctx.event.id
    newIP.ip = ip.ip.toString()
    newIP.gateway = ip.gateway.toString()
    newIP.contractId = ip.contractId
    newIP.farm = savedFarm
  
    await ctx.store.save<PublicIp>(newIP)
    if (!savedFarm.publicIPs) {
      savedFarm.publicIPs = []
    }
    savedFarm.publicIPs.push(newIP)
  })

  await ctx.store.save<Farm>(savedFarm)
  console.log(`saved farm, public ips: ${savedFarm.publicIPs}`)
}

export async function farmDeleted(ctx: EventHandlerContext) {
  const farmID = new TfgridModuleFarmDeletedEvent(ctx).asV9

  const savedFarm = await ctx.store.get(Farm, { where: { farmID: farmID } })

  if (savedFarm) {
    ctx.store.remove(savedFarm)
  }
}

export async function farmPayoutV2AddressRegistered(ctx: EventHandlerContext) {
  const [farmID, stellarAddress] = new TfgridModuleFarmPayoutV2AddressRegisteredEvent(ctx).asV9

  const savedFarm = await ctx.store.get(Farm, { where: { farmID: farmID } })

  if (savedFarm) {
    let address = ''
    if (!stellarAddress.includes(0)) {
      address = stellarAddress.toString()
    }
 
    savedFarm.stellarAddress = address
    await ctx.store.save<Farm>(savedFarm)
  }
}