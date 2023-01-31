import * as ss58 from "@subsquid/ss58";
import { Transfer, Account } from "../model";
import { BalancesTransferEvent } from "../types/events";
import { Ctx } from '../processor'
import { In } from "typeorm"

export async function processBalancesTransfer(ctx: Ctx): Promise<[Transfer[], Account[]]> {
  let transfersData = getTransfers(ctx)

  let accountIds = new Set<string>()
  for (let t of transfersData) {
    accountIds.add(t.from)
    accountIds.add(t.to)
  }

  let accounts = await ctx.store.findBy(Account, {id: In([...accountIds])}).then(accounts => {
    return new Map(accounts.map(a => [a.id, a]))
  })

  let transfers: Transfer[] = []

  for (let t of transfersData) {
    let {id, blockNumber, amount} = t

    transfers.push(new Transfer({
      id,
      timestamp: BigInt(0),
      from: t.from,
      to: t.to,
      amount,
    }))
  }

  return [transfers, Array.from(accounts.values())]
}

function getTransfers(ctx: Ctx): TransferEvent[] {
  let transfers: TransferEvent[] = []
  for (let block of ctx.blocks) {
    for (let item of block.items) {
      if (item.name == "Balances.Transfer") {
        let e = new BalancesTransferEvent(ctx, item.event)
        let rec: {from: Uint8Array, to: Uint8Array, amount: bigint}
        if (e.isV49) {
          let [from, to, amount,] = e.asV49
          rec = { from, to, amount }
        } else if (e.isV101) {
        let { from, to, amount }  = e.asV101
          rec = {from, to, amount}
        } else {
          rec = e.asV101
        }
        transfers.push({
          id: item.event.id,
          blockNumber: block.header.height,
          timestamp: new Date(block.header.timestamp),
          // extrinsicHash: item.event.extrinsic?.hash,
          from: ss58.codec('substrate').encode(rec.from),
          to: ss58.codec('substrate').encode(rec.to),
          amount: rec.amount,
          // fee: item.event.extrinsic?.fee || 0n
        })
      }
    }
  }
  return transfers
}

interface TransferEvent {
  id: string
  blockNumber: number
  timestamp: Date
  // extrinsicHash?: string
  from: string
  to: string
  amount: bigint
  // fee?: bigint
}
