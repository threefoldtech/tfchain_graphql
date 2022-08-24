import { Farm, FarmCertification, PublicIp } from "../model"
import { TfgridModuleFarmStoredEvent, TfgridModuleFarmDeletedEvent, TfgridModuleFarmUpdatedEvent, TfgridModuleFarmPayoutV2AddressRegisteredEvent, TfgridModuleFarmCertificationSetEvent } from "../types/events"
import { Store } from '@subsquid/typeorm-store'
import {
  EventHandlerContext,
} from "../types/context"

import { Ctx } from '../processor'
import * as v63 from '../types/v63'

export class FarmWithIPs {
  constructor(farm: Farm, ips?: PublicIp[]) {
    this.farm = farm
    this.publicIPs = ips
  }

  farm: Farm;
  publicIPs?: PublicIp[];
}

export async function farmCreateOrUpdateOrDelete(ctx: Ctx): Promise<[FarmWithIPs[], FarmWithIPs[], FarmWithIPs[]]> {
  let newFarms: FarmWithIPs[] = []
  let updatedFarms: FarmWithIPs[] = []
  let deletedFarms: FarmWithIPs = []
  for (let block of ctx.blocks) {
    for (let item of block.items) { 
      if (item.name === "TfgridModule.FarmStored") {
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

        if (!farmStoredEventParsed) continue

        const newFarm = new Farm()

        let eventID = item.event.id

        newFarm.id = eventID
        newFarm.gridVersion = farmStoredEventParsed.version
        newFarm.farmID = farmStoredEventParsed.id
        newFarm.name = farmStoredEventParsed.name.toString()
        newFarm.twinID = farmStoredEventParsed.twinId
        newFarm.pricingPolicyID = farmStoredEventParsed.pricingPolicyId
        newFarm.dedicatedFarm = false

        if (farmStoredEvent.isV63 || farmStoredEvent.isV101) {
          newFarm.certification = FarmCertification.NotCertified
        }

        newFarm.publicIPs = []

        let ips: PublicIp[] = []
        farmStoredEventParsed.publicIps.forEach(ip => {
          ctx.log.info("storing ips")
          const newIP = new PublicIp()

          newIP.id = eventID

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

          ips.push(newIP)
        })

        ctx.log.info(`storing farm: ${newFarm.id}`)

        newFarms.push(new FarmWithIPs(newFarm, ips))
      }
      if (item.name === "TfgridModule.FarmUpdated") {
        const farmUpdatedEvent = new TfgridModuleFarmUpdatedEvent(ctx, item.event)

        let farmUpdatedEventParsed: any
        if (farmUpdatedEvent.isV9) {
          farmUpdatedEventParsed = farmUpdatedEvent.asV9
        } else if (farmUpdatedEvent.isV50) {
          farmUpdatedEventParsed = farmUpdatedEvent.asV50
        } else if (farmUpdatedEvent.isV63) {
          farmUpdatedEventParsed = farmUpdatedEvent.asV63
        } else if (farmUpdatedEvent.isV101) {
          farmUpdatedEventParsed = farmUpdatedEvent.asV101
        }

        if (!farmUpdatedEventParsed) {
          ctx.log.error('cannot parse farm updated event')
          continue
        }

        const eventID = item.event.id

        const foundInNewListIndex: number = newFarms.findIndex(t => t.farm.farmID == farmUpdatedEventParsed.id)
        if (foundInNewListIndex != -1) {
          const savedFarm: Farm = newFarms[foundInNewListIndex]
          savedFarm.gridVersion = farmUpdatedEventParsed.version
          savedFarm.name = farmUpdatedEventParsed.name.toString()
          savedFarm.twinID = farmUpdatedEventParsed.twinId
          savedFarm.pricingPolicyID = farmUpdatedEventParsed.pricingPolicyId
          newFarms[foundInNewListIndex] = savedFarm
          await updatePublicIPs(ctx, farmUpdatedEventParsed.publicIps, eventID, savedFarm)
          continue
        }
        
        const foundInUpdatedListIndex: number = updatedFarms.findIndex(t => t.farm.farmID == farmUpdatedEventParsed.id)
        if (foundInUpdatedListIndex != -1) {
          let savedFarm: Farm = updatedFarms[foundInUpdatedListIndex]
          savedFarm.gridVersion = farmUpdatedEventParsed.version
          savedFarm.name = farmUpdatedEventParsed.name.toString()
          savedFarm.twinID = farmUpdatedEventParsed.twinId
          savedFarm.pricingPolicyID = farmUpdatedEventParsed.pricingPolicyId
          updatedFarms[foundInUpdatedListIndex] = savedFarm
          await updatePublicIPs(ctx, farmUpdatedEventParsed.publicIps, eventID, savedFarm)
          continue
        } 

        const savedFarm = await ctx.store.get(Farm, { where: { farmID: farmUpdatedEventParsed.id } })
        if (!savedFarm) continue

        savedFarm.gridVersion = farmUpdatedEventParsed.version
        savedFarm.name = farmUpdatedEventParsed.name.toString()
        savedFarm.twinID = farmUpdatedEventParsed.twinId
        savedFarm.pricingPolicyID = farmUpdatedEventParsed.pricingPolicyId
        await updatePublicIPs(ctx, farmUpdatedEventParsed.publicIps, eventID, savedFarm)

        ctx.log.info(`updating farm: ${savedFarm.id}`)

        updatedFarms.push(savedFarm)
      }
      if (item.name === "TfgridModule.FarmDeleted") { 
        const farmID = new TfgridModuleFarmDeletedEvent(ctx, item.event).asV49
        const savedFarm = await ctx.store.get(Farm, { where: { farmID: farmID } })
        if (savedFarm) {
          deletedFarms.push(savedFarm)
        }
      }
    }
  }

  return [newFarms, updatedFarms, deletedFarms]
}

async function updatePublicIPs(ctx: Ctx, ips: PublicIp[], eventID: any, farm: Farm) {
  const ipPromises = ips.map(async (ip: PublicIp) => {
    if (ip.ip.toString().indexOf('\x00') >= 0) {
      return
    }

    const savedIP = await ctx.store.get(PublicIp, {
      where: {
        ip: ip.ip.toString(),
        gateway: ip.gateway.toString(),
        contractId: ip.contractId
      }, relations: { farm: true }
    })

    // ip is already there in storage, don't save it again
    if (!savedIP) {
      const newIP = new PublicIp()
      newIP.id = eventID
      newIP.ip = ip.ip.toString()
      newIP.gateway = ip.gateway.toString()
      newIP.contractId = ip.contractId
      newIP.farm = farm

      ctx.log.info(`saving new ip: ${newIP.ip}`)

      return ctx.store.save<PublicIp>(newIP)
    }
  })
  await Promise.all(ipPromises)
}

export async function farmDeleted(ctx: EventHandlerContext) {
  const farmID = new TfgridModuleFarmDeletedEvent(ctx).asV49

  const savedFarm = await ctx.store.get(Farm, { where: { farmID: farmID } })

  if (savedFarm) {
    ctx.store.remove(savedFarm)
  }
}

export async function farmPayoutV2AddressRegistered(ctx: EventHandlerContext) {
  const [farmID, stellarAddress] = new TfgridModuleFarmPayoutV2AddressRegisteredEvent(ctx).asV49

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