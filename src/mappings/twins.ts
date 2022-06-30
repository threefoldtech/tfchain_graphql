import * as ss58 from "@subsquid/ss58";
import {
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { Twin, EntityProof } from "../model";
import { TfgridModuleTwinStoredEvent, TfgridModuleTwinDeletedEvent, TfgridModuleTwinEntityStoredEvent, TfgridModuleTwinEntityRemovedEvent, TfgridModuleTwinUpdatedEvent } from "../types/events";

export async function twinStored(ctx: EventHandlerContext) {
  const twinEvent = new TfgridModuleTwinStoredEvent(ctx)
  
  let twin
  if (twinEvent.isV9) {
    twin = twinEvent.asV9
  } else if (twinEvent.isV101) {
    twin = twinEvent.asV101
  } else {
    return
  }

  // const twin = new TfgridModuleTwinStoredEvent(ctx).asV9
  const newTwin = new Twin()

  newTwin.id = ctx.event.id

  newTwin.gridVersion = twin.version
  newTwin.twinID = twin.id

  const accountID = ss58.codec("substrate").encode(twin.accountId);
  newTwin.accountID = accountID
  newTwin.ip = twin.ip.toString()

  await ctx.store.save<Twin>(newTwin)
}

export async function twinUpdated(ctx: EventHandlerContext) {
  const twinEvent = new TfgridModuleTwinUpdatedEvent(ctx)

  let twin
  if (twinEvent.isV9) {
    twin = twinEvent.asV9
  } else if (twinEvent.isV101) {
    twin = twinEvent.asV101
  } else {
    return
  }

  const savedTwin = await ctx.store.get(Twin, { where: { twinID: twin.id } })
  if (!savedTwin) return

  savedTwin.gridVersion = twin.version
  savedTwin.ip = twin.ip.toString()

  await ctx.store.save<Twin>(savedTwin)
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
    entityProof.id = ctx.event.id
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
