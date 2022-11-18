import assert from 'assert'
import {EventContext, Result, deprecateLatest} from './support'
import * as v119 from './v119'

export class BalancesTransferEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'balances.Transfer')
  }

  /**
   * Transfer succeeded.
   */
  get isV119(): boolean {
    return this.ctx._chain.getEventHash('balances.Transfer') === '0ffdf35c495114c2d42a8bf6c241483fd5334ca0198662e14480ad040f1e3a66'
  }

  /**
   * Transfer succeeded.
   */
  get asV119(): {from: v119.AccountId32, to: v119.AccountId32, amount: bigint} {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): {from: v119.AccountId32, to: v119.AccountId32, amount: bigint} {
    deprecateLatest()
    return this.asV119
  }
}

export class SmartContractModuleCapacityReservationContractCanceledEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.CapacityReservationContractCanceled')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.CapacityReservationContractCanceled') === '2a451998845cc7fbb5269823cda637a7f9805f49123c343665bb37cbbf9cfbe4'
  }

  get asV119(): {contractId: bigint, nodeId: number, twinId: number} {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): {contractId: bigint, nodeId: number, twinId: number} {
    deprecateLatest()
    return this.asV119
  }
}

export class SmartContractModuleContractBilledEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.ContractBilled')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ContractBilled') === '80f35d404149c70acbd173262c31ae49812dbb6c9f279954678dd758bb5aa239'
  }

  get asV119(): v119.ContractBill {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): v119.ContractBill {
    deprecateLatest()
    return this.asV119
  }
}

export class SmartContractModuleContractCreatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.ContractCreated')
  }

  /**
   * A contract got created
   */
  get isV119(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ContractCreated') === '67897028270b69d0adf674950e04fc027235a3cac7e1534e5944e8b0efbb7f5d'
  }

  /**
   * A contract got created
   */
  get asV119(): v119.Contract {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): v119.Contract {
    deprecateLatest()
    return this.asV119
  }
}

export class SmartContractModuleContractGracePeriodEndedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.ContractGracePeriodEnded')
  }

  /**
   * A Contract grace period was ended
   */
  get isV119(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ContractGracePeriodEnded') === '2a451998845cc7fbb5269823cda637a7f9805f49123c343665bb37cbbf9cfbe4'
  }

  /**
   * A Contract grace period was ended
   */
  get asV119(): {contractId: bigint, nodeId: number, twinId: number} {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): {contractId: bigint, nodeId: number, twinId: number} {
    deprecateLatest()
    return this.asV119
  }
}

export class SmartContractModuleContractGracePeriodStartedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.ContractGracePeriodStarted')
  }

  /**
   * A Contract grace period is triggered
   */
  get isV119(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ContractGracePeriodStarted') === '5c4b7518ed686396094c34c59a2f5d1cd0da102a76c852ec194b5c72a0faf79e'
  }

  /**
   * A Contract grace period is triggered
   */
  get asV119(): {contractId: bigint, nodeId: number, twinId: number, blockNumber: bigint} {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): {contractId: bigint, nodeId: number, twinId: number, blockNumber: bigint} {
    deprecateLatest()
    return this.asV119
  }
}

export class SmartContractModuleContractUpdatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.ContractUpdated')
  }

  /**
   * A contract was updated
   */
  get isV119(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ContractUpdated') === '67897028270b69d0adf674950e04fc027235a3cac7e1534e5944e8b0efbb7f5d'
  }

  /**
   * A contract was updated
   */
  get asV119(): v119.Contract {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): v119.Contract {
    deprecateLatest()
    return this.asV119
  }
}

export class SmartContractModuleDeploymentCanceledEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.DeploymentCanceled')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.DeploymentCanceled') === '6fb1cca63bfc731f7f1557228fa0796f7e5e8b3dea7af7fd2f3e15114ba5e641'
  }

  get asV119(): {deploymentId: bigint} {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): {deploymentId: bigint} {
    deprecateLatest()
    return this.asV119
  }
}

export class SmartContractModuleDeploymentCreatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.DeploymentCreated')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.DeploymentCreated') === '855a92f52baa7fa64bd1a212c0417b80d7daaa9c9da073f2ee85aadcfe63cb50'
  }

  get asV119(): v119.Deployment {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): v119.Deployment {
    deprecateLatest()
    return this.asV119
  }
}

export class SmartContractModuleDeploymentUpdatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.DeploymentUpdated')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.DeploymentUpdated') === '855a92f52baa7fa64bd1a212c0417b80d7daaa9c9da073f2ee85aadcfe63cb50'
  }

  get asV119(): v119.Deployment {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): v119.Deployment {
    deprecateLatest()
    return this.asV119
  }
}

export class SmartContractModuleGroupCreatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.GroupCreated')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.GroupCreated') === '8746e250e9d13842eebd30755b9eb7d71de5ebd8c46246b40d68a9b77ec37256'
  }

  get asV119(): {groupId: number, twinId: number} {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): {groupId: number, twinId: number} {
    deprecateLatest()
    return this.asV119
  }
}

export class SmartContractModuleGroupDeletedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.GroupDeleted')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.GroupDeleted') === 'dbcc15a90486715897fa34503bed221dc69a9ce5e2753a8750f235c8e72749de'
  }

  get asV119(): {groupId: number} {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): {groupId: number} {
    deprecateLatest()
    return this.asV119
  }
}

export class SmartContractModuleNameContractCanceledEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.NameContractCanceled')
  }

  /**
   * A Name contract is canceled
   */
  get isV119(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.NameContractCanceled') === '28d75d7f6a405072b1337c49414e7c89805fbab702800c1a4b653076bd2dc4db'
  }

  /**
   * A Name contract is canceled
   */
  get asV119(): {contractId: bigint} {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): {contractId: bigint} {
    deprecateLatest()
    return this.asV119
  }
}

export class SmartContractModuleNodeContractCanceledEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.NodeContractCanceled')
  }

  /**
   * deprecated event
   */
  get isV119(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.NodeContractCanceled') === '2a451998845cc7fbb5269823cda637a7f9805f49123c343665bb37cbbf9cfbe4'
  }

  /**
   * deprecated event
   */
  get asV119(): {contractId: bigint, nodeId: number, twinId: number} {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): {contractId: bigint, nodeId: number, twinId: number} {
    deprecateLatest()
    return this.asV119
  }
}

export class SmartContractModuleNruConsumptionReportReceivedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.NruConsumptionReportReceived')
  }

  /**
   * Network resources report received for contract
   */
  get isV119(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.NruConsumptionReportReceived') === '8fb8781273a0957437746af773ed15577fcddcf30727d6027f1651e65345eaf8'
  }

  /**
   * Network resources report received for contract
   */
  get asV119(): v119.NruConsumption {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): v119.NruConsumption {
    deprecateLatest()
    return this.asV119
  }
}

export class SmartContractModuleRentContractCanceledEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.RentContractCanceled')
  }

  /**
   * Deprecated event
   */
  get isV119(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.RentContractCanceled') === '28d75d7f6a405072b1337c49414e7c89805fbab702800c1a4b653076bd2dc4db'
  }

  /**
   * Deprecated event
   */
  get asV119(): {contractId: bigint} {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): {contractId: bigint} {
    deprecateLatest()
    return this.asV119
  }
}

export class SmartContractModuleSolutionProviderApprovedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.SolutionProviderApproved')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.SolutionProviderApproved') === '840ac8d292e1374dbb168d73165f148f05f011c240521661b812cf877cec0614'
  }

  get asV119(): [bigint, boolean] {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): [bigint, boolean] {
    deprecateLatest()
    return this.asV119
  }
}

export class SmartContractModuleSolutionProviderCreatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.SolutionProviderCreated')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.SolutionProviderCreated') === 'd32a4b80af4fcacbe96dc685f8a21488024fe716bdb4ea57ff9ddee85e29bc26'
  }

  get asV119(): v119.SolutionProvider {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): v119.SolutionProvider {
    deprecateLatest()
    return this.asV119
  }
}

export class SmartContractModuleUpdatedUsedResourcesEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.UpdatedUsedResources')
  }

  /**
   * Deprecated event
   */
  get isV119(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.UpdatedUsedResources') === 'a2596f7d808ddd9ac668241df18cffb93329f10e334b13b87782cc828372795a'
  }

  /**
   * Deprecated event
   */
  get asV119(): v119.ContractResources {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): v119.ContractResources {
    deprecateLatest()
    return this.asV119
  }
}

export class TfgridModuleConnectionPriceSetEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.ConnectionPriceSet')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.ConnectionPriceSet') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
  }

  get asV119(): number {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): number {
    deprecateLatest()
    return this.asV119
  }
}

export class TfgridModuleEntityDeletedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.EntityDeleted')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.EntityDeleted') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
  }

  get asV119(): number {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): number {
    deprecateLatest()
    return this.asV119
  }
}

export class TfgridModuleEntityStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.EntityStored')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.EntityStored') === '9d6387c93300e77d2fc96af3ccb27b7eddb14f3768bdf0cf045995fc0be93d47'
  }

  get asV119(): v119.Entity {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): v119.Entity {
    deprecateLatest()
    return this.asV119
  }
}

export class TfgridModuleEntityUpdatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.EntityUpdated')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.EntityUpdated') === '9d6387c93300e77d2fc96af3ccb27b7eddb14f3768bdf0cf045995fc0be93d47'
  }

  get asV119(): v119.Entity {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): v119.Entity {
    deprecateLatest()
    return this.asV119
  }
}

export class TfgridModuleFarmCertificationSetEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmCertificationSet')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmCertificationSet') === 'ffe62c890927616bc9d5af190bd4a3b2c69e29097ebc6ea5ee6a2e1e87ceb759'
  }

  get asV119(): [number, v119.FarmCertification] {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): [number, v119.FarmCertification] {
    deprecateLatest()
    return this.asV119
  }
}

export class TfgridModuleFarmDeletedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmDeleted')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmDeleted') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
  }

  get asV119(): number {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): number {
    deprecateLatest()
    return this.asV119
  }
}

export class TfgridModuleFarmPayoutV2AddressRegisteredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmPayoutV2AddressRegistered')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmPayoutV2AddressRegistered') === 'a0d19821e09bcebcf8e5acfe4b5eca3681c180d4c05c2f647fff4efbae5ffac9'
  }

  get asV119(): [number, Uint8Array] {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): [number, Uint8Array] {
    deprecateLatest()
    return this.asV119
  }
}

export class TfgridModuleFarmStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmStored')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmStored') === '74b71e5fe3d2ea0881a33f99511ab05ec0233a16d23bc46f38fa69f638b7abe8'
  }

  get asV119(): v119.Farm {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): v119.Farm {
    deprecateLatest()
    return this.asV119
  }
}

export class TfgridModuleFarmUpdatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmUpdated')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmUpdated') === '74b71e5fe3d2ea0881a33f99511ab05ec0233a16d23bc46f38fa69f638b7abe8'
  }

  get asV119(): v119.Farm {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): v119.Farm {
    deprecateLatest()
    return this.asV119
  }
}

export class TfgridModuleFarmingPolicySetEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmingPolicySet')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmingPolicySet') === 'd64e52200384d2b2a6378823d0e0b9eba44abc0a9fc1b82114ef18b71937324c'
  }

  get asV119(): [number, (v119.FarmingPolicyLimit | undefined)] {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): [number, (v119.FarmingPolicyLimit | undefined)] {
    deprecateLatest()
    return this.asV119
  }
}

export class TfgridModuleFarmingPolicyStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmingPolicyStored')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmingPolicyStored') === 'e45f1ccb50e73b0f9a65c63399730f27041aa3b5c8347272bbbe01c3b66f5712'
  }

  get asV119(): v119.FarmingPolicy {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): v119.FarmingPolicy {
    deprecateLatest()
    return this.asV119
  }
}

export class TfgridModuleFarmingPolicyUpdatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmingPolicyUpdated')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmingPolicyUpdated') === 'e45f1ccb50e73b0f9a65c63399730f27041aa3b5c8347272bbbe01c3b66f5712'
  }

  get asV119(): v119.FarmingPolicy {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): v119.FarmingPolicy {
    deprecateLatest()
    return this.asV119
  }
}

export class TfgridModuleNodeCertificationSetEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.NodeCertificationSet')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeCertificationSet') === 'd4945d9aee3a9679b5626ad868873cd15d01a6eafb319306d7528643c7ab38d2'
  }

  get asV119(): [number, v119.NodeCertification] {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): [number, v119.NodeCertification] {
    deprecateLatest()
    return this.asV119
  }
}

export class TfgridModuleNodeDeletedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.NodeDeleted')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeDeleted') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
  }

  get asV119(): number {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): number {
    deprecateLatest()
    return this.asV119
  }
}

export class TfgridModuleNodePublicConfigStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.NodePublicConfigStored')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodePublicConfigStored') === '3280822d064c517c372255a87e0f164783d75d41adc342fe0475179b687a0ad8'
  }

  get asV119(): [number, (v119.PublicConfig | undefined)] {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): [number, (v119.PublicConfig | undefined)] {
    deprecateLatest()
    return this.asV119
  }
}

export class TfgridModuleNodeStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.NodeStored')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeStored') === 'f5e91bfb694c0142908c326bc1efd68d7a2d391e22c23adf0ab14616de5952b0'
  }

  get asV119(): v119.Node {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): v119.Node {
    deprecateLatest()
    return this.asV119
  }
}

export class TfgridModuleNodeUpdatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.NodeUpdated')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeUpdated') === 'f5e91bfb694c0142908c326bc1efd68d7a2d391e22c23adf0ab14616de5952b0'
  }

  get asV119(): v119.Node {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): v119.Node {
    deprecateLatest()
    return this.asV119
  }
}

export class TfgridModuleNodeUptimeReportedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.NodeUptimeReported')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeUptimeReported') === '4a0c168b038c7fd8096026ff00cc3456827e0f2c507248ecfbcf2c4c07367288'
  }

  get asV119(): [number, bigint, bigint] {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): [number, bigint, bigint] {
    deprecateLatest()
    return this.asV119
  }
}

export class TfgridModulePowerStateChangedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.PowerStateChanged')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.PowerStateChanged') === 'd5322b23c8c357b4efd50099056dcfba214b94466b72d863ffc1ee8dbd90f80c'
  }

  get asV119(): {farmId: number, nodeId: number, powerState: v119.PowerState} {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): {farmId: number, nodeId: number, powerState: v119.PowerState} {
    deprecateLatest()
    return this.asV119
  }
}

export class TfgridModulePowerTargetChangedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.PowerTargetChanged')
  }

  /**
   * Send an event to zero os to change its state
   */
  get isV119(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.PowerTargetChanged') === 'c1d738baed628d197d192e6970ff592c9dc24c34f8aebc19303672d3d54dec89'
  }

  /**
   * Send an event to zero os to change its state
   */
  get asV119(): {farmId: number, nodeId: number, powerTarget: v119.PowerTarget} {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): {farmId: number, nodeId: number, powerTarget: v119.PowerTarget} {
    deprecateLatest()
    return this.asV119
  }
}

export class TfgridModulePricingPolicyStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.PricingPolicyStored')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.PricingPolicyStored') === '088c108804351450f3ff89c4217a7450b4d211e3f833d8ab4746d27624010cc0'
  }

  get asV119(): v119.PricingPolicy {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): v119.PricingPolicy {
    deprecateLatest()
    return this.asV119
  }
}

export class TfgridModuleTwinDeletedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.TwinDeleted')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.TwinDeleted') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
  }

  get asV119(): number {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): number {
    deprecateLatest()
    return this.asV119
  }
}

export class TfgridModuleTwinEntityRemovedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.TwinEntityRemoved')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.TwinEntityRemoved') === 'a09602e40984745a7411a1855af06d133893a422fd68f7bdc4fb6a56bf1a3645'
  }

  get asV119(): [number, number] {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): [number, number] {
    deprecateLatest()
    return this.asV119
  }
}

export class TfgridModuleTwinEntityStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.TwinEntityStored')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.TwinEntityStored') === 'f41c776f2baf981d5a0d5e9d89f98858c2cdd7ea515b3d32a99e45dcb2c7a185'
  }

  get asV119(): [number, number, Uint8Array] {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): [number, number, Uint8Array] {
    deprecateLatest()
    return this.asV119
  }
}

export class TfgridModuleTwinStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.TwinStored')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.TwinStored') === '5b6f435dfe1514ae00c046d4634f4246d82542de8da2b6937732aec521f3408a'
  }

  get asV119(): v119.Twin {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): v119.Twin {
    deprecateLatest()
    return this.asV119
  }
}

export class TfgridModuleTwinUpdatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.TwinUpdated')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.TwinUpdated') === '5b6f435dfe1514ae00c046d4634f4246d82542de8da2b6937732aec521f3408a'
  }

  get asV119(): v119.Twin {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): v119.Twin {
    deprecateLatest()
    return this.asV119
  }
}

export class TftBridgeModuleBurnTransactionProcessedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tftBridgeModule.BurnTransactionProcessed')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('tftBridgeModule.BurnTransactionProcessed') === '554a047c1ffa468c18106c4c9c346a7b03d75e25de542329ef60cf60d44206c9'
  }

  get asV119(): v119.BurnTransaction {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): v119.BurnTransaction {
    deprecateLatest()
    return this.asV119
  }
}

export class TftBridgeModuleMintCompletedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tftBridgeModule.MintCompleted')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('tftBridgeModule.MintCompleted') === '7484d8a69c745c46e51d9cf158387d67ab42730f0da3184b219d6240b1b537d7'
  }

  get asV119(): v119.MintTransaction {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): v119.MintTransaction {
    deprecateLatest()
    return this.asV119
  }
}

export class TftBridgeModuleRefundTransactionProcessedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tftBridgeModule.RefundTransactionProcessed')
  }

  get isV119(): boolean {
    return this.ctx._chain.getEventHash('tftBridgeModule.RefundTransactionProcessed') === 'b8b1f1dc54430185acf4dfda7337f6b320da504654d541cc5260613d3ec89062'
  }

  get asV119(): v119.RefundTransaction {
    assert(this.isV119)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV119
  }

  get asLatest(): v119.RefundTransaction {
    deprecateLatest()
    return this.asV119
  }
}
