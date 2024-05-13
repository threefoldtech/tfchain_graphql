import { Farm, FarmCertification, PublicIp } from "../model"
import { TfgridModuleFarmStoredEvent, TfgridModuleFarmDeletedEvent, TfgridModuleFarmUpdatedEvent, TfgridModuleFarmPayoutV2AddressRegisteredEvent, TfgridModuleFarmCertificationSetEvent } from "../types/events"
import { EventItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'

import { Ctx } from '../processor'
import * as v63 from '../types/v63'
import { validateString } from "./nodes"

export class FarmWithIPs {
  constructor(farmID: number, ips: PublicIp[]) {
    this.farmID = farmID
    this.publicIPs = ips
  }

  farmID: number;
  publicIPs: PublicIp[];
}

export async function farmStored(
  ctx: Ctx,
  item: EventItem<'TfgridModule.FarmStored', { event: { args: true } }>
) {
  const farmStoredEvent = new TfgridModuleFarmStoredEvent(ctx, item.event)

  let farmStoredEventParsed
  if (farmStoredEvent.isV9) {
    farmStoredEventParsed = farmStoredEvent.asV9
  } else if (farmStoredEvent.isV50) {
    farmStoredEventParsed = farmStoredEvent.asV50
  } else if (farmStoredEvent.isV63) {
    farmStoredEventParsed = farmStoredEvent.asV63
  } else if (farmStoredEvent.isV101) {
    farmStoredEventParsed = farmStoredEvent.asV101
  }

  if (!farmStoredEventParsed) {
    ctx.log.error({eventName: item.name}, `found farm with unknown version! make sure types are updated`);
    return
  }

  const newFarm = new Farm()

  newFarm.id = item.event.id
  newFarm.gridVersion = farmStoredEventParsed.version
  newFarm.farmID = farmStoredEventParsed.id
  newFarm.name = validateString(ctx, farmStoredEventParsed.name.toString())
  newFarm.twinID = farmStoredEventParsed.twinId
  newFarm.pricingPolicyID = farmStoredEventParsed.pricingPolicyId
  newFarm.dedicatedFarm = false
  newFarm.certification = FarmCertification.NotCertified

  newFarm.publicIPs = []

  await ctx.store.save<Farm>(newFarm)

  const ipPromises = farmStoredEventParsed.publicIps.map(ip => {
    const newIP = new PublicIp()

    newIP.id = item.event.id

    newIP.ip = validateString(ctx, ip.ip.toString())
    newIP.gateway = validateString(ctx, ip.gateway.toString())

    newIP.contractId = ip.contractId
    newIP.farm = newFarm

    newFarm.publicIPs?.push(newIP)

    return ctx.store.save<PublicIp>(newIP)
  })
  await Promise.all(ipPromises)
  await ctx.store.save<Farm>(newFarm)
}

export async function farmUpdated(
  ctx: Ctx,
  item: EventItem<'TfgridModule.FarmUpdated', { event: { args: true } }>
) {
  const farmUpdatedEvent = new TfgridModuleFarmUpdatedEvent(ctx, item.event)

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
    farmUpdatedEventParsed = farmUpdatedEvent.asV101
    switch (farmUpdatedEvent.asV101.certification.__kind) {
      case "Gold": {
        certification = FarmCertification.Gold
      }
    }
  }

  if (!farmUpdatedEventParsed) {
    ctx.log.error({eventName: item.name}, `found farm with unknown version! make sure types are updated`);
    return
  }

  const savedFarm = await ctx.store.get(Farm, { where: { farmID: farmUpdatedEventParsed.id } })
  if (!savedFarm) return

  savedFarm.gridVersion = farmUpdatedEventParsed.version
  savedFarm.name = validateString(ctx, farmUpdatedEventParsed.name.toString())
  savedFarm.twinID = farmUpdatedEventParsed.twinId
  // reason for commented the below line is that update_farm on-chain isnever meant to change the pricing policy attached to a farm
  // see here https://github.com/threefoldtech/tfchain_graphql/issues/96#issuecomment-2068325597
  // savedFarm.pricingPolicyID = farmUpdatedEventParsed.pricingPolicyId
  savedFarm.certification = certification

  let eventPublicIPs = farmUpdatedEventParsed.publicIps

  await farmUpdatedEventParsed.publicIps.forEach(async ip => {
    if (ip.ip.toString().indexOf('\x00') >= 0) {
      return
    }
    const savedIP = await ctx.store.get(PublicIp, { where: { ip: ip.ip.toString() }, relations: { farm: true } })
    // ip is already there in storage, don't save it again
    if (savedIP) {
      savedIP.ip = validateString(ctx, ip.ip.toString()) // not effective, but for since we already check for \x00
      savedIP.gateway = validateString(ctx, ip.gateway.toString())
      await ctx.store.save<PublicIp>(savedIP)
    } else {
      const newIP = new PublicIp()
      newIP.id = item.event.id
      newIP.ip = validateString(ctx, ip.ip.toString())
      newIP.gateway = validateString(ctx, ip.gateway.toString())
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

  const publicIPsOfFarm = await ctx.store.find<PublicIp>(PublicIp, { where: { farm: { id: savedFarm.id } }, relations: { farm: true } })
  publicIPsOfFarm.forEach(async ip => {
    if (eventPublicIPs.filter(eventIp => validateString(ctx, eventIp.ip.toString()) === ip.ip).length === 0) {
      // IP got removed from farm
      await ctx.store.remove<PublicIp>(ip)
    }
  })

  let farm = item.event.args as Farm
  if (farm.dedicatedFarm) {
    savedFarm.dedicatedFarm = farm.dedicatedFarm
    await ctx.store.save<Farm>(savedFarm)
  }
}

export async function farmDeleted(
  ctx: Ctx,
  item: EventItem<'TfgridModule.FarmDeleted', { event: { args: true } }>
) {
  const farmID = new TfgridModuleFarmDeletedEvent(ctx, item.event).asV49

  const savedFarm = await ctx.store.get(Farm, { where: { farmID: farmID } })

  if (savedFarm) {
    await ctx.store.remove(savedFarm)
  }
}

export async function farmPayoutV2AddressRegistered(
  ctx: Ctx,
  item: EventItem<'TfgridModule.FarmPayoutV2AddressRegistered', { event: { args: true } }>
) {
  const [farmID, stellarAddress] = new TfgridModuleFarmPayoutV2AddressRegisteredEvent(ctx, item.event).asV49

  const savedFarm = await ctx.store.get(Farm, { where: { farmID: farmID } })

  if (savedFarm) {
    let address = ''
    if (!stellarAddress.includes(0)) {
      address = validateString(ctx, stellarAddress.toString())
    }

    savedFarm.stellarAddress = address
    await ctx.store.save<Farm>(savedFarm)
  }
}

export async function farmCertificationSet(
  ctx: Ctx,
  item: EventItem<'TfgridModule.FarmCertificationSet', { event: { args: true } }>
) {
  const [farmID, certification] = new TfgridModuleFarmCertificationSetEvent(ctx, item.event).asV63

  const savedFarm = await ctx.store.get(Farm, { where: { farmID: farmID } })

  if (!savedFarm) {
    ctx.log.error({eventName: item.name}, `found FarmCertification with unknown version! make sure types are updated`);
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
