import { Farm, FarmCertification, PublicIp } from "../model"
import { TfgridModuleFarmStoredEvent, TfgridModuleFarmDeletedEvent, TfgridModuleFarmUpdatedEvent, TfgridModuleFarmPayoutV2AddressRegisteredEvent, TfgridModuleFarmCertificationSetEvent } from "../types/events"
import { EventItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'

import { Ctx } from '../processor'
import * as v63 from '../types/v63'

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
    let eventValue = item.event.args as v63.Farm
    eventValue.dedicatedFarm = false
    farmStoredEventParsed = farmStoredEvent.asV101
  }

  if (!farmStoredEventParsed) return

  const newFarm = new Farm()

  newFarm.id = item.event.id
  newFarm.gridVersion = farmStoredEventParsed.version
  newFarm.farmID = farmStoredEventParsed.id
  newFarm.name = farmStoredEventParsed.name.toString()
  newFarm.twinID = farmStoredEventParsed.twinId
  newFarm.pricingPolicyID = farmStoredEventParsed.pricingPolicyId
  newFarm.dedicatedFarm = false
  newFarm.certification = FarmCertification.NotCertified
  newFarm.totalIps = 0
  newFarm.freeIps = 0

  newFarm.publicIPs = []

  await ctx.store.save<Farm>(newFarm)

  const ipPromises = farmStoredEventParsed.publicIps.map(ip => {
    const newIP = new PublicIp()

    newIP.id = item.event.id

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
    newFarm.totalIps += 1
    return ctx.store.save<PublicIp>(newIP)
  })


  await Promise.all(ipPromises)

  newFarm.freeIps = newFarm.totalIps
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
    let eventValue = item.event.args as v63.Farm
    eventValue.dedicatedFarm = false
    farmUpdatedEventParsed = farmUpdatedEvent.asV101
    switch (farmUpdatedEvent.asV101.certification.__kind) {
      case "Gold": {
        certification = FarmCertification.Gold
      }
    }
  }

  if (!farmUpdatedEventParsed) return

  const savedFarm = await ctx.store.get(Farm, { where: { farmID: farmUpdatedEventParsed.id } })
  if (!savedFarm) return

  savedFarm.gridVersion = farmUpdatedEventParsed.version
  savedFarm.name = farmUpdatedEventParsed.name.toString()
  savedFarm.twinID = farmUpdatedEventParsed.twinId
  savedFarm.pricingPolicyID = farmUpdatedEventParsed.pricingPolicyId
  savedFarm.certification = certification
  savedFarm.totalIps = 0
  savedFarm.freeIps = 0
  let eventPublicIPs = farmUpdatedEventParsed.publicIps

  await Promise.all(farmUpdatedEventParsed.publicIps.map(async ip => {
    if (ip.ip.toString().indexOf('\x00') >= 0) {
      return
    }
    const savedIP = await ctx.store.get(PublicIp, { where: { ip: ip.ip.toString() }, relations: { farm: true } })
    // ip is already there in storage, don't save it again

    savedFarm.totalIps += 1
    if (savedIP) {
      savedIP.ip = ip.ip.toString()
      savedIP.gateway = ip.gateway.toString()
      if (savedIP.contractId === BigInt(0)) {
        savedFarm.freeIps += 1
      }

      await ctx.store.save<PublicIp>(savedIP)
    } else {
      const newIP = new PublicIp()
      newIP.id = item.event.id
      newIP.ip = ip.ip.toString()
      newIP.gateway = ip.gateway.toString()
      newIP.contractId = ip.contractId
      newIP.farm = savedFarm
      await ctx.store.save<PublicIp>(newIP)
      if (!savedFarm.publicIPs) {
        savedFarm.publicIPs = []
      }
      savedFarm.publicIPs.push(newIP)
      savedFarm.freeIps += 1
    }
  }))

  const publicIPsOfFarm = await ctx.store.find<PublicIp>(PublicIp, { where: { farm: { id: savedFarm.id } }, relations: { farm: true } })
  publicIPsOfFarm.forEach(async ip => {
    if (eventPublicIPs.filter(eventIp => eventIp.ip.toString() === ip.ip).length === 0) {
      // IP got removed from farm
      await ctx.store.remove<PublicIp>(ip)
    }
  })

  let farm = item.event.args as Farm
  if (farm.dedicatedFarm) {
    savedFarm.dedicatedFarm = farm.dedicatedFarm
  }

  await ctx.store.save<Farm>(savedFarm)
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
      address = stellarAddress.toString()
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

export async function farmCreateOrUpdateOrDelete(ctx: Ctx): Promise<[Farm[], Farm[], Farm[], FarmWithIPs[]]> {
  let newFarms: Farm[] = []
  let updatedFarms: Farm[] = []
  let deletedFarms: Farm[] = []
  let publicIPs: FarmWithIPs[] = []

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
        newFarm.certification = FarmCertification.NotCertified

        newFarm.publicIPs = []

        let ips: PublicIp[] = []
        farmStoredEventParsed.publicIps.forEach(ip => {
          // ctx.log.info("storing ips")
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

        // ctx.log.info(`storing farm: ${newFarm.id}`)

        newFarms.push(newFarm)
        publicIPs.push(new FarmWithIPs(newFarm.farmID, ips))
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

        const foundInNewListIndex: number = newFarms.findIndex(t => t.farmID == farmUpdatedEventParsed.id)
        if (foundInNewListIndex != -1) {
          const savedFarm: Farm = newFarms[foundInNewListIndex]
          savedFarm.gridVersion = farmUpdatedEventParsed.version
          savedFarm.name = farmUpdatedEventParsed.name.toString()
          savedFarm.twinID = farmUpdatedEventParsed.twinId
          savedFarm.pricingPolicyID = farmUpdatedEventParsed.pricingPolicyId
          // const pubIps = updatePublicIPs(ctx, farmUpdatedEventParsed.publicIps, eventID, savedFarm)
          newFarms[foundInNewListIndex] = savedFarm

          publicIPs = getPublicIPs(ctx, savedFarm, publicIPs, farmUpdatedEventParsed.publicIps, eventID)

          continue
        }

        const foundInUpdatedListIndex: number = updatedFarms.findIndex(t => t.farmID == farmUpdatedEventParsed.id)
        if (foundInUpdatedListIndex != -1) {
          let savedFarm: Farm = updatedFarms[foundInUpdatedListIndex]
          savedFarm.gridVersion = farmUpdatedEventParsed.version
          savedFarm.name = farmUpdatedEventParsed.name.toString()
          savedFarm.twinID = farmUpdatedEventParsed.twinId
          savedFarm.pricingPolicyID = farmUpdatedEventParsed.pricingPolicyId
          updatedFarms[foundInUpdatedListIndex] = savedFarm

          publicIPs = getPublicIPs(ctx, savedFarm, publicIPs, farmUpdatedEventParsed.publicIps, eventID)

          continue
        }

        const savedFarm = await ctx.store.get(Farm, { where: { farmID: farmUpdatedEventParsed.id } })
        if (!savedFarm) continue

        savedFarm.gridVersion = farmUpdatedEventParsed.version
        savedFarm.name = farmUpdatedEventParsed.name.toString()
        savedFarm.twinID = farmUpdatedEventParsed.twinId
        savedFarm.pricingPolicyID = farmUpdatedEventParsed.pricingPolicyId

        // ctx.log.info(`updating farm: ${savedFarm.id}`)

        publicIPs = getPublicIPs(ctx, savedFarm, publicIPs, farmUpdatedEventParsed.publicIps, eventID)

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

  return [newFarms, updatedFarms, deletedFarms, publicIPs]
}

function getPublicIPs(ctx: Ctx, farm: Farm, savedFarmIps: FarmWithIPs[], newIps: PublicIp[], eventID: any): FarmWithIPs[] {
  let toModify = savedFarmIps.filter(f => f.farmID === farm.farmID)
  if (toModify.length === 0) {
    return []
  }

  // For every IP in the updated event:
  // Check if it's already in the savedFarmIps to be saved, if so, update the value
  // If it's not there, add it
  newIps.forEach((ip: PublicIp) => {
    let foundIdx = toModify[0].publicIPs.findIndex(pubip => pubip.ip === ip.ip.toString())
    // console.log(`found index: ${foundIdx}`)
    if (foundIdx !== -1) {
      toModify[0].publicIPs[foundIdx].contractId = ip.contractId
      toModify[0].publicIPs[foundIdx].ip = ip.ip.toString()
      toModify[0].publicIPs[foundIdx].gateway = ip.gateway.toString()
    } else {
      const newIP = new PublicIp()
      newIP.id = eventID
      newIP.ip = ip.ip.toString()
      newIP.gateway = ip.gateway.toString()
      newIP.contractId = ip.contractId
      newIP.farm = farm
      // ctx.log.info(`saving new ip: ${newIP.ip}`)
      // ctx.log.warn(`farm ips: ${toModify[0].publicIPs}`)
      toModify[0].publicIPs.push(newIP)
    }
  })

  return savedFarmIps
}
