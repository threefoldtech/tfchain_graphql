import { Store } from '@subsquid/typeorm-store'
import { Ctx } from '../processor'
import { SubstrateBlock } from '@subsquid/substrate-processor';
import { EventItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'
import { In } from 'typeorm'
import { TftPriceModulePriceStoredEvent, TftPriceModuleAveragePriceStoredEvent } from '../types/events';
import { PriceStored, AveragePriceStored } from '../model';
import { ParserFixPointFn } from '@encointer/util'

export async function priceStored(
    ctx: Ctx,
    item: EventItem<'TFTPriceModule.PriceStored', { event: { args: true } }>,
    timestamp: bigint,
    block: SubstrateBlock
) {
    let priceStoredEvent = new TftPriceModulePriceStoredEvent(ctx, item.event)

    let priceEvent
    if (priceStoredEvent.isV9) {
        // TODO: fix me U16F16 -> number
        // use @encointer/util to parse U16F16 to number
        // priceEvent = priceStoredEvent.asV9[0] // [Uint8Array, Uint8Array] <- U16F16, AccountId
        return 
    } else if (priceStoredEvent.isV49) {
        // TODO: fix me U16F16 -> number
        // priceEvent = priceStoredEvent.asV49 // Uint8Array <-U16F16
        return
    } else if (priceStoredEvent.isV101) {
        priceEvent = priceStoredEvent.asV101 // number <- u32
    }

    if (!priceEvent) {
        return
    }

    let newPrice = new PriceStored()
    newPrice.block = block.height
    newPrice.timestamp = timestamp
    newPrice.newPrice = priceEvent
    
    await ctx.store.save<PriceStored>(newPrice)
}

export async function averagePriceStored(
    ctx: Ctx,
    item: EventItem<'TFTPriceModule.AveragePriceStored', { event: { args: true } }>,
    timestamp: bigint,
    block: SubstrateBlock
) {
    let averagePriceStoredEvent = new TftPriceModuleAveragePriceStoredEvent(ctx, item.event)

    let priceEvent
    if (averagePriceStoredEvent.isV105) {
        priceEvent = averagePriceStoredEvent.asV105
    }

    if (!priceEvent) {
        return
    }

    let newPrice = new PriceStored()
    newPrice.block = block.height
    newPrice.timestamp = timestamp
    newPrice.newPrice = priceEvent
    
    await ctx.store.save<PriceStored>(newPrice)
}