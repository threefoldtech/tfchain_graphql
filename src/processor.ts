// export * from './entity'
import { balancesTransfer } from './mappings/balances'
import { twinStored, twinDeleted, twinEntityStored, twinEntityRemoved } from './mappings/twins'
import { nodeStored, nodeUpdated, nodeDeleted, nodeUptimeReported, nodePublicConfigStored } from './mappings/nodes'

import {
  SubstrateProcessor,
} from "@subsquid/substrate-processor";

const processor = new SubstrateProcessor("substrate_threefold");

processor.setTypesBundle("typegen/typesBundle.json");
processor.setBatchSize(500);

processor.setDataSource({
  archive: "http://localhost:4010/v1/graphql",
  chain: "wss://tfchain.test.grid.tf",
});

processor.addEventHandler('balances.Transfer', ctx => balancesTransfer(ctx));

processor.addEventHandler('tfgridModule.TwinStored', ctx => twinStored(ctx));
processor.addEventHandler('tfgridModule.TwinDeleted', ctx => twinDeleted(ctx));
processor.addEventHandler('tfgridModule.TwinEntityStored', ctx => twinEntityStored(ctx));
processor.addEventHandler('tfgridModule.TwinEntityDeleted', ctx => twinEntityRemoved(ctx));

processor.addEventHandler('tfgridModule.NodeStored', ctx => nodeStored(ctx));
// processor.addEventHandler('tfgridModule.NodeUpdated', ctx => nodeUpdated(ctx));
processor.addEventHandler('tfgridModule.NodeDeleted', ctx => nodeDeleted(ctx));
processor.addEventHandler('tfgridModule.NodeUptimeReported', ctx => nodeUptimeReported(ctx));
processor.addEventHandler('tfgridModule.NodePublicConfigStored', ctx => nodePublicConfigStored(ctx));

processor.run();
