import { processBalancesTransfer } from './mappings/balances'
import { twinCreateOrUpdateOrDelete } from './mappings/twins'
import {
  nodeUptimeReported, 
  nodeCertificationSet, nodeDeleted, nodePublicConfigStored,
  nodeStored, nodeUpdated
 } from './mappings/nodes'
 import { farmingPolicyStored, pricingPolicyStored, farmingPolicyUpdated } from './mappings/policies';
 import { 
  farmDeleted, farmPayoutV2AddressRegistered, 
  farmStored, farmUpdated, farmCertificationSet
} from './mappings/farms';
import { 
  collectContractBillReports,
  contractCreated, contractGracePeriodEnded, 
  contractGracePeriodStarted, contractUpdateUsedResources,
  nameContractCanceled, nodeContractCanceled, 
  contractUpdated, nruConsumptionReportReceived, rentContractCanceled
} from './mappings/contracts';
import { solutionProviderApproved, solutionProviderCreated } from './mappings/solutionProviders'
import { 
  serviceContractCreated, serviceContractMetadataSet, 
  serviceContractFeesSet, serviceContractApproved, 
  serviceContractCanceled, serviceContractBilled 
} from './mappings/serviceContracts';

import {
  SubstrateBlock
} from "@subsquid/substrate-processor";
import { TypeormDatabase, Store } from '@subsquid/typeorm-store'
import {BatchContext, BatchProcessorItem, SubstrateBatchProcessor } from "@subsquid/substrate-processor"

const eventOptions = {
  data: {
    event: {
      args: true,
      // extrinsic: true
    },
  } as const,
} as const

const processor = new SubstrateBatchProcessor()
  .setTypesBundle("typegen/typesBundle.json")
  .setDataSource({
    archive: process.env.INDEXER_ENDPOINT_URL || 'http://localhost:8888/graphql',
    chain: process.env.WS_URL || 'ws://localhost:9944'
  })
  // Balances
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
  // Service Contracts
  .addEvent('SmartContractModule.ServiceContractCreated', eventOptions)
  .addEvent('SmartContractModule.ServiceContractMetadataSet', eventOptions)
  .addEvent('SmartContractModule.ServiceContractFeesSet', eventOptions)
  .addEvent('SmartContractModule.ServiceContractApproved', eventOptions)
  .addEvent('SmartContractModule.ServiceContractCanceled', eventOptions)
  .addEvent('SmartContractModule.ServiceContractBilled', eventOptions)

export type Item = BatchProcessorItem<typeof processor>
export type Ctx = BatchContext<Store, Item>

async function handleEvents(ctx: Ctx, block: SubstrateBlock, item: Item) {
  switch (item.name) {
    // Contracts
    case 'SmartContractModule.ContractCreated': return contractCreated(ctx, item, block.timestamp)
    case 'SmartContractModule.ContractUpdated': return contractUpdated(ctx, item, block.timestamp)
    case 'SmartContractModule.NodeContractCanceled': return nodeContractCanceled(ctx, item)
    case 'SmartContractModule.NameContractCanceled': return nameContractCanceled(ctx, item)
    case 'SmartContractModule.RentContractCanceled': return rentContractCanceled(ctx, item)
    case 'SmartContractModule.UpdatedUsedResources': return contractUpdateUsedResources(ctx, item)
    case 'SmartContractModule.NruConsumptionReportReceived': return nruConsumptionReportReceived(ctx, item)
    case 'SmartContractModule.ContractGracePeriodStarted': return contractGracePeriodStarted(ctx, item)
    case 'SmartContractModule.ContractGracePeriodEnded': return contractGracePeriodEnded(ctx, item)
    // Farms
    case 'TfgridModule.FarmStored': return farmStored(ctx, item)
    case 'TfgridModule.FarmUpdated': return farmUpdated(ctx, item)
    case 'TfgridModule.FarmDeleted':  return farmDeleted(ctx, item)
    case 'TfgridModule.FarmPayoutV2AddressRegistered': return farmPayoutV2AddressRegistered(ctx, item)
    case 'TfgridModule.FarmCertificationSet': return farmCertificationSet(ctx, item)
    // Nodes
    case "TfgridModule.NodeStored": return nodeStored(ctx, item, block.timestamp)
    case "TfgridModule.NodeUpdated": return nodeUpdated(ctx, item, block.timestamp)
    case "TfgridModule.NodeDeleted": return nodeDeleted(ctx, item)
    case 'TfgridModule.NodePublicConfigStored': return nodePublicConfigStored(ctx, item)
    case 'TfgridModule.NodeCertificationSet': return nodeCertificationSet(ctx, item)
    // Policies
    case 'TfgridModule.PricingPolicyStored': return pricingPolicyStored(ctx, item)
    case 'TfgridModule.FarmingPolicyStored': return farmingPolicyStored(ctx, item)
    case 'TfgridModule.FarmingPolicyUpdated': return farmingPolicyUpdated(ctx, item)
    // Solutions
    case 'SmartContractModule.SolutionProviderCreated': return solutionProviderCreated(ctx, item)
    case 'SmartContractModule.SolutionProviderApproved': return solutionProviderApproved(ctx, item)
    // Service Contracts
    case 'SmartContractModule.ServiceContractCreated': return serviceContractCreated(ctx, item)
    case 'SmartContractModule.ServiceContractMetadataSet': return serviceContractMetadataSet(ctx, item)
    case 'SmartContractModule.ServiceContractFeesSet': return serviceContractFeesSet(ctx, item)
    case 'SmartContractModule.ServiceContractApproved': return serviceContractApproved(ctx, item)
    case 'SmartContractModule.ServiceContractCanceled': return serviceContractCanceled(ctx, item)
    case 'SmartContractModule.ServiceContractBilled': return serviceContractBilled(ctx, item)
  }
}

processor.run(new TypeormDatabase(), async ctx => {
  // Process all non-batch events
  for (let block of ctx.blocks) {
    for (let item of block.items) {
      await handleEvents(ctx, block.header, item)
    }
  }

  // Process twins in batch
  let [newTwins, updatedTwin, deletedTwins] = await twinCreateOrUpdateOrDelete(ctx)
  // Insert new twins
  await ctx.store.insert(newTwins)
  // Save updated twins
  await ctx.store.save(updatedTwin)
  // Delete twins
  await ctx.store.remove(deletedTwins)

  // Process transfers
  let [transfers, accounts] = await processBalancesTransfer(ctx)
  await ctx.store.save(accounts)
  await ctx.store.insert(transfers)

  // Process bill reports
  let contractBillReports = collectContractBillReports(ctx)
  await ctx.store.save(contractBillReports)

  // Batch node uptime reports
  await nodeUptimeReported(ctx)
})
