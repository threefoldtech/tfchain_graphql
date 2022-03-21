// export * from './entity'
import { balancesTransfer } from './balances'
// export * from './twins'
// export * from './nodes'
// export * from './farms'
// export * from './contracts'
// export * from './policies'
// export * from './bridge'

import {
  SubstrateProcessor,
} from "@subsquid/substrate-processor";

const processor = new SubstrateProcessor("substrate-threefold");

processor.setTypesBundle("substrate-threefold");
processor.setBatchSize(500);

processor.setDataSource({
  archive: "http://localhost:4010/v5/graphql",
  chain: "ws://tfchain.test.grid.tf",
});

processor.addEventHandler('balances.Transfer', ctx => balancesTransfer(ctx));

processor.run();
