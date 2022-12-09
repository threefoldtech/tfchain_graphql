import { balancesTransfer } from './mappings/balances'
import { twinStored, twinDeleted, twinEntityStored, twinEntityRemoved, twinUpdated } from './mappings/twins'
import {
  nodeStored, nodeUpdated, nodeDeleted, nodeUptimeReported,
  nodePublicConfigStored, nodeCertificationSet, powerStateChanged, powerTargetChanged
} from './mappings/nodes'
import { farmingPolicyStored, pricingPolicyStored, farmingPolicyUpdated } from './mappings/policies';
import { farmDeleted, farmPayoutV2AddressRegistered, farmStored, farmUpdated, farmCertificationSet } from './mappings/farms';
import { entityDeleted, entityStored, entityUpdated } from './mappings/entity';
import {
  contractBilled, contractCreated, contractUpdated, contractUpdateUsedResources, nameContractCanceled,
  nodeContractCanceled, nruConsumptionReportReceived, rentContractCanceled, contractGracePeriodStarted, contractGracePeriodEnded,
  capacityReservationContractCanceled
} from './mappings/contracts';
import {
  deploymentCreated, deploymentUpdated, deploymentCanceled,
} from './mappings/deployments'
import { burnProcessed, mintCompleted, refundProcessed } from './mappings/bridge';
import { solutionProviderCreated, solutionProviderApproved } from './mappings/solutionProviders'
import { capacityReservationContractResourcesChanged } from './mappings/contractMappers/v120'

import {
  SubstrateProcessor,
} from "@subsquid/substrate-processor";

const processor = new SubstrateProcessor("substrate_threefold");

processor.setTypesBundle("typegen/typesBundle.json");
processor.setBatchSize(500);
processor.setPrometheusPort(44233)

processor.setDataSource({
  archive: process.env.INDEXER_ENDPOINT_URL || 'http://localhost:4010/v1/graphql',
  chain: process.env.WS_URL || 'ws://localhost:9944'
});

processor.addEventHandler('balances.Transfer', ctx => balancesTransfer(ctx));

processor.addEventHandler('tfgridModule.TwinStored', ctx => twinStored(ctx));
processor.addEventHandler('tfgridModule.TwinUpdated', ctx => twinUpdated(ctx));
processor.addEventHandler('tfgridModule.TwinDeleted', ctx => twinDeleted(ctx));
processor.addEventHandler('tfgridModule.TwinEntityStored', ctx => twinEntityStored(ctx));
processor.addEventHandler('tfgridModule.TwinEntityDeleted', ctx => twinEntityRemoved(ctx));

processor.addEventHandler('tfgridModule.NodeStored', ctx => nodeStored(ctx));
processor.addEventHandler('tfgridModule.NodeUptimeReported', ctx => nodeUptimeReported(ctx));
processor.addEventHandler('tfgridModule.NodeDeleted', ctx => nodeDeleted(ctx));
processor.addEventHandler('tfgridModule.NodePublicConfigStored', ctx => nodePublicConfigStored(ctx));
processor.addEventHandler('tfgridModule.NodeUpdated', ctx => nodeUpdated(ctx));
processor.addEventHandler('tfgridModule.NodeCertificationSet', ctx => nodeCertificationSet(ctx));

processor.addEventHandler('tfgridModule.PricingPolicyStored', ctx => pricingPolicyStored(ctx));
processor.addEventHandler('tfgridModule.FarmingPolicyStored', ctx => farmingPolicyStored(ctx));
processor.addEventHandler('tfgridModule.FarmingPolicyUpdated', ctx => farmingPolicyUpdated(ctx));

processor.addEventHandler('tfgridModule.FarmStored', ctx => farmStored(ctx));
processor.addEventHandler('tfgridModule.FarmUpdated', ctx => farmUpdated(ctx));
processor.addEventHandler('tfgridModule.FarmDeleted', ctx => farmDeleted(ctx));
processor.addEventHandler('tfgridModule.FarmPayoutV2AddressRegistered', ctx => farmPayoutV2AddressRegistered(ctx));
processor.addEventHandler('tfgridModule.FarmCertificationSet', ctx => farmCertificationSet(ctx));

processor.addEventHandler('tfgridModule.EntityStored', ctx => entityStored(ctx));
processor.addEventHandler('tfgridModule.EntityUpdated', ctx => entityUpdated(ctx));
processor.addEventHandler('tfgridModule.EntityDeleted', ctx => entityDeleted(ctx));

processor.addEventHandler('tfgridModule.PowerTargetChanged', ctx => powerTargetChanged(ctx));
processor.addEventHandler('tfgridModule.PowerStateChanged', ctx => powerStateChanged(ctx));

processor.addEventHandler('smartContractModule.ContractCreated', ctx => contractCreated(ctx));
processor.addEventHandler('smartContractModule.ContractUpdated', ctx => contractUpdated(ctx));
processor.addEventHandler('smartContractModule.NodeContractCanceled', ctx => nodeContractCanceled(ctx));
processor.addEventHandler('smartContractModule.NameContractCanceled', ctx => nameContractCanceled(ctx));
processor.addEventHandler('smartContractModule.RentContractCanceled', ctx => rentContractCanceled(ctx));
processor.addEventHandler('smartContractModule.ContractBilled', ctx => contractBilled(ctx));
processor.addEventHandler('smartContractModule.UpdatedUsedResources', ctx => contractUpdateUsedResources(ctx));
processor.addEventHandler('smartContractModule.NruConsumptionReportReceived', ctx => nruConsumptionReportReceived(ctx))
processor.addEventHandler('smartContractModule.ContractGracePeriodStarted', ctx => contractGracePeriodStarted(ctx))
processor.addEventHandler('smartContractModule.ContractGracePeriodEnded', ctx => contractGracePeriodEnded(ctx))
processor.addEventHandler('smartContractModule.SolutionProviderCreated', ctx => solutionProviderCreated(ctx))
processor.addEventHandler('smartContractModule.SolutionProviderApproved', ctx => solutionProviderApproved(ctx))

processor.addEventHandler('smartContractModule.CapacityReservationContractCanceled', ctx => capacityReservationContractCanceled(ctx))
processor.addEventHandler('smartContractModule.CapacityReservationConsumableResourcesChanged', ctx => capacityReservationContractResourcesChanged(ctx))

processor.addEventHandler('smartContractModule.DeploymentCreated', ctx => deploymentCreated(ctx))
processor.addEventHandler('smartContractModule.DeploymentUpdated', ctx => deploymentUpdated(ctx))
processor.addEventHandler('smartContractModule.DeploymentCanceled', ctx => deploymentCanceled(ctx))

processor.addEventHandler('tftBridgeModule.MintCompleted', ctx => mintCompleted(ctx));
processor.addEventHandler('tfgridModule.BurnTransactionProcessed', ctx => burnProcessed(ctx));
processor.addEventHandler('tfgridModule.RefundTransactionProcessed', ctx => refundProcessed(ctx));

processor.run();
