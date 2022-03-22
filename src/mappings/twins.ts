import * as ss58 from "@subsquid/ss58";
import {
  EventHandlerContext,
  Store,
} from "@subsquid/substrate-processor";
import { Twin, EntityProof } from "../model";
import { TfgridModuleTwinStoredEvent, TfgridModuleTwinDeletedEvent, TfgridModuleTwinEntityStoredEvent, TfgridModuleTwinEntityRemovedEvent } from "../types/events";
import { hex2a } from "./util";

export async function twinStored(ctx: EventHandlerContext) {
  const twin = new TfgridModuleTwinStoredEvent(ctx).asV9
  const newTwin = new Twin()

  newTwin.gridVersion = twin.version
  newTwin.twinID = twin.id

  const accountID = ss58.codec("substrate").encode(twin.accountId);

  newTwin.accountID = accountID
  newTwin.ip = hex2a(Buffer.from(twin.ip.toString()).toString())

  await ctx.store.save<Twin>(newTwin)
}

export async function twinDeleted(ctx: EventHandlerContext) {
  const twinDeletedEvent = new TfgridModuleTwinDeletedEvent(ctx)
  
  const savedTwin = await ctx.store.get(Twin, { where: { twinID: twinDeletedEvent.asV9 } })

  if (savedTwin) {
    await ctx.store.remove(savedTwin)
  }
}

export async function twinEntityStored(ctx: EventHandlerContext) {
  const twinEntityStoredEvents = new TfgridModuleTwinEntityStoredEvent(ctx).asV9

  let savedTwin = await ctx.store.get(Twin, { where: { twinID: twinEntityStoredEvents[0] } })

  if (savedTwin) {
    const entityProof = new EntityProof()
    entityProof.entityID = twinEntityStoredEvents[1]
    entityProof.signature = Buffer.from(twinEntityStoredEvents[2]).toString()
    
    // and the twin foreign key to entityproof
    entityProof.twinRel = savedTwin

    await ctx.store.save<EntityProof>(entityProof)
  }
}

export async function twinEntityRemoved(ctx: EventHandlerContext) {
  const [twinID, entityID] = new TfgridModuleTwinEntityRemovedEvent(ctx).asV9

  let savedTwinEntity = await ctx.store.get(EntityProof, { where: { entityID: entityID }})
  if (savedTwinEntity) {
    await ctx.store.remove(savedTwinEntity)
  }
}
