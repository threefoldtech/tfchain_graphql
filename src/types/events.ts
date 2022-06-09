import assert from 'assert'
import {EventContext, Result, deprecateLatest} from './support'
import * as v9 from './v9'
import * as v12 from './v12'
import * as v25 from './v25'
import * as v28 from './v28'
import * as v43 from './v43'
import * as v49 from './v49'
import * as v50 from './v50'
import * as v51 from './v51'
import * as v59 from './v59'
import * as v62 from './v63'

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
    return this.ctx._chain.getEventHash('smartContractModule.ContractCreated') === '66add02bf570546099fea4bac24f8839006167dc1b80dd7136c271908b243276'
  }

  get asV9(): v9.Contract {
    assert(this.isV9)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isV25(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ContractCreated') === '9236d6ceb4b18a4a48634488b1cde9b5b395eff965ccc88c9ce3c2425d27e50f'
  }

  get asV25(): v25.Contract {
    assert(this.isV25)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isV50(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ContractCreated') === '824f21a7f4d646625468e03ff8a0c50449d6e0c5527edf82013d385754881c45'
  }

  get asV50(): v50.Contract {
    assert(this.isV50)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isV59(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ContractCreated') === '5446945d28da7c765303d310f9ca55fc9bb46e7b5f281ac184521f913c430ee0'
  }

  get asV59(): v59.Contract {
    assert(this.isV59)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV59
  }

  get asLatest(): v59.Contract {
    deprecateLatest()
    return this.asV59
  }
}

export class SmartContractModuleContractUpdatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.ContractUpdated')
  }

  get isV9(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ContractUpdated') === '66add02bf570546099fea4bac24f8839006167dc1b80dd7136c271908b243276'
  }

  get asV9(): v9.Contract {
    assert(this.isV9)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isV25(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ContractUpdated') === '9236d6ceb4b18a4a48634488b1cde9b5b395eff965ccc88c9ce3c2425d27e50f'
  }

  get asV25(): v25.Contract {
    assert(this.isV25)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isV50(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ContractUpdated') === '824f21a7f4d646625468e03ff8a0c50449d6e0c5527edf82013d385754881c45'
  }

  get asV50(): v50.Contract {
    assert(this.isV50)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isV59(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ContractUpdated') === '5446945d28da7c765303d310f9ca55fc9bb46e7b5f281ac184521f913c430ee0'
  }

  get asV59(): v59.Contract {
    assert(this.isV59)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV59
  }

  get asLatest(): v59.Contract {
    deprecateLatest()
    return this.asV59
  }
}

export class SmartContractModuleContractGracePeriodEndedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.ContractGracePeriodEnded')
  }

  get isV59(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ContractGracePeriodEnded') === 'da3d413ec5a77ddce8b8c12c9cdd58340716a71ab4effe398cbaf249a16d0542'
  }

  get asV59(): [bigint, number, number] {
    assert(this.isV59)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV59
  }

  get asLatest(): [bigint, number, number] {
    deprecateLatest()
    return this.asV59
  }
}

export class SmartContractModuleContractGracePeriodStartedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.ContractGracePeriodStarted')
  }

  get isV59(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ContractGracePeriodStarted') === 'e6ffbb3cdd02a660fb04c1fb606cae70e4a388774028c58e59a98d56f3654371'
  }

  get asV59(): [bigint, number, number, bigint] {
    assert(this.isV59)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV59
  }

  get asLatest(): [bigint, number, number, bigint] {
    deprecateLatest()
    return this.asV59
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

  get isV50(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmStored') === 'ec24dee4036a557d103cfa67fbde8a7758d4f82f2dc82e80a56b839aecd93ebb'
  }

  get asV50(): v50.Farm {
    assert(this.isV50)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isV62(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmStored') === 'ca41d591947edffabc4e5a891ad112debc48b2e676350f6208a4cb6eb13f4627'
  }

  get asV63(): v62.Farm {
    assert(this.isV62)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV62
  }

  get asLatest(): v62.Farm {
    deprecateLatest()
    return this.asV63
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

  get isV50(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmUpdated') === 'ec24dee4036a557d103cfa67fbde8a7758d4f82f2dc82e80a56b839aecd93ebb'
  }

  get asV50(): v50.Farm {
    assert(this.isV50)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isV62(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmUpdated') === 'ca41d591947edffabc4e5a891ad112debc48b2e676350f6208a4cb6eb13f4627'
  }

  get asV63(): v62.Farm {
    assert(this.isV62)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV62
  }

  get asLatest(): v62.Farm {
    deprecateLatest()
    return this.asV63
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

  get isV62(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmingPolicyStored') === 'e45f1ccb50e73b0f9a65c63399730f27041aa3b5c8347272bbbe01c3b66f5712'
  }

  get asV63(): v62.FarmingPolicy {
    assert(this.isV62)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV62
  }

  get asLatest(): v62.FarmingPolicy {
    deprecateLatest()
    return this.asV63
  }
}

export class TfgridModuleFarmingPolicyUpdatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmingPolicyUpdated')
  }

  get isV62(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmingPolicyUpdated') === 'e45f1ccb50e73b0f9a65c63399730f27041aa3b5c8347272bbbe01c3b66f5712'
  }

  get asV63(): v62.FarmingPolicy {
    assert(this.isV62)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV62
  }

  get asLatest(): v62.FarmingPolicy {
    deprecateLatest()
    return this.asV63
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

  get isV28(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeStored') === '982aba94d3d3b471ee10bfa4df7b72cca9b69683a66700e80abd89dadf2cde35'
  }

  get asV28(): v28.Node {
    assert(this.isV28)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isV43(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeStored') === '62927e9ab82956f67cd8dc695c4306b7313ec903fd93bc8473e5944e59c16cdd'
  }

  get asV43(): v43.Node {
    assert(this.isV43)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isV62(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeStored') === 'e1f5e9dacc89d5440a8c0eca179818231f2f3c7795140ef18ed503dc0dad337c'
  }

  get asV63(): v62.Node {
    assert(this.isV62)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV62
  }

  get asLatest(): v62.Node {
    deprecateLatest()
    return this.asV63
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

  get isV28(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeUpdated') === '982aba94d3d3b471ee10bfa4df7b72cca9b69683a66700e80abd89dadf2cde35'
  }

  get asV28(): v28.Node {
    assert(this.isV28)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isV43(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeUpdated') === '62927e9ab82956f67cd8dc695c4306b7313ec903fd93bc8473e5944e59c16cdd'
  }

  get asV43(): v43.Node {
    assert(this.isV43)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isV62(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeUpdated') === 'e1f5e9dacc89d5440a8c0eca179818231f2f3c7795140ef18ed503dc0dad337c'
  }

  get asV63(): v62.Node {
    assert(this.isV62)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV62
  }

  get asLatest(): v62.Node {
    deprecateLatest()
    return this.asV63
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

  get isV51(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.PricingPolicyStored') === '0f67e7bfdb642a68114325df76a8dc56ea54b43ae993499e316274c95e8cf8af'
  }

  get asV51(): v51.PricingPolicy {
    assert(this.isV51)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV51
  }

  get asLatest(): v51.PricingPolicy {
    deprecateLatest()
    return this.asV51
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
    return this.ctx._chain.getEventHash('tfgridModule.TwinStored') === '227edfd1a5fd83edb4bfcd22ba5f7ebe5ef8464b8a7b2ddebfe56997c4982276'
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

export class SmartContractModuleRentContractCanceledEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.RentContractCanceled')
  }

  get isV50(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.RentContractCanceled') === '0e1caef0df80727d2768bc480792261a4e7615b57b3e8182c7f664f06c96a08e'
  }

  get asV50(): bigint {
    assert(this.isV50)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV50
  }

  get asLatest(): bigint {
    deprecateLatest()
    return this.asV50
  }
}

export class TfgridModuleTwinUpdatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.TwinUpdated')
  }

  get isV9(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.TwinUpdated') === '227edfd1a5fd83edb4bfcd22ba5f7ebe5ef8464b8a7b2ddebfe56997c4982276'
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

export class TfgridModuleConnectionPriceSetEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.ConnectionPriceSet')
  }

  get isV62(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.ConnectionPriceSet') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
  }

  get asV63(): number {
    assert(this.isV62)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV62
  }

  get asLatest(): number {
    deprecateLatest()
    return this.asV63
  }
}

export class TfgridModuleFarmCertificationSetEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmCertificationSet')
  }

  get isV62(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmCertificationSet') === 'ffe62c890927616bc9d5af190bd4a3b2c69e29097ebc6ea5ee6a2e1e87ceb759'
  }

  get asV63(): [number, v62.FarmCertification] {
    assert(this.isV62)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV62
  }

  get asLatest(): [number, v62.FarmCertification] {
    deprecateLatest()
    return this.asV63
  }
}

export class TfgridModuleFarmingPolicySetEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmingPolicySet')
  }

  get isV62(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmingPolicySet') === 'd64e52200384d2b2a6378823d0e0b9eba44abc0a9fc1b82114ef18b71937324c'
  }

  get asV63(): [number, (v62.FarmingPolicyLimit | undefined)] {
    assert(this.isV62)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV62
  }

  get asLatest(): [number, (v62.FarmingPolicyLimit | undefined)] {
    deprecateLatest()
    return this.asV63
  }
}

export class TfgridModuleNodeCertificationSetEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.NodeCertificationSet')
  }

  get isV62(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeCertificationSet') === 'd4945d9aee3a9679b5626ad868873cd15d01a6eafb319306d7528643c7ab38d2'
  }

  get asV63(): [number, v62.NodeCertification] {
    assert(this.isV62)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV62
  }

  get asLatest(): [number, v62.NodeCertification] {
    deprecateLatest()
    return this.asV63
  }
}

export class TfgridModuleNodeMarkedAsDedicatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.NodeMarkedAsDedicated')
  }

  get isV62(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeMarkedAsDedicated') === 'f267e1fa04f32dd15473e3a6d2514ae684bd7ba5516d192ba70e4d49211868aa'
  }

  get asV63(): [number, boolean] {
    assert(this.isV62)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV62
  }

  get asLatest(): [number, boolean] {
    deprecateLatest()
    return this.asV63
  }
}