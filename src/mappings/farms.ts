import {
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { Farm, CertificationType, PublicIp } from "../model";
import { TfgridModuleFarmStoredEvent, TfgridModuleFarmDeletedEvent, TfgridModuleFarmUpdatedEvent, TfgridModuleFarmPayoutV2AddressRegisteredEvent } from "../types/events";

export async function farmStored(ctx: EventHandlerContext) {
  const farmStoredEvent  = new TfgridModuleFarmStoredEvent(ctx)

  let farmStoredEventParsed
  if (farmStoredEvent.isV9) {
    farmStoredEventParsed = farmStoredEvent.asV9
  } else if (farmStoredEvent.isV50) {
    farmStoredEventParsed = farmStoredEvent.asV50
  }

  if (!farmStoredEventParsed) return

  const newFarm = new Farm()
  
  newFarm.id = ctx.event.id
  newFarm.gridVersion = farmStoredEventParsed.version
  newFarm.farmID = farmStoredEventParsed.id
  newFarm.name = farmStoredEventParsed.name.toString()
  newFarm.twinID = farmStoredEventParsed.twinId
  newFarm.pricingPolicyID = farmStoredEventParsed.pricingPolicyId
  newFarm.dedicatedFarm = false

  const certificationTypeAsString = farmStoredEventParsed.certificationType.toString()
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

  const ipPromises = farmStoredEventParsed.publicIps.map(ip => {
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

  if (farmStoredEvent.isV50) {
    const event = farmStoredEvent.asV50
    newFarm.dedicatedFarm = event.dedicatedFarm
    await ctx.store.save<Farm>(newFarm)
  }
}

export async function farmUpdated(ctx: EventHandlerContext) {
  const farmUpdatedEvent  = new TfgridModuleFarmUpdatedEvent(ctx)

  let farmUpdatedEventParsed
  if (farmUpdatedEvent.isV9) {
    farmUpdatedEventParsed = farmUpdatedEvent.asV9
  } else if (farmUpdatedEvent.isV50) {
    farmUpdatedEventParsed = farmUpdatedEvent.asV50
  }
  
  if (!farmUpdatedEventParsed) return

  const savedFarm = await ctx.store.get(Farm, { where: { farmID: farmUpdatedEventParsed.id } })
  if (!savedFarm) return

  savedFarm.gridVersion = farmUpdatedEventParsed.version
  savedFarm.name = farmUpdatedEventParsed.name.toString()
  savedFarm.twinID = farmUpdatedEventParsed.twinId
  savedFarm.pricingPolicyID = farmUpdatedEventParsed.pricingPolicyId

  await farmUpdatedEventParsed.publicIps.forEach(async ip => {
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
  
  let farm = ctx.event.params[0].value as Farm
  if (farm.dedicatedFarm) {
    savedFarm.dedicatedFarm = farm.dedicatedFarm
    await ctx.store.save<Farm>(savedFarm)
  }  
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