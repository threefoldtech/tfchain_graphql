// import * as ss58 from "@subsquid/ss58";
// import {
//   EventHandlerContext,
// } from "@subsquid/substrate-processor";
// import { MintTransaction, BurnTransaction, RefundTransaction } from "../model";
// import { TftBridgeModuleMintCompletedEvent, TftBridgeModuleBurnTransactionProcessedEvent, TftBridgeModuleRefundTransactionProcessedEvent } from "../types/events";

// export async function mintCompleted(ctx: EventHandlerContext<Store, { event: { name: string; args: any; } }>) {
//   const mintCompletedEvent = new TftBridgeModuleMintCompletedEvent(ctx).asV9

//   const mintTransaction = new MintTransaction()
//   mintTransaction.id = ctx.event.id
//   const accountID = ss58.codec("substrate").encode(mintCompletedEvent.target);
//   mintTransaction.target = accountID
//   mintTransaction.amount = mintCompletedEvent.amount
//   mintTransaction.block = mintCompletedEvent.block

//   await ctx.store.save<MintTransaction>(mintTransaction)
// }

// export async function burnProcessed(ctx: EventHandlerContext<Store, { event: { name: string; args: any; } }>) {
//   const burnProcessedEvent = new TftBridgeModuleBurnTransactionProcessedEvent(ctx)

//   let burn
//   if (burnProcessedEvent.isV9) {
//     burn = burnProcessedEvent.asV9
//   } else if (burnProcessedEvent.asV101) {
//     burn = burnProcessedEvent.asV101
//   } else {
//     return
//   }

//   const burnTransaction = new BurnTransaction()
//   burnTransaction.id = ctx.event.id
//   const accountID = ss58.codec("substrate").encode(burn.target);
//   burnTransaction.target = accountID
//   burnTransaction.amount = burn.amount
//   burnTransaction.block = burn.block

//   await ctx.store.save<BurnTransaction>(burnTransaction)
// }

// export async function refundProcessed(ctx: EventHandlerContext<Store, { event: { name: string; args: any; } }>) {
//   const refundProcessedEvent = new TftBridgeModuleRefundTransactionProcessedEvent(ctx)

//   let refund
//   if (refundProcessedEvent.isV9) {
//     refund = refundProcessedEvent.asV9
//   } else if (refundProcessedEvent.asV101) {
//     refund = refundProcessedEvent.asV101
//   } else {
//     return
//   }

//   const refundTransaction = new RefundTransaction()
//   refundTransaction.id = ctx.event.id
//   const accountID = ss58.codec("substrate").encode(refund.target);
//   refundTransaction.target = accountID
//   refundTransaction.amount = refund.amount
//   refundTransaction.block = refund.block
//   refundTransaction.txHash = refund.txHash.toString()

//   await ctx.store.save<RefundTransaction>(refundTransaction)
// }