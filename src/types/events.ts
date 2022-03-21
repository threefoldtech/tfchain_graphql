import assert from 'assert'
import {EventContext, Result, deprecateLatest} from './support'
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
  get isV9(): boolean {
    return this.ctx._chain.getEventHash('balances.Transfer') === 'dad2bcdca357505fa3c7832085d0db53ce6f902bd9f5b52823ee8791d351872c'
  }

  /**
   *  Transfer succeeded. \[from, to, value\]
   */
  get asV9(): [Uint8Array, Uint8Array, bigint] {
    assert(this.isV9)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9
  }

  get asLatest(): [Uint8Array, Uint8Array, bigint] {
    deprecateLatest()
    return this.asV9
  }
}

export class SmartContractModuleContractBilledEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.ContractBilled')
  }

  get isV9(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ContractBilled') === '80f35d404149c70acbd173262c31ae49812dbb6c9f279954678dd758bb5aa239'
  }

  get asV9(): v9.ContractBill {
    assert(this.isV9)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9
  }

  get asLatest(): v9.ContractBill {
    deprecateLatest()
    return this.asV9
  }
}

export class SmartContractModuleContractCreatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.ContractCreated')
  }

  get isV9(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ContractCreated') === '824f21a7f4d646625468e03ff8a0c50449d6e0c5527edf82013d385754881c45'
  }

  get asV9(): v9.Contract {
    assert(this.isV9)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9
  }

  get asLatest(): v9.Contract {
    deprecateLatest()
    return this.asV9
  }
}

export class SmartContractModuleContractUpdatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.ContractUpdated')
  }

  get isV9(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ContractUpdated') === '824f21a7f4d646625468e03ff8a0c50449d6e0c5527edf82013d385754881c45'
  }

  get asV9(): v9.Contract {
    assert(this.isV9)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9
  }

  get asLatest(): v9.Contract {
    deprecateLatest()
    return this.asV9
  }
}

export class SmartContractModuleNameContractCanceledEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.NameContractCanceled')
  }

  get isV19(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.NameContractCanceled') === '0e1caef0df80727d2768bc480792261a4e7615b57b3e8182c7f664f06c96a08e'
  }

  get asV19(): bigint {
    assert(this.isV19)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV19
  }

  get asLatest(): bigint {
    deprecateLatest()
    return this.asV19
  }
}

export class SmartContractModuleNodeContractCanceledEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.NodeContractCanceled')
  }

  get isV19(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.NodeContractCanceled') === 'da3d413ec5a77ddce8b8c12c9cdd58340716a71ab4effe398cbaf249a16d0542'
  }

  get asV19(): [bigint, number, number] {
    assert(this.isV19)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV19
  }

  get asLatest(): [bigint, number, number] {
    deprecateLatest()
    return this.asV19
  }
}

export class SmartContractModuleNruConsumptionReportReceivedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.NruConsumptionReportReceived')
  }

  get isV49(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.NruConsumptionReportReceived') === '8fb8781273a0957437746af773ed15577fcddcf30727d6027f1651e65345eaf8'
  }

  get asV49(): v49.NruConsumption {
    assert(this.isV49)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV49
  }

  get asLatest(): v49.NruConsumption {
    deprecateLatest()
    return this.asV49
  }
}

export class SmartContractModuleUpdatedUsedResourcesEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.UpdatedUsedResources')
  }

  get isV49(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.UpdatedUsedResources') === 'a2596f7d808ddd9ac668241df18cffb93329f10e334b13b87782cc828372795a'
  }

  get asV49(): v49.ContractResources {
    assert(this.isV49)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV49
  }

  get asLatest(): v49.ContractResources {
    deprecateLatest()
    return this.asV49
  }
}

export class TfgridModuleEntityDeletedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.EntityDeleted')
  }

  get isV9(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.EntityDeleted') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
  }

  get asV9(): number {
    assert(this.isV9)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9
  }

  get asLatest(): number {
    deprecateLatest()
    return this.asV9
  }
}

export class TfgridModuleEntityStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.EntityStored')
  }

  get isV9(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.EntityStored') === '9d6387c93300e77d2fc96af3ccb27b7eddb14f3768bdf0cf045995fc0be93d47'
  }

  get asV9(): v9.Entity {
    assert(this.isV9)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9
  }

  get asLatest(): v9.Entity {
    deprecateLatest()
    return this.asV9
  }
}

export class TfgridModuleEntityUpdatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.EntityUpdated')
  }

  get isV9(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.EntityUpdated') === '9d6387c93300e77d2fc96af3ccb27b7eddb14f3768bdf0cf045995fc0be93d47'
  }

  get asV9(): v9.Entity {
    assert(this.isV9)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9
  }

  get asLatest(): v9.Entity {
    deprecateLatest()
    return this.asV9
  }
}

export class TfgridModuleFarmDeletedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmDeleted')
  }

  get isV9(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmDeleted') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
  }

  get asV9(): number {
    assert(this.isV9)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9
  }

  get asLatest(): number {
    deprecateLatest()
    return this.asV9
  }
}

export class TfgridModuleFarmPayoutV2AddressRegisteredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmPayoutV2AddressRegistered')
  }

  get isV9(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmPayoutV2AddressRegistered') === 'a0d19821e09bcebcf8e5acfe4b5eca3681c180d4c05c2f647fff4efbae5ffac9'
  }

  get asV9(): [number, Uint8Array] {
    assert(this.isV9)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9
  }

  get asLatest(): [number, Uint8Array] {
    deprecateLatest()
    return this.asV9
  }
}

export class TfgridModuleFarmStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmStored')
  }

  get isV9(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmStored') === '726b3750a3581693895b85199ef30539e39935122946406d4a41c5ceb64b5185'
  }

  get asV9(): v9.Farm {
    assert(this.isV9)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9
  }

  get asLatest(): v9.Farm {
    deprecateLatest()
    return this.asV9
  }
}

export class TfgridModuleFarmUpdatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmUpdated')
  }

  get isV9(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmUpdated') === '726b3750a3581693895b85199ef30539e39935122946406d4a41c5ceb64b5185'
  }

  get asV9(): v9.Farm {
    assert(this.isV9)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9
  }

  get asLatest(): v9.Farm {
    deprecateLatest()
    return this.asV9
  }
}

export class TfgridModuleFarmingPolicyStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmingPolicyStored')
  }

  get isV9(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmingPolicyStored') === '889678f6393313871185e40b56e531f314bc024974797c3b92b40e732e7bffa8'
  }

  get asV9(): v9.FarmingPolicy {
    assert(this.isV9)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9
  }

  get asLatest(): v9.FarmingPolicy {
    deprecateLatest()
    return this.asV9
  }
}

export class TfgridModuleNodeDeletedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.NodeDeleted')
  }

  get isV9(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeDeleted') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
  }

  get asV9(): number {
    assert(this.isV9)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9
  }

  get asLatest(): number {
    deprecateLatest()
    return this.asV9
  }
}

export class TfgridModuleNodePublicConfigStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.NodePublicConfigStored')
  }

  get isV12(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodePublicConfigStored') === '20643e6e9f19e9332d7341fb57361ee76e2353fc64d1b582212be20ca40e2a9d'
  }

  get asV12(): [number, v12.PublicConfig] {
    assert(this.isV12)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV12
  }

  get asLatest(): [number, v12.PublicConfig] {
    deprecateLatest()
    return this.asV12
  }
}

export class TfgridModuleNodeStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.NodeStored')
  }

  get isV9(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeStored') === '5bdfcccecb100fd5b88b3818d8a8bec1982a69c3a92acf8daf8337a0ee68b669'
  }

  get asV9(): v9.Node {
    assert(this.isV9)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isV27(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeStored') === '982aba94d3d3b471ee10bfa4df7b72cca9b69683a66700e80abd89dadf2cde35'
  }

  get asV27(): v27.Node {
    assert(this.isV27)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isV43(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeStored') === '62927e9ab82956f67cd8dc695c4306b7313ec903fd93bc8473e5944e59c16cdd'
  }

  get asV43(): v43.Node {
    assert(this.isV43)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV43
  }

  get asLatest(): v43.Node {
    deprecateLatest()
    return this.asV43
  }
}

export class TfgridModuleNodeUpdatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.NodeUpdated')
  }

  get isV9(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeUpdated') === '5bdfcccecb100fd5b88b3818d8a8bec1982a69c3a92acf8daf8337a0ee68b669'
  }

  get asV9(): v9.Node {
    assert(this.isV9)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isV27(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeUpdated') === '982aba94d3d3b471ee10bfa4df7b72cca9b69683a66700e80abd89dadf2cde35'
  }

  get asV27(): v27.Node {
    assert(this.isV27)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isV43(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeUpdated') === '62927e9ab82956f67cd8dc695c4306b7313ec903fd93bc8473e5944e59c16cdd'
  }

  get asV43(): v43.Node {
    assert(this.isV43)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV43
  }

  get asLatest(): v43.Node {
    deprecateLatest()
    return this.asV43
  }
}

export class TfgridModuleNodeUptimeReportedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.NodeUptimeReported')
  }

  get isV9(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeUptimeReported') === '4a0c168b038c7fd8096026ff00cc3456827e0f2c507248ecfbcf2c4c07367288'
  }

  get asV9(): [number, bigint, bigint] {
    assert(this.isV9)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9
  }

  get asLatest(): [number, bigint, bigint] {
    deprecateLatest()
    return this.asV9
  }
}

export class TfgridModulePricingPolicyStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.PricingPolicyStored')
  }

  get isV9(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.PricingPolicyStored') === '51a9871b7eb0af7df112128d5a4ef3e2a744f5d88c627402bee9f91a7c25fab2'
  }

  get asV9(): v9.PricingPolicy {
    assert(this.isV9)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9
  }

  get asLatest(): v9.PricingPolicy {
    deprecateLatest()
    return this.asV9
  }
}

export class TfgridModuleTwinDeletedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.TwinDeleted')
  }

  get isV9(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.TwinDeleted') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
  }

  get asV9(): number {
    assert(this.isV9)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9
  }

  get asLatest(): number {
    deprecateLatest()
    return this.asV9
  }
}

export class TfgridModuleTwinEntityRemovedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.TwinEntityRemoved')
  }

  get isV9(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.TwinEntityRemoved') === 'a09602e40984745a7411a1855af06d133893a422fd68f7bdc4fb6a56bf1a3645'
  }

  get asV9(): [number, number] {
    assert(this.isV9)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9
  }

  get asLatest(): [number, number] {
    deprecateLatest()
    return this.asV9
  }
}

export class TfgridModuleTwinEntityStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.TwinEntityStored')
  }

  get isV9(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.TwinEntityStored') === 'f41c776f2baf981d5a0d5e9d89f98858c2cdd7ea515b3d32a99e45dcb2c7a185'
  }

  get asV9(): [number, number, Uint8Array] {
    assert(this.isV9)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9
  }

  get asLatest(): [number, number, Uint8Array] {
    deprecateLatest()
    return this.asV9
  }
}

export class TfgridModuleTwinStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.TwinStored')
  }

  get isV9(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.TwinStored') === '5b6f435dfe1514ae00c046d4634f4246d82542de8da2b6937732aec521f3408a'
  }

  get asV9(): v9.Twin {
    assert(this.isV9)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9
  }

  get asLatest(): v9.Twin {
    deprecateLatest()
    return this.asV9
  }
}

export class TftBridgeModuleBurnTransactionProcessedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tftBridgeModule.BurnTransactionProcessed')
  }

  get isV9(): boolean {
    return this.ctx._chain.getEventHash('tftBridgeModule.BurnTransactionProcessed') === '08f0ce8b01eb55b7bbd6fa8a5927075338f0b3cfd5c50c698e9f148955e9a68d'
  }

  get asV9(): v9.BurnTransaction {
    assert(this.isV9)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9
  }

  get asLatest(): v9.BurnTransaction {
    deprecateLatest()
    return this.asV9
  }
}

export class TftBridgeModuleMintCompletedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tftBridgeModule.MintCompleted')
  }

  get isV9(): boolean {
    return this.ctx._chain.getEventHash('tftBridgeModule.MintCompleted') === '7484d8a69c745c46e51d9cf158387d67ab42730f0da3184b219d6240b1b537d7'
  }

  get asV9(): v9.MintTransaction {
    assert(this.isV9)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9
  }

  get asLatest(): v9.MintTransaction {
    deprecateLatest()
    return this.asV9
  }
}

export class TftBridgeModuleRefundTransactionProcessedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tftBridgeModule.RefundTransactionProcessed')
  }

  get isV9(): boolean {
    return this.ctx._chain.getEventHash('tftBridgeModule.RefundTransactionProcessed') === '9ef1c61a0bfc79f7ad8c76cf317f9463d7e6da5dccb0fd7a85e131521e306ad6'
  }

  get asV9(): v9.RefundTransaction {
    assert(this.isV9)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9
  }

  get asLatest(): v9.RefundTransaction {
    deprecateLatest()
    return this.asV9
  }
}
