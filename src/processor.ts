// export * from './entity'
import { balancesTransfer } from './mappings/balances'
// export * from './twins'
// export * from './nodes'
// export * from './farms'
// export * from './contracts'
// export * from './policies'
// export * from './bridge'
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

processor.run();
