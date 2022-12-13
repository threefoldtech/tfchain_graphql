import {
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { Farm, FarmCertification, PublicIp } from "../model";
import { TfgridModuleFarmStoredEvent, TfgridModuleFarmDeletedEvent, TfgridModuleFarmUpdatedEvent, TfgridModuleFarmPayoutV2AddressRegisteredEvent, TfgridModuleFarmCertificationSetEvent, TfgridModuleFarmingPolicySetEvent } from "../types/events";
import * as v63 from '../types/v63'
import { createFarmv120, updateFarmv120 } from "./farmMappers/v120";

export async function farmStored(ctx: EventHandlerContext) {
  const farmStoredEvent = new TfgridModuleFarmStoredEvent(ctx)

  let farmStoredEventParsed
  if (farmStoredEvent.isV9) {
    farmStoredEventParsed = farmStoredEvent.asV9
  } else if (farmStoredEvent.isV50) {
    farmStoredEventParsed = farmStoredEvent.asV50
  } else if (farmStoredEvent.isV63) {
    farmStoredEventParsed = farmStoredEvent.asV63
  } else if (farmStoredEvent.isV101) {
    let eventValue = ctx.event.params[0].value as v63.Farm
    eventValue.dedicatedFarm = false
    farmStoredEventParsed = farmStoredEvent.asV101
  } else if (farmStoredEvent.isV120) {
    return createFarmv120(ctx, farmStoredEvent.asV120)
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
  newFarm.certification = FarmCertification.NotCertified

  newFarm.publicIPs = []

  await ctx.store.save<Farm>(newFarm)

  const ipPromises = farmStoredEventParsed.publicIps.map(ip => {
    const newIP = new PublicIp()

    newIP.id = ctx.event.id

    if (ip.ip.toString().indexOf('\x00') >= 0) {
      return
    }
    newIP.ip = ip.ip.toString()

    if (ip.gateway.toString().indexOf('\x00') >= 0) {
      return
    }
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
  const farmUpdatedEvent = new TfgridModuleFarmUpdatedEvent(ctx)

  let certification = FarmCertification.NotCertified

  let farmUpdatedEventParsed
  if (farmUpdatedEvent.isV9) {
    farmUpdatedEventParsed = farmUpdatedEvent.asV9
  } else if (farmUpdatedEvent.isV50) {
    farmUpdatedEventParsed = farmUpdatedEvent.asV50
  } else if (farmUpdatedEvent.isV63) {
    farmUpdatedEventParsed = farmUpdatedEvent.asV63
    switch (farmUpdatedEvent.asV101.certification.__kind) {
      case "Gold": {
        certification = FarmCertification.Gold
      }
    }
  } else if (farmUpdatedEvent.isV101) {
    let eventValue = ctx.event.params[0].value as v63.Farm
    eventValue.dedicatedFarm = false
    farmUpdatedEventParsed = farmUpdatedEvent.asV101
    switch (farmUpdatedEvent.asV101.certification.__kind) {
      case "Gold": {
        certification = FarmCertification.Gold
      }
    }
  } else if (farmUpdatedEvent.isV120) {
    return updateFarmv120(ctx, farmUpdatedEvent.asV120)
  }

  if (!farmUpdatedEventParsed) return

  const savedFarm = await ctx.store.get(Farm, { where: { farmID: farmUpdatedEventParsed.id } })
  if (!savedFarm) return

  savedFarm.gridVersion = farmUpdatedEventParsed.version
  savedFarm.name = farmUpdatedEventParsed.name.toString()
  savedFarm.twinID = farmUpdatedEventParsed.twinId
  savedFarm.pricingPolicyID = farmUpdatedEventParsed.pricingPolicyId
  savedFarm.certification = certification

  let eventPublicIPs = farmUpdatedEventParsed.publicIps

  await farmUpdatedEventParsed.publicIps.forEach(async ip => {
    if (ip.ip.toString().indexOf('\x00') >= 0) {
      return
    }
    const savedIP = await ctx.store.get(PublicIp, { where: { ip: ip.ip.toString() } })
    // ip is already there in storage, don't save it again
    if (savedIP) {
      savedIP.ip = ip.ip.toString()
      savedIP.contractId = ip.contractId
      savedIP.gateway = ip.gateway.toString()
      await ctx.store.save<PublicIp>(savedIP)
    } else {
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
    }
  })

  await ctx.store.save<Farm>(savedFarm)

  const publicIPsOfFarm = await ctx.store.find<PublicIp>(PublicIp, { where: { farm: savedFarm } })
  publicIPsOfFarm.forEach(async ip => {
    if (eventPublicIPs.filter(eventIp => eventIp.ip.toString() === ip.ip).length === 0) {
      // IP got removed from farm
      await ctx.store.remove<PublicIp>(ip)
    }
  })

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

export async function farmCertificationSet(ctx: EventHandlerContext) {
  const [farmID, certification] = new TfgridModuleFarmCertificationSetEvent(ctx).asV63

  const savedFarm = await ctx.store.get(Farm, { where: { farmID: farmID } })

  if (!savedFarm) {
    return
  }

  let certType = FarmCertification.NotCertified
  switch (certification.__kind.toString()) {
    case 'NotCertified':
      certType = FarmCertification.NotCertified
      break
    case 'Gold':
      certType = FarmCertification.Gold
      break
  }

  savedFarm.certification = certType
  await ctx.store.save<Farm>(savedFarm)
}