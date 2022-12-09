import { EventHandlerContext } from '@subsquid/substrate-processor'
import { Farm, FarmCertification, PublicIp } from "../../model";
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