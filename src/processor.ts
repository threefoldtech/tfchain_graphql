import { balancesTransfer } from './mappings/balances'
import { twinCreateOrUpdateOrDelete } from './mappings/twins'
import { nodeStored, nodeUpdated, nodeDeleted, nodeUptimeReported, nodePublicConfigStored, nodeCertificationSet } from './mappings/nodes'
import { farmingPolicyStored, pricingPolicyStored, farmingPolicyUpdated } from './mappings/policies';
import { farmCreateOrUpdateOrDelete, farmDeleted, farmPayoutV2AddressRegistered, farmCertificationSet } from './mappings/farms';
import { entityDeleted, entityStored, entityUpdated } from './mappings/entity';
import { contractBilled, contractCreated, contractUpdated, contractUpdateUsedResources, nameContractCanceled, nodeContractCanceled, nruConsumptionReportReceived, rentContractCanceled, contractGracePeriodStarted, contractGracePeriodEnded } from './mappings/contracts';
// import { burnProcessed, mintCompleted, refundProcessed } from './mappings/bridge';
import { solutionProviderCreated, solutionProviderApproved } from './mappings/solutionProviders'

import {
  SubstrateProcessor
} from "@subsquid/substrate-processor";
import { TypeormDatabase, Store } from '@subsquid/typeorm-store'
import {BatchContext, BatchProcessorItem, SubstrateBatchProcessor } from "@subsquid/substrate-processor"
import {In} from "typeorm"
import { uniqBy } from 'lodash'

// const db = new TypeormDatabase()
// const processor = new SubstrateProcessor(db);

// processor.setTypesBundle("typegen/typesBundle.json");
// processor.setBatchSize(100);
// processor.setPrometheusPort(44233)

// processor.setDataSource({
//   archive: process.env.INDEXER_ENDPOINT_URL || 'http://localhost:8888/graphql',
//   chain: process.env.WS_URL || 'ws://localhost:9944'
// });

// processor.addEventHandler('Balances.Transfer', ctx => balancesTransfer(ctx));

// processor.addEventHandler('TfgridModule.TwinStored', ctx => twinStored(ctx));
// processor.addEventHandler('TfgridModule.TwinUpdated', ctx => twinUpdated(ctx));
// processor.addEventHandler('TfgridModule.TwinDeleted', ctx => twinDeleted(ctx));
// processor.addEventHandler('TfgridModule.TwinEntityStored', ctx => twinEntityStored(ctx));
// processor.addEventHandler('TfgridModule.TwinEntityDeleted', ctx => twinEntityRemoved(ctx));

// processor.addEventHandler('TfgridModule.NodeStored', ctx => nodeStored(ctx));
// processor.addEventHandler('TfgridModule.NodeUptimeReported', ctx => nodeUptimeReported(ctx));
// processor.addEventHandler('TfgridModule.NodeDeleted', ctx => nodeDeleted(ctx));
// processor.addEventHandler('TfgridModule.NodePublicConfigStored', ctx => nodePublicConfigStored(ctx));
// processor.addEventHandler('TfgridModule.NodeUpdated', ctx => nodeUpdated(ctx));
// processor.addEventHandler('TfgridModule.NodeCertificationSet', ctx => nodeCertificationSet(ctx));

// processor.addEventHandler('TfgridModule.PricingPolicyStored', ctx => pricingPolicyStored(ctx));
// processor.addEventHandler('TfgridModule.FarmingPolicyStored', ctx => farmingPolicyStored(ctx));
// processor.addEventHandler('TfgridModule.FarmingPolicyUpdated', ctx => farmingPolicyUpdated(ctx));

// processor.addEventHandler('TfgridModule.FarmStored', ctx => farmStored(ctx));
// processor.addEventHandler('TfgridModule.FarmUpdated', ctx => farmUpdated(ctx));
// processor.addEventHandler('TfgridModule.FarmDeleted', ctx => farmDeleted(ctx));
// processor.addEventHandler('TfgridModule.FarmPayoutV2AddressRegistered', ctx => farmPayoutV2AddressRegistered(ctx));
// processor.addEventHandler('TfgridModule.FarmCertificationSet', ctx => farmCertificationSet(ctx));

// processor.addEventHandler('TfgridModule.EntityStored', ctx => entityStored(ctx));
// processor.addEventHandler('TfgridModule.EntityUpdated', ctx => entityUpdated(ctx));
// processor.addEventHandler('TfgridModule.EntityDeleted', ctx => entityDeleted(ctx));

// processor.addEventHandler('SmartContractModule.ContractCreated', ctx => contractCreated(ctx));
// processor.addEventHandler('SmartContractModule.ContractUpdated', ctx => contractUpdated(ctx));
// processor.addEventHandler('SmartContractModule.NodeContractCanceled', ctx => nodeContractCanceled(ctx));
// processor.addEventHandler('SmartContractModule.NameContractCanceled', ctx => nameContractCanceled(ctx));
// processor.addEventHandler('SmartContractModule.RentContractCanceled', ctx => rentContractCanceled(ctx));
// processor.addEventHandler('SmartContractModule.ContractBilled', ctx => contractBilled(ctx));
// processor.addEventHandler('SmartContractModule.UpdatedUsedResources', ctx => contractUpdateUsedResources(ctx));
// processor.addEventHandler('SmartContractModule.NruConsumptionReportReceived', ctx => nruConsumptionReportReceived(ctx))
// processor.addEventHandler('SmartContractModule.ContractGracePeriodStarted', ctx => contractGracePeriodStarted(ctx))
// processor.addEventHandler('SmartContractModule.ContractGracePeriodEnded', ctx => contractGracePeriodEnded(ctx))
// processor.addEventHandler('SmartContractModule.SolutionProviderCreated', ctx => solutionProviderCreated(ctx))
// processor.addEventHandler('SmartContractModule.SolutionProviderApproved', ctx => solutionProviderApproved(ctx))

// processor.addEventHandler('smartContractModule.NodeMarkedAsDedicated', ctx => nodeMarkedAsDedicated(ctx));

// processor.addEventHandler('TftBridgeModule.MintCompleted', ctx => mintCompleted(ctx));
// processor.addEventHandler('TfgridModule.BurnTransactionProcessed', ctx => burnProcessed(ctx));
// processor.addEventHandler('TfgridModule.RefundTransactionProcessed', ctx => refundProcessed(ctx));

// processor.run();

import {Account, Transfer} from "./model"

const processor = new SubstrateBatchProcessor()
    .setBatchSize(100)
    .setTypesBundle("typegen/typesBundle.json")
    .setDataSource({
      archive: process.env.INDEXER_ENDPOINT_URL || 'http://localhost:8888/graphql',
      chain: process.env.WS_URL || 'ws://localhost:9944'
    })
    .addEvent('Balances.Transfer', {
      data: {
        event: {
          args: true,
          extrinsic: {
            hash: true,
            fee: true
          }
        }
      }
    } as const)
    .addEvent('TfgridModule.TwinStored', {
      data: {
        event: {
          args: true,
        }
      }
    } as const)
    .addEvent('TfgridModule.TwinUpdated', {
      data: {
        event: {
          args: true,
        }
      }
    } as const)
    .addEvent('TfgridModule.TwinDeleted', {
      data: {
        event: {
          args: true,
        }
      }
    } as const)
    .addEvent('TfgridModule.FarmStored', {
      data: {
        event: {
          args: true,
        }
      }
    } as const)
    .addEvent('TfgridModule.FarmUpdated', {
      data: {
        event: {
          args: true,
        }
      }
    } as const)
    .addEvent('TfgridModule.FarmDeleted', {
      data: {
        event: {
          args: true,
        }
      }
    } as const)

export type Item = BatchProcessorItem<typeof processor>
export type Ctx = BatchContext<Store, Item>

import { BalancesTransferEvent } from "./types/events";
import * as ss58 from "@subsquid/ss58";

processor.run(new TypeormDatabase(), async ctx => {
  let [newTwins, updatedTwin, deletedTwins] = await twinCreateOrUpdateOrDelete(ctx)
  let [newFarms, updatedFarms, deletedFarms, publicIps] = await farmCreateOrUpdateOrDelete(ctx)
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

  // Insert new twins
  await ctx.store.insert(newTwins)
  // Save updated twins
  await ctx.store.save(updatedTwin)
  // Delete twins
  await ctx.store.remove(deletedTwins)

  // // Insert new farms
  let newFarmPromises = newFarms.map(f => {
    return ctx.store.insert(f)
  })
  await Promise.all(newFarmPromises)

  let updatedFarmsPromises = updatedFarms.map(f => {
    return ctx.store.save(f)
  })
  await Promise.all(updatedFarmsPromises)

  let deletedFarmsPromises = deletedFarms.map(f => {
    return ctx.store.remove(f)
  })
  await Promise.all(deletedFarmsPromises)

  let newPublicIpsPromises = publicIps.map(ip => {
    if (ip.publicIPs) {
      return ctx.store.save(uniqBy(ip.publicIPs, 'ip'))
    }
  })
  await Promise.all(newPublicIpsPromises)

  // await Promise.all(newPublicIpsPromises)
  // Save updated farms
  // await ctx.store.save(updatedFarms)
  // Delete Farm
  // await ctx.store.remove(deletedFarms)

  await ctx.store.save(Array.from(accounts.values()))
  await ctx.store.insert(transfers)
})

interface TransferEvent {
  id: string
  blockNumber: number
  timestamp: Date
  extrinsicHash?: string
  from: string
  to: string
  amount: bigint
  fee?: bigint
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
          extrinsicHash: item.event.extrinsic?.hash,
          from: ss58.codec('substrate').encode(rec.from),
          to: ss58.codec('substrate').encode(rec.to),
          amount: rec.amount,
          fee: item.event.extrinsic?.fee || 0n
        })
      }
    }
  }
  return transfers
}
