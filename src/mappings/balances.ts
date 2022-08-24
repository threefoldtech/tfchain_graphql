import * as ss58 from "@subsquid/ss58";
import { Transfer } from "../model";
import { BalancesTransferEvent } from "../types/events";
import { Store } from '@subsquid/typeorm-store'
import {
  EventHandlerContext,
} from "@subsquid/substrate-processor";

export async function balancesTransfer(ctx: EventHandlerContext<Store, { event: { args: any; } }>): Promise<void> {
  const transferEvent = new BalancesTransferEvent(ctx)

  let from, to, amount
  let transfer
  if (transferEvent.isV9) {
    transfer = transferEvent.asV9
    from = transfer[0]
    to = transfer[1]
    amount = transfer[2]
  } else if (transferEvent.isV101) {
    transfer = transferEvent.asV101
    from = transfer.from
    to = transfer.to
    amount = transfer.amount
  } else { return }

  const fromEncoded = ss58.codec("substrate").encode(from);
  const toEncoded = ss58.codec("substrate").encode(to);

  // save as a transfer as well
  const t = new Transfer()
  t.id = ctx.event.id
  t.to = toEncoded
  t.from = fromEncoded
  t.amount = amount
  t.timestamp = BigInt(0)
  await ctx.store.save(t)
}
