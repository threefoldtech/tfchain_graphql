import * as ss58 from "@subsquid/ss58";
import {
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { MintTransaction, BurnTransaction, RefundTransaction } from "../model";
import { TftBridgeModuleMintCompletedEvent, TftBridgeModuleBurnTransactionProcessedEvent, TftBridgeModuleRefundTransactionProcessedEvent } from "../types/events";

export async function mintCompleted(ctx: EventHandlerContext) {
  const mintCompletedEvent = new TftBridgeModuleMintCompletedEvent(ctx).asV9

  const mintTransaction = new MintTransaction()
  mintTransaction.id = ctx.event.id
  const accountID = ss58.codec("substrate").encode(mintCompletedEvent.target);
  mintTransaction.target = accountID
  mintTransaction.amount = mintCompletedEvent.amount
  mintTransaction.block = mintCompletedEvent.block

  await ctx.store.save<MintTransaction>(mintTransaction)
}

export async function burnProcessed(ctx: EventHandlerContext) {
  const burnProcessedEvent = new TftBridgeModuleBurnTransactionProcessedEvent(ctx).asV9

  const burnTransaction = new BurnTransaction()
  burnTransaction.id = ctx.event.id
  const accountID = ss58.codec("substrate").encode(burnProcessedEvent.target);
  burnTransaction.target = accountID
  burnTransaction.amount = burnProcessedEvent.amount
  burnTransaction.block = burnProcessedEvent.block

  await ctx.store.save<BurnTransaction>(burnTransaction)
}

export async function refundProcessed(ctx: EventHandlerContext) {
  const refundProcessedEvent = new TftBridgeModuleRefundTransactionProcessedEvent(ctx).asV9

  const refundTransaction = new RefundTransaction()
  refundTransaction.id = ctx.event.id
  const accountID = ss58.codec("substrate").encode(refundProcessedEvent.target);
  refundTransaction.target = accountID
  refundTransaction.amount = refundProcessedEvent.amount
  refundTransaction.block = refundProcessedEvent.block
  refundTransaction.txHash = refundProcessedEvent.txHash.toString()

  await ctx.store.save<RefundTransaction>(refundTransaction)
}