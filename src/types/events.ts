import assert from 'assert'
import {EventContext, Result} from './support'
import * as v12 from './v12'
import * as v27 from './v27'
import * as v43 from './v43'
import * as v49 from './v49'
import * as v9 from './v9'

export class BalancesTransferEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'balances.Transfer')
  }

  /**
   *  Transfer succeeded. \[from, to, value\]
   */
  get isLatest(): boolean {
    return this.ctx._chain.getEventHash('balances.Transfer') === '2082574713e816229f596f97b58d3debbdea4b002607df469a619e037cc11120'
  }

  /**
   *  Transfer succeeded. \[from, to, value\]
   */
  get asLatest(): [Uint8Array, Uint8Array, bigint] {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class SmartContractModuleContractBilledEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.ContractBilled')
  }

  get isLatest(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ContractBilled') === 'ace2ad8bb9e1a849089c903c4b5fa5af20807a4c38063e3950905248e38d1364'
  }

  get asLatest(): v9.ContractBill {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class SmartContractModuleContractCreatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.ContractCreated')
  }

  get isLatest(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ContractCreated') === '244cd160d324ef5817d531c5a237d5f33ce91e7cf5cf75d8e7c0728362f0ef6c'
  }

  get asLatest(): v9.Contract {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class SmartContractModuleContractUpdatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.ContractUpdated')
  }

  get isLatest(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ContractUpdated') === '18c97af7f1c0209f06ec7cf4e05f2fdb20cb60fc0b4b59eed30b6222a9c582ae'
  }

  get asLatest(): v9.Contract {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class SmartContractModuleNameContractCanceledEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.NameContractCanceled')
  }

  get isLatest(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.NameContractCanceled') === '9577fa53c6c79f7ab579fc024e6b7d479305453a969b57b6e0ff75f99d4d55c8'
  }

  get asLatest(): bigint {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class SmartContractModuleNodeContractCanceledEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.NodeContractCanceled')
  }

  get isLatest(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.NodeContractCanceled') === '49310c3b4c153d54697fa4c8e8d42ab1c11781c8a551be50e63e012e52d9fee1'
  }

  get asLatest(): [bigint, number, number] {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class SmartContractModuleNruConsumptionReportReceivedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.NruConsumptionReportReceived')
  }

  get isLatest(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.NruConsumptionReportReceived') === 'd4095bf8f0c336fc9996503720eaa15ff4e0c6153295c80a82938688ecc0f29a'
  }

  get asLatest(): v49.NruConsumption {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class SmartContractModuleUpdatedUsedResourcesEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.UpdatedUsedResources')
  }

  get isLatest(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.UpdatedUsedResources') === 'c37cccb7e3c9e64c36ed8fb686e1109e4e5a14656d56e424f734144248cf48dc'
  }

  get asLatest(): v49.ContractResources {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class TfgridModuleEntityDeletedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.EntityDeleted')
  }

  get isLatest(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.EntityDeleted') === '0526e9a3a571ce09cfbbdb2917e827967bf2d75c35522045edd533aaea4887a8'
  }

  get asLatest(): number {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class TfgridModuleEntityStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.EntityStored')
  }

  get isLatest(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.EntityStored') === 'c75df984445d85459368cae19f3bdc703b014355661413accb6184a1dc50de40'
  }

  get asLatest(): v9.Entity {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class TfgridModuleEntityUpdatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.EntityUpdated')
  }

  get isLatest(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.EntityUpdated') === '2a2620dc534acc6588b924f0b65b0f085f4d1175105b2e67773d90305ac2040c'
  }

  get asLatest(): v9.Entity {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class TfgridModuleFarmDeletedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmDeleted')
  }

  get isLatest(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmDeleted') === '4fdea3db2c2a4faa2824157afc159238c638c9c5566e303de8b7add1b6c86c39'
  }

  get asLatest(): number {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class TfgridModuleFarmPayoutV2AddressRegisteredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmPayoutV2AddressRegistered')
  }

  get isLatest(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmPayoutV2AddressRegistered') === 'c6f78316432978c33cabfe762b96520c78ad1f24c01249c8218f62646c6f8f00'
  }

  get asLatest(): [number, Uint8Array] {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class TfgridModuleFarmStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmStored')
  }

  get isLatest(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmStored') === 'c1e68a81621a7fea60516ee89811bc921c4c4ce95129eb6d7aa902bab700545d'
  }

  get asLatest(): v9.Farm {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class TfgridModuleFarmUpdatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmUpdated')
  }

  get isLatest(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmUpdated') === 'ee777399a0d3e20c98f8407f198c9bc5b26de622a38f81fb3799d7fdec4f68ca'
  }

  get asLatest(): v9.Farm {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class TfgridModuleFarmingPolicyStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmingPolicyStored')
  }

  get isLatest(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmingPolicyStored') === 'ccab665b657f34d8c651122b1a49a427b511673b8f0a6c8b74ca6ff8618c3bda'
  }

  get asLatest(): v9.FarmingPolicy {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class TfgridModuleNodeDeletedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.NodeDeleted')
  }

  get isLatest(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeDeleted') === '57730f0f164241ce81a9956a4df88af22315932120a25e4b7c8cfd71f76eb7c9'
  }

  get asLatest(): number {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class TfgridModuleNodePublicConfigStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.NodePublicConfigStored')
  }

  get isLatest(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodePublicConfigStored') === '07492a9833e1e4e74a0c4130f6eec8ffdb251fb312e7b354ff2ba1b067acf25d'
  }

  get asLatest(): [number, v12.PublicConfig] {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class TfgridModuleNodeStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.NodeStored')
  }

  get isV9(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeStored') === 'a59469c2e2291556f34b036189759d67f4acee97273f3b55e881844b471fbef0'
  }

  get asV9(): v9.Node {
    assert(this.isV9)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isV27(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeStored') === 'e7e3b4f2d2dfd6ba851bcc39855200ee753c5016ebf462ac0e44d9cff4895a16'
  }

  get asV27(): v27.Node {
    assert(this.isV27)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeStored') === '4bd4940cd4b941fd0f843990556be178f621af4f9d8c8d0c8832dda539b82e5b'
  }

  get asLatest(): v43.Node {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class TfgridModuleNodeUpdatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.NodeUpdated')
  }

  get isV9(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeUpdated') === 'd4722654403a9ca440bd2640111a8874121e903ea05734369998484021c95e7c'
  }

  get asV9(): v9.Node {
    assert(this.isV9)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isV27(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeUpdated') === '45d446b2969aad004babe6d2e9a8115de10d45b82e7f0db50a1cded0eaa3a8ce'
  }

  get asV27(): v27.Node {
    assert(this.isV27)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeUpdated') === '41f25ea7b642331c032b3c3f63deff0dd9c197086945253c65fdda5abaa31dda'
  }

  get asLatest(): v43.Node {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class TfgridModuleNodeUptimeReportedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.NodeUptimeReported')
  }

  get isLatest(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeUptimeReported') === 'ca4da32e6d6364129c3909ab0cef8e3fcd93bafac754e0e26bcf778ea6ffcccf'
  }

  get asLatest(): [number, bigint, bigint] {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class TfgridModulePricingPolicyStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.PricingPolicyStored')
  }

  get isLatest(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.PricingPolicyStored') === '9cf3a1bf2c98a718ab0d5f04fa352a4f05e649ade6a1418404963c91dda846c3'
  }

  get asLatest(): v9.PricingPolicy {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class TfgridModuleTwinDeletedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.TwinDeleted')
  }

  get isLatest(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.TwinDeleted') === 'ee18bb72281a79281202689a4e285931d0526dc8bd35f701efce369e2b2f2de6'
  }

  get asLatest(): number {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class TfgridModuleTwinEntityRemovedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.TwinEntityRemoved')
  }

  get isLatest(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.TwinEntityRemoved') === '799e83fb3a39f26dcb4cc0f75666e313562067ec70ced76edd4bfcf404642196'
  }

  get asLatest(): [number, number] {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class TfgridModuleTwinEntityStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.TwinEntityStored')
  }

  get isLatest(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.TwinEntityStored') === '248b2436255667b5e6b7ebc2b4c4e1ecc402d78f11e5a6a2b9eb22d45fac2a33'
  }

  get asLatest(): [number, number, Uint8Array] {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class TfgridModuleTwinStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.TwinStored')
  }

  get isLatest(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.TwinStored') === 'c760880bb3792e8099aaf1daf30cdaaabc7a05c6f3eda9c6f6328fe23e3cb423'
  }

  get asLatest(): v9.Twin {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class TftBridgeModuleBurnTransactionProcessedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tftBridgeModule.BurnTransactionProcessed')
  }

  get isLatest(): boolean {
    return this.ctx._chain.getEventHash('tftBridgeModule.BurnTransactionProcessed') === '1a735db0fa91186f624ee7f4f5f996e6f0e4976acc7c16c226b5d3fbe82841c0'
  }

  get asLatest(): v9.BurnTransaction {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class TftBridgeModuleMintCompletedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tftBridgeModule.MintCompleted')
  }

  get isLatest(): boolean {
    return this.ctx._chain.getEventHash('tftBridgeModule.MintCompleted') === 'f631619d20e166c39d1d518cf06217cb10dbe698eb7f71de66f6d8db0b338a87'
  }

  get asLatest(): v9.MintTransaction {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class TftBridgeModuleRefundTransactionProcessedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tftBridgeModule.RefundTransactionProcessed')
  }

  get isLatest(): boolean {
    return this.ctx._chain.getEventHash('tftBridgeModule.RefundTransactionProcessed') === 'f868c34098fb97bbee2138f7bb3fe9ce05a6cc4d2a2e9325ce0525c45e8c66c8'
  }

  get asLatest(): v9.RefundTransaction {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}
