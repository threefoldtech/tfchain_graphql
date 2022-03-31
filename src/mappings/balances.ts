import * as ss58 from "@subsquid/ss58";
import {
  EventHandlerContext,
  Store,
} from "@subsquid/substrate-processor";
import { Transfer } from "../model";
import { BalancesTransferEvent } from "../types/events";

export async function balancesTransfer(ctx: EventHandlerContext): Promise<void> {
  const store: Store = ctx.store

  const [from, to, amount] = new BalancesTransferEvent(ctx).asV9;

  const fromEncoded = ss58.codec("substrate").encode(from);
  const toEncoded = ss58.codec("substrate").encode(to);

  // save as a transfer as well
  const t = new Transfer()
  t.id = ctx.event.id
  t.to = toEncoded
  t.from = fromEncoded
  t.amount = amount
  t.timestamp = BigInt(ctx.block.timestamp)
  await store.save(t)
}
