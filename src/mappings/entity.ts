import {
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { Entity } from "../model";
import { TfgridModuleEntityStoredEvent, TfgridModuleEntityUpdatedEvent, TfgridModuleEntityDeletedEvent } from "../types/events";

export async function entityStored(ctx: EventHandlerContext) {
  const entityStoredEvent = new TfgridModuleEntityStoredEvent(ctx).asV9
  
  const newEntity = new Entity()

  newEntity.id = ctx.event.id
  newEntity.gridVersion = entityStoredEvent.version
  newEntity.entityID = entityStoredEvent.id
  newEntity.name = entityStoredEvent.name.toString()
  newEntity.country = entityStoredEvent.country.toString()
  newEntity.city = entityStoredEvent.city.toString()
  newEntity.accountID = entityStoredEvent.accountId.toString()

  await ctx.store.save<Entity>(newEntity)
}

export async function entityUpdated(ctx: EventHandlerContext) {
  const entityUpdatedEvent = new TfgridModuleEntityUpdatedEvent(ctx).asV9
  const newEntity = new Entity()

  const savedEntity = await ctx.store.get(Entity, { where: { entityID: entityUpdatedEvent.id } })

  if (savedEntity) {
    newEntity.gridVersion = entityUpdatedEvent.version
    newEntity.entityID = entityUpdatedEvent.id
    newEntity.name = entityUpdatedEvent.name.toString()
    newEntity.country = entityUpdatedEvent.country.toString()
    newEntity.city = entityUpdatedEvent.city.toString()
    newEntity.accountID = entityUpdatedEvent.accountId.toString()
  
    await ctx.store.save<Entity>(savedEntity)
  }
}

export async function entityDeleted(ctx: EventHandlerContext) {
  const entityDeletedEvent = new TfgridModuleEntityDeletedEvent(ctx).asV9

  const savedEntity = await ctx.store.get(Entity, { where: { entityId: entityDeletedEvent } })

  if (savedEntity) {
    ctx.store.remove(savedEntity)
  }
}