import { EventHandlerContext } from '@subsquid/substrate-processor'
import { Farm, FarmCertification, PublicIp } from "../../model";
import { TfgridModulePublicIpAddedEvent, TfgridModulePublicIpRemovedEvent } from '../../types/events';
import * as v120 from '../../types/v120'

export async function createFarmv120(ctx: EventHandlerContext, farm: v120.Farm) {
const newFarm = new Farm()

  newFarm.id = ctx.event.id
  newFarm.gridVersion = farm.version
  newFarm.farmID = farm.id
  newFarm.name = farm.name.toString()
  newFarm.twinID = farm.twinId
  newFarm.pricingPolicyID = farm.pricingPolicyId
  newFarm.dedicatedFarm = false
  newFarm.certification = FarmCertification.NotCertified

  newFarm.publicIPs = []

  await ctx.store.save<Farm>(newFarm)
}

export async function updateFarmv120(ctx: EventHandlerContext, farm: v120.Farm) {
  let savedFarm = await ctx.store.get(Farm, { where: { farmID: farm.id } })
  if (!savedFarm) return

  savedFarm.gridVersion = farm.version
  savedFarm.farmID = farm.id
  savedFarm.name = farm.name.toString()
  savedFarm.twinID = farm.twinId
  savedFarm.pricingPolicyID = farm.pricingPolicyId
  savedFarm.dedicatedFarm = false
  savedFarm.certification = FarmCertification.NotCertified

  await ctx.store.save<Farm>(savedFarm)
}

export async function farmPublicIpAdded(ctx: EventHandlerContext) {
  const { farmId, publicIp } = new TfgridModulePublicIpAddedEvent(ctx).asV120

  let savedFarm = await ctx.store.get(Farm, { where: { farmID: farmId } })
  if (!savedFarm) return

  const newIP = new PublicIp()

  newIP.id = ctx.event.id

  if (publicIp.ip.toString().indexOf('\x00') >= 0) {
    return
  }
  newIP.ip = publicIp.ip.toString()

  if (publicIp.gw.toString().indexOf('\x00') >= 0) {
    return
  }
  newIP.gateway = publicIp.gw.toString()

  newIP.contractId = BigInt(0)
  newIP.farm = savedFarm

  savedFarm.publicIPs?.push(newIP)

  await ctx.store.save<PublicIp>(newIP)
  await ctx.store.save<Farm>(savedFarm)
}

export async function farmPublicIpRemoved(ctx: EventHandlerContext) {
  const { farmId, publicIp } = new TfgridModulePublicIpRemovedEvent(ctx).asV120

  let savedFarm = await ctx.store.get(Farm, { where: { farmID: farmId } })
  if (!savedFarm) return

  const publicIPsOfFarm = await ctx.store.find<PublicIp>(PublicIp, { where: { farm: savedFarm } })
  publicIPsOfFarm.forEach(async ip => {
    if (ip.ip === publicIp.ip.toString()) {
      await ctx.store.remove<PublicIp>(ip)
    }
  })
}