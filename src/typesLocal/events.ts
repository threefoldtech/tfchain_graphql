import assert from 'assert'
import {EventContext, Result, deprecateLatest} from './support'
import * as v120 from './v120'

export class BalancesTransferEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'balances.Transfer')
  }

  /**
   * Transfer succeeded.
   */
  get isV120(): boolean {
    return this.ctx._chain.getEventHash('balances.Transfer') === '0ffdf35c495114c2d42a8bf6c241483fd5334ca0198662e14480ad040f1e3a66'
  }

  /**
   * Transfer succeeded.
   */
  get asV120(): {from: v120.AccountId32, to: v120.AccountId32, amount: bigint} {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): {from: v120.AccountId32, to: v120.AccountId32, amount: bigint} {
    deprecateLatest()
    return this.asV120
  }
}

export class SmartContractModuleActiveDeploymentsChangedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.ActiveDeploymentsChanged')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ActiveDeploymentsChanged') === 'cb7eb7bb43234824ea722d91c332d9bf195dcaf6b59947ddeb564e45b200d123'
  }

  get asV120(): {contractId: bigint, deployments: bigint[]} {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): {contractId: bigint, deployments: bigint[]} {
    deprecateLatest()
    return this.asV120
  }
}

export class SmartContractModuleCapacityReservationConsumableResourcesChangedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.CapacityReservationConsumableResourcesChanged')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.CapacityReservationConsumableResourcesChanged') === 'b293c55cb6f1f1088d714389674a86341041cf343e5fdc36ca910ecdec40d249'
  }

  get asV120(): {contractId: bigint, resources: v120.ConsumableResources} {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): {contractId: bigint, resources: v120.ConsumableResources} {
    deprecateLatest()
    return this.asV120
  }
}

export class SmartContractModuleCapacityReservationContractCanceledEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.CapacityReservationContractCanceled')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.CapacityReservationContractCanceled') === '2a451998845cc7fbb5269823cda637a7f9805f49123c343665bb37cbbf9cfbe4'
  }

  get asV120(): {contractId: bigint, nodeId: number, twinId: number} {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): {contractId: bigint, nodeId: number, twinId: number} {
    deprecateLatest()
    return this.asV120
  }
}

export class SmartContractModuleContractBilledEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.ContractBilled')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ContractBilled') === '80f35d404149c70acbd173262c31ae49812dbb6c9f279954678dd758bb5aa239'
  }

  get asV120(): v120.ContractBill {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): v120.ContractBill {
    deprecateLatest()
    return this.asV120
  }
}

export class SmartContractModuleContractCreatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.ContractCreated')
  }

  /**
   * A contract got created
   */
  get isV120(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ContractCreated') === '8a59d10f6f2b263610ef4d25dbfc50c21b0f999cf28ce257b2ca4e9be581a6ce'
  }

  /**
   * A contract got created
   */
  get asV120(): v120.Contract {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): v120.Contract {
    deprecateLatest()
    return this.asV120
  }
}

export class SmartContractModuleContractGracePeriodEndedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.ContractGracePeriodEnded')
  }

  /**
   * A Contract grace period was ended
   */
  get isV120(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ContractGracePeriodEnded') === '2a451998845cc7fbb5269823cda637a7f9805f49123c343665bb37cbbf9cfbe4'
  }

  /**
   * A Contract grace period was ended
   */
  get asV120(): {contractId: bigint, nodeId: number, twinId: number} {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): {contractId: bigint, nodeId: number, twinId: number} {
    deprecateLatest()
    return this.asV120
  }
}

export class SmartContractModuleContractGracePeriodStartedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.ContractGracePeriodStarted')
  }

  /**
   * A Contract grace period is triggered
   */
  get isV120(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ContractGracePeriodStarted') === '5c4b7518ed686396094c34c59a2f5d1cd0da102a76c852ec194b5c72a0faf79e'
  }

  /**
   * A Contract grace period is triggered
   */
  get asV120(): {contractId: bigint, nodeId: number, twinId: number, blockNumber: bigint} {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): {contractId: bigint, nodeId: number, twinId: number, blockNumber: bigint} {
    deprecateLatest()
    return this.asV120
  }
}

export class SmartContractModuleContractUpdatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.ContractUpdated')
  }

  /**
   * A contract was updated
   */
  get isV120(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ContractUpdated') === '8a59d10f6f2b263610ef4d25dbfc50c21b0f999cf28ce257b2ca4e9be581a6ce'
  }

  /**
   * A contract was updated
   */
  get asV120(): v120.Contract {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): v120.Contract {
    deprecateLatest()
    return this.asV120
  }
}

export class SmartContractModuleDeploymentCanceledEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.DeploymentCanceled')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.DeploymentCanceled') === '33a072130f613abb5b356db1d5cb4f912d60b4c50cc8efefffec4ed5c09ef67c'
  }

  get asV120(): {deploymentId: bigint, twinId: number, nodeId: number, capacityReservationId: bigint} {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): {deploymentId: bigint, twinId: number, nodeId: number, capacityReservationId: bigint} {
    deprecateLatest()
    return this.asV120
  }
}

export class SmartContractModuleDeploymentCreatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.DeploymentCreated')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.DeploymentCreated') === '19d52d9d6011c2bbab161360f83a81d5f608dc567998af89397f160d37c659c2'
  }

  get asV120(): v120.Deployment {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): v120.Deployment {
    deprecateLatest()
    return this.asV120
  }
}

export class SmartContractModuleDeploymentUpdatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.DeploymentUpdated')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.DeploymentUpdated') === '19d52d9d6011c2bbab161360f83a81d5f608dc567998af89397f160d37c659c2'
  }

  get asV120(): v120.Deployment {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): v120.Deployment {
    deprecateLatest()
    return this.asV120
  }
}

export class SmartContractModuleGroupCreatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.GroupCreated')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.GroupCreated') === '8746e250e9d13842eebd30755b9eb7d71de5ebd8c46246b40d68a9b77ec37256'
  }

  get asV120(): {groupId: number, twinId: number} {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): {groupId: number, twinId: number} {
    deprecateLatest()
    return this.asV120
  }
}

export class SmartContractModuleGroupDeletedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.GroupDeleted')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.GroupDeleted') === 'dbcc15a90486715897fa34503bed221dc69a9ce5e2753a8750f235c8e72749de'
  }

  get asV120(): {groupId: number} {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): {groupId: number} {
    deprecateLatest()
    return this.asV120
  }
}

export class SmartContractModuleIPsFreedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.IPsFreed')
  }

  /**
   * IP got freed by a Node contract
   */
  get isV120(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.IPsFreed') === 'e3486a171a2e8ddfb92c6e41d056701ff58e06d3624dfa8f38b65b860eb60291'
  }

  /**
   * IP got freed by a Node contract
   */
  get asV120(): {contractId: bigint, publicIps: v120.IP4[]} {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): {contractId: bigint, publicIps: v120.IP4[]} {
    deprecateLatest()
    return this.asV120
  }
}

export class SmartContractModuleIPsReservedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.IPsReserved')
  }

  /**
   * IP got reserved by a Node contract
   */
  get isV120(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.IPsReserved') === 'e3486a171a2e8ddfb92c6e41d056701ff58e06d3624dfa8f38b65b860eb60291'
  }

  /**
   * IP got reserved by a Node contract
   */
  get asV120(): {contractId: bigint, publicIps: v120.IP4[]} {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): {contractId: bigint, publicIps: v120.IP4[]} {
    deprecateLatest()
    return this.asV120
  }
}

export class SmartContractModuleNameContractCanceledEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.NameContractCanceled')
  }

  /**
   * A Name contract is canceled
   */
  get isV120(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.NameContractCanceled') === '28d75d7f6a405072b1337c49414e7c89805fbab702800c1a4b653076bd2dc4db'
  }

  /**
   * A Name contract is canceled
   */
  get asV120(): {contractId: bigint} {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): {contractId: bigint} {
    deprecateLatest()
    return this.asV120
  }
}

export class SmartContractModuleNodeContractCanceledEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.NodeContractCanceled')
  }

  /**
   * deprecated event
   */
  get isV120(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.NodeContractCanceled') === '2a451998845cc7fbb5269823cda637a7f9805f49123c343665bb37cbbf9cfbe4'
  }

  /**
   * deprecated event
   */
  get asV120(): {contractId: bigint, nodeId: number, twinId: number} {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): {contractId: bigint, nodeId: number, twinId: number} {
    deprecateLatest()
    return this.asV120
  }
}

export class SmartContractModuleNruConsumptionReportReceivedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.NruConsumptionReportReceived')
  }

  /**
   * Network resources report received for contract
   */
  get isV120(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.NruConsumptionReportReceived') === '8fb8781273a0957437746af773ed15577fcddcf30727d6027f1651e65345eaf8'
  }

  /**
   * Network resources report received for contract
   */
  get asV120(): v120.NruConsumption {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): v120.NruConsumption {
    deprecateLatest()
    return this.asV120
  }
}

export class SmartContractModuleRentContractCanceledEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.RentContractCanceled')
  }

  /**
   * Deprecated event
   */
  get isV120(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.RentContractCanceled') === '28d75d7f6a405072b1337c49414e7c89805fbab702800c1a4b653076bd2dc4db'
  }

  /**
   * Deprecated event
   */
  get asV120(): {contractId: bigint} {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): {contractId: bigint} {
    deprecateLatest()
    return this.asV120
  }
}

export class SmartContractModuleSolutionProviderApprovedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.SolutionProviderApproved')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.SolutionProviderApproved') === '840ac8d292e1374dbb168d73165f148f05f011c240521661b812cf877cec0614'
  }

  get asV120(): [bigint, boolean] {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): [bigint, boolean] {
    deprecateLatest()
    return this.asV120
  }
}

export class SmartContractModuleSolutionProviderCreatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.SolutionProviderCreated')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.SolutionProviderCreated') === 'd32a4b80af4fcacbe96dc685f8a21488024fe716bdb4ea57ff9ddee85e29bc26'
  }

  get asV120(): v120.SolutionProvider {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): v120.SolutionProvider {
    deprecateLatest()
    return this.asV120
  }
}

export class SmartContractModuleUpdatedUsedResourcesEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.UpdatedUsedResources')
  }

  /**
   * Deprecated event
   */
  get isV120(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.UpdatedUsedResources') === 'a2596f7d808ddd9ac668241df18cffb93329f10e334b13b87782cc828372795a'
  }

  /**
   * Deprecated event
   */
  get asV120(): v120.ContractResources {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): v120.ContractResources {
    deprecateLatest()
    return this.asV120
  }
}

export class TfgridModuleConnectionPriceSetEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.ConnectionPriceSet')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.ConnectionPriceSet') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
  }

  get asV120(): number {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): number {
    deprecateLatest()
    return this.asV120
  }
}

export class TfgridModuleEntityDeletedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.EntityDeleted')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.EntityDeleted') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
  }

  get asV120(): number {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): number {
    deprecateLatest()
    return this.asV120
  }
}

export class TfgridModuleEntityStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.EntityStored')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.EntityStored') === '9d6387c93300e77d2fc96af3ccb27b7eddb14f3768bdf0cf045995fc0be93d47'
  }

  get asV120(): v120.Entity {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): v120.Entity {
    deprecateLatest()
    return this.asV120
  }
}

export class TfgridModuleEntityUpdatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.EntityUpdated')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.EntityUpdated') === '9d6387c93300e77d2fc96af3ccb27b7eddb14f3768bdf0cf045995fc0be93d47'
  }

  get asV120(): v120.Entity {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): v120.Entity {
    deprecateLatest()
    return this.asV120
  }
}

export class TfgridModuleFarmCertificationSetEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmCertificationSet')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmCertificationSet') === 'ffe62c890927616bc9d5af190bd4a3b2c69e29097ebc6ea5ee6a2e1e87ceb759'
  }

  get asV120(): [number, v120.FarmCertification] {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): [number, v120.FarmCertification] {
    deprecateLatest()
    return this.asV120
  }
}

export class TfgridModuleFarmDeletedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmDeleted')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmDeleted') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
  }

  get asV120(): number {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): number {
    deprecateLatest()
    return this.asV120
  }
}

export class TfgridModuleFarmPayoutV2AddressRegisteredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmPayoutV2AddressRegistered')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmPayoutV2AddressRegistered') === 'a0d19821e09bcebcf8e5acfe4b5eca3681c180d4c05c2f647fff4efbae5ffac9'
  }

  get asV120(): [number, Uint8Array] {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): [number, Uint8Array] {
    deprecateLatest()
    return this.asV120
  }
}

export class TfgridModuleFarmStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmStored')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmStored') === 'c5511ccdb26201c1fc5243aa71f0c9fa976199be0b2fd8495d8a346267e17f3a'
  }

  get asV120(): v120.Farm {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): v120.Farm {
    deprecateLatest()
    return this.asV120
  }
}

export class TfgridModuleFarmUpdatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmUpdated')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmUpdated') === 'c5511ccdb26201c1fc5243aa71f0c9fa976199be0b2fd8495d8a346267e17f3a'
  }

  get asV120(): v120.Farm {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): v120.Farm {
    deprecateLatest()
    return this.asV120
  }
}

export class TfgridModuleFarmingPolicySetEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmingPolicySet')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmingPolicySet') === 'd64e52200384d2b2a6378823d0e0b9eba44abc0a9fc1b82114ef18b71937324c'
  }

  get asV120(): [number, (v120.FarmingPolicyLimit | undefined)] {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): [number, (v120.FarmingPolicyLimit | undefined)] {
    deprecateLatest()
    return this.asV120
  }
}

export class TfgridModuleFarmingPolicyStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmingPolicyStored')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmingPolicyStored') === 'e45f1ccb50e73b0f9a65c63399730f27041aa3b5c8347272bbbe01c3b66f5712'
  }

  get asV120(): v120.FarmingPolicy {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): v120.FarmingPolicy {
    deprecateLatest()
    return this.asV120
  }
}

export class TfgridModuleFarmingPolicyUpdatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmingPolicyUpdated')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmingPolicyUpdated') === 'e45f1ccb50e73b0f9a65c63399730f27041aa3b5c8347272bbbe01c3b66f5712'
  }

  get asV120(): v120.FarmingPolicy {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): v120.FarmingPolicy {
    deprecateLatest()
    return this.asV120
  }
}

export class TfgridModuleNodeCertificationSetEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.NodeCertificationSet')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeCertificationSet') === 'd4945d9aee3a9679b5626ad868873cd15d01a6eafb319306d7528643c7ab38d2'
  }

  get asV120(): [number, v120.NodeCertification] {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): [number, v120.NodeCertification] {
    deprecateLatest()
    return this.asV120
  }
}

export class TfgridModuleNodeConsumableResourcesChangedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.NodeConsumableResourcesChanged')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeConsumableResourcesChanged') === '1a2158aa57323dc627db3b1436e83668ee00d71648808c8727f2f9bd4921341c'
  }

  get asV120(): {farmId: number, nodeId: number, resources: v120.ConsumableResources} {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): {farmId: number, nodeId: number, resources: v120.ConsumableResources} {
    deprecateLatest()
    return this.asV120
  }
}

export class TfgridModuleNodeDeletedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.NodeDeleted')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeDeleted') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
  }

  get asV120(): number {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): number {
    deprecateLatest()
    return this.asV120
  }
}

export class TfgridModuleNodePublicConfigStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.NodePublicConfigStored')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodePublicConfigStored') === '3280822d064c517c372255a87e0f164783d75d41adc342fe0475179b687a0ad8'
  }

  get asV120(): [number, (v120.PublicConfig | undefined)] {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): [number, (v120.PublicConfig | undefined)] {
    deprecateLatest()
    return this.asV120
  }
}

export class TfgridModuleNodeStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.NodeStored')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeStored') === '306aa604021f85236f84f51ed5b994af6950e1d9f376200504792848786bb8be'
  }

  get asV120(): v120.Node {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): v120.Node {
    deprecateLatest()
    return this.asV120
  }
}

export class TfgridModuleNodeUpdatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.NodeUpdated')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeUpdated') === '306aa604021f85236f84f51ed5b994af6950e1d9f376200504792848786bb8be'
  }

  get asV120(): v120.Node {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): v120.Node {
    deprecateLatest()
    return this.asV120
  }
}

export class TfgridModuleNodeUptimeReportedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.NodeUptimeReported')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeUptimeReported') === '4a0c168b038c7fd8096026ff00cc3456827e0f2c507248ecfbcf2c4c07367288'
  }

  get asV120(): [number, bigint, bigint] {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): [number, bigint, bigint] {
    deprecateLatest()
    return this.asV120
  }
}

export class TfgridModulePowerStateChangedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.PowerStateChanged')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.PowerStateChanged') === 'd5322b23c8c357b4efd50099056dcfba214b94466b72d863ffc1ee8dbd90f80c'
  }

  get asV120(): {farmId: number, nodeId: number, powerState: v120.PowerState} {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): {farmId: number, nodeId: number, powerState: v120.PowerState} {
    deprecateLatest()
    return this.asV120
  }
}

export class TfgridModulePowerTargetChangedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.PowerTargetChanged')
  }

  /**
   * Send an event to zero os to change its state
   */
  get isV120(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.PowerTargetChanged') === 'c1d738baed628d197d192e6970ff592c9dc24c34f8aebc19303672d3d54dec89'
  }

  /**
   * Send an event to zero os to change its state
   */
  get asV120(): {farmId: number, nodeId: number, powerTarget: v120.PowerTarget} {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): {farmId: number, nodeId: number, powerTarget: v120.PowerTarget} {
    deprecateLatest()
    return this.asV120
  }
}

export class TfgridModulePricingPolicyStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.PricingPolicyStored')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.PricingPolicyStored') === '088c108804351450f3ff89c4217a7450b4d211e3f833d8ab4746d27624010cc0'
  }

  get asV120(): v120.PricingPolicy {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): v120.PricingPolicy {
    deprecateLatest()
    return this.asV120
  }
}

export class TfgridModulePublicIpAddedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.PublicIPAdded')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.PublicIPAdded') === '9a9a94609ce7701073a6234b004e1c97838628cd504a143962319fb5bb02a803'
  }

  get asV120(): {farmId: number, publicIp: v120.IP4} {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): {farmId: number, publicIp: v120.IP4} {
    deprecateLatest()
    return this.asV120
  }
}

export class TfgridModulePublicIpRemovedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.PublicIPRemoved')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.PublicIPRemoved') === '9a9a94609ce7701073a6234b004e1c97838628cd504a143962319fb5bb02a803'
  }

  get asV120(): {farmId: number, publicIp: v120.IP4} {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): {farmId: number, publicIp: v120.IP4} {
    deprecateLatest()
    return this.asV120
  }
}

export class TfgridModuleTwinDeletedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.TwinDeleted')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.TwinDeleted') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
  }

  get asV120(): number {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): number {
    deprecateLatest()
    return this.asV120
  }
}

export class TfgridModuleTwinEntityRemovedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.TwinEntityRemoved')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.TwinEntityRemoved') === 'a09602e40984745a7411a1855af06d133893a422fd68f7bdc4fb6a56bf1a3645'
  }

  get asV120(): [number, number] {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): [number, number] {
    deprecateLatest()
    return this.asV120
  }
}

export class TfgridModuleTwinEntityStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.TwinEntityStored')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.TwinEntityStored') === 'f41c776f2baf981d5a0d5e9d89f98858c2cdd7ea515b3d32a99e45dcb2c7a185'
  }

  get asV120(): [number, number, Uint8Array] {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): [number, number, Uint8Array] {
    deprecateLatest()
    return this.asV120
  }
}

export class TfgridModuleTwinStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.TwinStored')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.TwinStored') === '5b6f435dfe1514ae00c046d4634f4246d82542de8da2b6937732aec521f3408a'
  }

  get asV120(): v120.Twin {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): v120.Twin {
    deprecateLatest()
    return this.asV120
  }
}

export class TfgridModuleTwinUpdatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.TwinUpdated')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.TwinUpdated') === '5b6f435dfe1514ae00c046d4634f4246d82542de8da2b6937732aec521f3408a'
  }

  get asV120(): v120.Twin {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): v120.Twin {
    deprecateLatest()
    return this.asV120
  }
}

export class TftBridgeModuleBurnTransactionProcessedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tftBridgeModule.BurnTransactionProcessed')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('tftBridgeModule.BurnTransactionProcessed') === '554a047c1ffa468c18106c4c9c346a7b03d75e25de542329ef60cf60d44206c9'
  }

  get asV120(): v120.BurnTransaction {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): v120.BurnTransaction {
    deprecateLatest()
    return this.asV120
  }
}

export class TftBridgeModuleMintCompletedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tftBridgeModule.MintCompleted')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('tftBridgeModule.MintCompleted') === '7484d8a69c745c46e51d9cf158387d67ab42730f0da3184b219d6240b1b537d7'
  }

  get asV120(): v120.MintTransaction {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): v120.MintTransaction {
    deprecateLatest()
    return this.asV120
  }
}

export class TftBridgeModuleRefundTransactionProcessedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tftBridgeModule.RefundTransactionProcessed')
  }

  get isV120(): boolean {
    return this.ctx._chain.getEventHash('tftBridgeModule.RefundTransactionProcessed') === 'b8b1f1dc54430185acf4dfda7337f6b320da504654d541cc5260613d3ec89062'
  }

  get asV120(): v120.RefundTransaction {
    assert(this.isV120)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV120
  }

  get asLatest(): v120.RefundTransaction {
    deprecateLatest()
    return this.asV120
  }
}
