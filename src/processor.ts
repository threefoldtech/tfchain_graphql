import { processBalancesTransfer } from './mappings/balances'
import { twinCreateOrUpdateOrDelete, twinStored } from './mappings/twins'
import { nodeCreateUpdateOrDelete, nodeStored, nodeUpdated, nodeDeleted, nodeUptimeReported, nodePublicConfigStored, nodeCertificationSet } from './mappings/nodes'
import { farmingPolicyStored, pricingPolicyStored, farmingPolicyUpdated } from './mappings/policies';
import { farmCreateOrUpdateOrDelete, farmCreateOrUpdateOrDeleteNoBatch, farmDeleted, farmPayoutV2AddressRegistered, farmCertificationSet } from './mappings/farms';
import { entityDeleted, entityStored, entityUpdated } from './mappings/entity';
import { processContractEvents } from './mappings/contracts';
// import { burnProcessed, mintCompleted, refundProcessed } from './mappings/bridge';
import { solutionProviderCreated, solutionProviderApproved } from './mappings/solutionProviders'

import {
  SubstrateBlock
} from "@subsquid/substrate-processor";
import { TypeormDatabase, Store } from '@subsquid/typeorm-store'
import {BatchContext, BatchProcessorItem, SubstrateBatchProcessor } from "@subsquid/substrate-processor"
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

const eventOptions = {
  data: {
    event: {
      args: true,
      extrinsic: true
    },
  } as const,
} as const

const processor = new SubstrateBatchProcessor()
    .setTypesBundle("typegen/typesBundle.json")
    .setDataSource({
      archive: process.env.INDEXER_ENDPOINT_URL || 'http://localhost:8888/graphql',
      chain: process.env.WS_URL || 'ws://localhost:9944'
    })
    .addEvent('Balances.Transfer', eventOptions)
    // Twins
    .addEvent('TfgridModule.TwinStored', eventOptions)
    .addEvent('TfgridModule.TwinUpdated', eventOptions)
    .addEvent('TfgridModule.TwinDeleted', eventOptions)
    // Farms
    .addEvent('TfgridModule.FarmStored', eventOptions)
    .addEvent('TfgridModule.FarmUpdated', eventOptions)
    .addEvent('TfgridModule.FarmDeleted', eventOptions)
    .addEvent('TfgridModule.FarmPayoutV2AddressRegistered', eventOptions)
    .addEvent('TfgridModule.FarmCertificationSet', eventOptions)
    // Nodes
    .addEvent('TfgridModule.NodeStored', eventOptions)
    .addEvent('TfgridModule.NodeUpdated', eventOptions)
    .addEvent('TfgridModule.NodeDeleted', eventOptions)
    .addEvent('TfgridModule.NodeUptimeReported', eventOptions)
    .addEvent('TfgridModule.NodePublicConfigStored', eventOptions)
    .addEvent('TfgridModule.NodeCertificationSet', eventOptions)
    // Contracts
    .addEvent('SmartContractModule.ContractCreated', eventOptions)
    .addEvent('SmartContractModule.ContractUpdated', eventOptions)
    .addEvent('SmartContractModule.NodeContractCanceled', eventOptions)
    .addEvent('SmartContractModule.NameContractCanceled', eventOptions)
    .addEvent('SmartContractModule.RentContractCanceled', eventOptions)
    .addEvent('SmartContractModule.ContractBilled', eventOptions)
    .addEvent('SmartContractModule.UpdatedUsedResources', eventOptions)
    .addEvent('SmartContractModule.NruConsumptionReportReceived', eventOptions)
    .addEvent('SmartContractModule.ContractGracePeriodStarted', eventOptions)
    .addEvent('SmartContractModule.ContractGracePeriodEnded', eventOptions)
    .addEvent('SmartContractModule.SolutionProviderCreated', eventOptions)
    .addEvent('SmartContractModule.SolutionProviderApproved', eventOptions)
    // Farming Policies
    .addEvent('TfgridModule.PricingPolicyStored', eventOptions)
    .addEvent('TfgridModule.FarmingPolicyStored', eventOptions)
    .addEvent('TfgridModule.FarmingPolicyUpdated', eventOptions)

export type Item = BatchProcessorItem<typeof processor>
export type Ctx = BatchContext<Store, Item>

async function handleEvents(ctx: Ctx, block: SubstrateBlock, item: Item) {
  switch (item.name) {
    case 'TfgridModule.TwinStored': return twinStored(ctx, block, item)
  }
}

let batchFarms = false

processor.run(new TypeormDatabase(), async ctx => {
  let [newTwins, updatedTwin, deletedTwins] = await twinCreateOrUpdateOrDelete(ctx)
  let [transfers, accounts] = await processBalancesTransfer(ctx)
  
  if (batchFarms) {
    let [newFarms, updatedFarms, deletedFarms, publicIps] = await farmCreateOrUpdateOrDelete(ctx)
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
    // Save updated farms
    await ctx.store.save(updatedFarms)
    // Delete Farm
    await ctx.store.remove(deletedFarms)  
  } else {
    await farmCreateOrUpdateOrDeleteNoBatch(ctx)
  }
  
  await ctx.store.save(accounts)
  await ctx.store.insert(transfers)

  // Insert new twins
  await ctx.store.insert(newTwins)
  // Save updated twins
  await ctx.store.save(updatedTwin)
  // Delete twins
  await ctx.store.remove(deletedTwins)

  await nodeCreateUpdateOrDelete(ctx)

  await processContractEvents(ctx)

  await nodeUptimeReported(ctx)
})
