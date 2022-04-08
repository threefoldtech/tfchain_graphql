import { balancesTransfer } from './mappings/balances'
import { twinStored, twinDeleted, twinEntityStored, twinEntityRemoved } from './mappings/twins'
import { nodeStored, nodeUpdated, nodeDeleted, nodeUptimeReported, nodePublicConfigStored } from './mappings/nodes'
import { farmingPolicyStored, pricingPolicyStored } from './mappings/policies';
import { farmDeleted, farmPayoutV2AddressRegistered, farmStored, farmUpdated } from './mappings/farms';
import { entityDeleted, entityStored, entityUpdated } from './mappings/entity';
import { contractBilled, contractCreated, contractUpdated, contractUpdateUsedResources, nameContractCanceled, nodeContractCanceled, nruConsumptionReportReceived } from './mappings/contracts';
import { burnProcessed, mintCompleted, refundProcessed } from './mappings/bridge';

import {
  SubstrateProcessor,
} from "@subsquid/substrate-processor";

const processor = new SubstrateProcessor("substrate_threefold");

processor.setTypesBundle("typegen/typesBundle.json");
processor.setBatchSize(2000);
processor.setPrometheusPort(44233)

processor.setDataSource({
  archive: process.env.INDEXER_ENDPOINT_URL || 'http://localhost:4010/v1/graphql',
  chain: process.env.WS_URL || 'ws://localhost:9944'
});

processor.addEventHandler('balances.Transfer', ctx => balancesTransfer(ctx));

processor.addEventHandler('tfgridModule.TwinStored', ctx => twinStored(ctx));
processor.addEventHandler('tfgridModule.TwinDeleted', ctx => twinDeleted(ctx));
processor.addEventHandler('tfgridModule.TwinEntityStored', ctx => twinEntityStored(ctx));
processor.addEventHandler('tfgridModule.TwinEntityDeleted', ctx => twinEntityRemoved(ctx));

processor.addEventHandler('tfgridModule.NodeStored', ctx => nodeStored(ctx));
processor.addEventHandler('tfgridModule.NodeUptimeReported', ctx => nodeUptimeReported(ctx));
processor.addEventHandler('tfgridModule.NodeDeleted', ctx => nodeDeleted(ctx));
processor.addEventHandler('tfgridModule.NodePublicConfigStored', ctx => nodePublicConfigStored(ctx));
processor.addEventHandler('tfgridModule.NodeUpdated', ctx => nodeUpdated(ctx));

processor.addEventHandler('tfgridModule.PricingPolicyStored', ctx => pricingPolicyStored(ctx));
processor.addEventHandler('tfgridModule.FarmingPolicyStored', ctx => farmingPolicyStored(ctx));

processor.addEventHandler('tfgridModule.FarmStored', ctx => farmStored(ctx));
processor.addEventHandler('tfgridModule.FarmUpdated', ctx => farmUpdated(ctx));
processor.addEventHandler('tfgridModule.FarmDeleted', ctx => farmDeleted(ctx));
processor.addEventHandler('tfgridModule.FarmPayoutV2AddressRegistered', ctx => farmPayoutV2AddressRegistered(ctx));

processor.addEventHandler('tfgridModule.EntityStored', ctx => entityStored(ctx));
processor.addEventHandler('tfgridModule.EntityUpdated', ctx => entityUpdated(ctx));
processor.addEventHandler('tfgridModule.EntityDeleted', ctx => entityDeleted(ctx));

processor.addEventHandler('smartContractModule.ContractCreated', ctx => contractCreated(ctx));
processor.addEventHandler('smartContractModule.ContractUpdated', ctx => contractUpdated(ctx));
processor.addEventHandler('smartContractModule.NodeContractCanceled', ctx => nodeContractCanceled(ctx));
processor.addEventHandler('smartContractModule.NameContractCanceled', ctx => nameContractCanceled(ctx));
processor.addEventHandler('smartContractModule.ContractBilled', ctx => contractBilled(ctx));
processor.addEventHandler('smartContractModule.UpdatedUsedResources', ctx => contractUpdateUsedResources(ctx));
processor.addEventHandler('smartContractModule.NruConsumptionReportReceived', ctx => nruConsumptionReportReceived(ctx))

processor.addEventHandler('tftBridgeModule.MintCompleted', ctx => mintCompleted(ctx));
processor.addEventHandler('tfgridModule.BurnTransactionProcessed', ctx => burnProcessed(ctx));
processor.addEventHandler('tfgridModule.RefundTransactionProcessed', ctx => refundProcessed(ctx));

processor.run();
