import * as ss58 from "@subsquid/ss58";
import { Twin } from "../model";
import { TfgridModuleTwinStoredEvent, TfgridModuleTwinDeletedEvent, TfgridModuleTwinUpdatedEvent } from "../types/events";
import { Ctx } from '../processor'

export async function twinCreateOrUpdateOrDelete(ctx: Ctx): Promise<[Twin[], Twin[], Twin[]]> {
  let newTwins = []
  let updatedTwins = []
  let deletedTwins = []
  for (let block of ctx.blocks) {
    for (let item of block.items) {
      if (item.name === "TfgridModule.TwinStored") {
        const twinEvent = new TfgridModuleTwinStoredEvent(ctx, item.event)
        let twin
        if (twinEvent.isV49) {
          twin = twinEvent.asV49
        } else if (twinEvent.isV101) {
          twin = twinEvent.asV101
        } else {
          continue
        }
      
        const newTwin = new Twin()
      
        newTwin.id = item.event.id
      
        newTwin.gridVersion = twin.version
        newTwin.twinID = twin.id
      
        const accountID = ss58.codec("substrate").encode(twin.accountId);
        newTwin.accountID = accountID
        newTwin.ip = twin.ip.toString()
      
        newTwins.push(newTwin)
      }
      if (item.name === "TfgridModule.TwinUpdated") {
        const twinEvent = new TfgridModuleTwinUpdatedEvent(ctx, item.event)
      
        let twin: any
        if (twinEvent.isV49) {
          twin = twinEvent.asV49
        } else if (twinEvent.isV101) {
          twin = twinEvent.asV101
        } else {
          continue
        }
    
        const foundInNewListIndex: number = newTwins.findIndex(t => t.twinID == twin.id);
        if (foundInNewListIndex != -1) {
          const savedTwin: Twin = newTwins[foundInNewListIndex]
          savedTwin.ip = twin.ip.toString()
          savedTwin.gridVersion = twin.version
          newTwins[foundInNewListIndex] = savedTwin
          continue
        }
        
        const foundInUpdatedListIndex: number = updatedTwins.findIndex(t => t.twinID == twin.id);
        if (foundInUpdatedListIndex != -1) {
          let savedTwin: Twin = updatedTwins[foundInUpdatedListIndex]
          savedTwin.ip = twin.ip.toString()
          savedTwin.gridVersion = twin.version
          updatedTwins[foundInUpdatedListIndex] = savedTwin
          continue
        } 

        const savedTwin: any = await ctx.store.get(Twin, { where: { twinID: twin.id } })
        if (!savedTwin) continue
        savedTwin.ip = twin.ip.toString()
        savedTwin.gridVersion = twin.version
        updatedTwins.push(savedTwin)
      }
      if (item.name === "TfgridModule.TwinDeleted") {
        const twinDeletedEvent = new TfgridModuleTwinDeletedEvent(ctx, item.event).asV49

        const savedTwin = await ctx.store.get(Twin, { where: { twinID: twinDeletedEvent } })
        if (savedTwin) {
          ctx.log.info("deleting twin")
          deletedTwins.push(savedTwin)
        }
      }
     }
  }

  return [newTwins, updatedTwins, deletedTwins]
}

// export async function twinEntityStored(ctx: EventHandlerContext) {
//   const twinEntityStoredEvents = new TfgridModuleTwinEntityStoredEvent(ctx).asV49

//   let savedTwin = await ctx.store.get(Twin, { where: { twinID: twinEntityStoredEvents[0] } })

//   if (savedTwin) {
//     const entityProof = new EntityProof()
//     entityProof.id = ctx.event.id
//     entityProof.entityID = twinEntityStoredEvents[1]
//     entityProof.signature = Buffer.from(twinEntityStoredEvents[2]).toString()
    
//     // and the twin foreign key to entityproof
//     entityProof.twinRel = savedTwin

//     await ctx.store.save<EntityProof>(entityProof)
//   }
// }

// export async function twinEntityRemoved(ctx: EventHandlerContext) {
//   const [twinID, entityID] = new TfgridModuleTwinEntityRemovedEvent(ctx).asV49

//   let savedTwinEntity = await ctx.store.get(EntityProof, { where: { entityID: entityID }})
//   if (savedTwinEntity) {
//     await ctx.store.remove(savedTwinEntity)
//   }
// }
