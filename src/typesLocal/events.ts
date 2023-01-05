import assert from 'assert'
import {EventContext, Result, deprecateLatest} from './support'
import * as v122 from './v122'

export class BalancesTransferEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'balances.Transfer')
  }

  /**
   * Transfer succeeded.
   */
  get isV122(): boolean {
    return this.ctx._chain.getEventHash('balances.Transfer') === '0ffdf35c495114c2d42a8bf6c241483fd5334ca0198662e14480ad040f1e3a66'
  }

  /**
   * Transfer succeeded.
   */
  get asV122(): {from: v122.AccountId32, to: v122.AccountId32, amount: bigint} {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): {from: v122.AccountId32, to: v122.AccountId32, amount: bigint} {
    deprecateLatest()
    return this.asV122
  }
}

export class SmartContractModuleContractBilledEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.ContractBilled')
  }

  get isV122(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ContractBilled') === '80f35d404149c70acbd173262c31ae49812dbb6c9f279954678dd758bb5aa239'
  }

  get asV122(): v122.ContractBill {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): v122.ContractBill {
    deprecateLatest()
    return this.asV122
  }
}

export class SmartContractModuleContractCreatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.ContractCreated')
  }

  /**
   * A contract got created
   */
  get isV122(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ContractCreated') === 'bc600595215d0331e91aaeff45059fe6383f3362d537b936e491fe1154d3a842'
  }

  /**
   * A contract got created
   */
  get asV122(): v122.Contract {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): v122.Contract {
    deprecateLatest()
    return this.asV122
  }
}

export class SmartContractModuleContractGracePeriodEndedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.ContractGracePeriodEnded')
  }

  /**
   * A Contract grace period was ended
   */
  get isV122(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ContractGracePeriodEnded') === '2a451998845cc7fbb5269823cda637a7f9805f49123c343665bb37cbbf9cfbe4'
  }

  /**
   * A Contract grace period was ended
   */
  get asV122(): {contractId: bigint, nodeId: number, twinId: number} {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): {contractId: bigint, nodeId: number, twinId: number} {
    deprecateLatest()
    return this.asV122
  }
}

export class SmartContractModuleContractGracePeriodStartedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.ContractGracePeriodStarted')
  }

  /**
   * A Contract grace period is triggered
   */
  get isV122(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ContractGracePeriodStarted') === '5c4b7518ed686396094c34c59a2f5d1cd0da102a76c852ec194b5c72a0faf79e'
  }

  /**
   * A Contract grace period is triggered
   */
  get asV122(): {contractId: bigint, nodeId: number, twinId: number, blockNumber: bigint} {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): {contractId: bigint, nodeId: number, twinId: number, blockNumber: bigint} {
    deprecateLatest()
    return this.asV122
  }
}

export class SmartContractModuleContractUpdatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.ContractUpdated')
  }

  /**
   * A contract was updated
   */
  get isV122(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ContractUpdated') === 'bc600595215d0331e91aaeff45059fe6383f3362d537b936e491fe1154d3a842'
  }

  /**
   * A contract was updated
   */
  get asV122(): v122.Contract {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): v122.Contract {
    deprecateLatest()
    return this.asV122
  }
}

export class SmartContractModuleNameContractCanceledEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.NameContractCanceled')
  }

  /**
   * A Name contract is canceled
   */
  get isV122(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.NameContractCanceled') === '28d75d7f6a405072b1337c49414e7c89805fbab702800c1a4b653076bd2dc4db'
  }

  /**
   * A Name contract is canceled
   */
  get asV122(): {contractId: bigint} {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): {contractId: bigint} {
    deprecateLatest()
    return this.asV122
  }
}

export class SmartContractModuleNodeContractCanceledEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.NodeContractCanceled')
  }

  /**
   * A Node contract is canceled
   */
  get isV122(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.NodeContractCanceled') === '2a451998845cc7fbb5269823cda637a7f9805f49123c343665bb37cbbf9cfbe4'
  }

  /**
   * A Node contract is canceled
   */
  get asV122(): {contractId: bigint, nodeId: number, twinId: number} {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): {contractId: bigint, nodeId: number, twinId: number} {
    deprecateLatest()
    return this.asV122
  }
}

export class SmartContractModuleNruConsumptionReportReceivedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.NruConsumptionReportReceived')
  }

  /**
   * Network resources report received for contract
   */
  get isV122(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.NruConsumptionReportReceived') === '8fb8781273a0957437746af773ed15577fcddcf30727d6027f1651e65345eaf8'
  }

  /**
   * Network resources report received for contract
   */
  get asV122(): v122.NruConsumption {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): v122.NruConsumption {
    deprecateLatest()
    return this.asV122
  }
}

export class SmartContractModuleRentContractCanceledEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.RentContractCanceled')
  }

  /**
   * a Rent contract is canceled
   */
  get isV122(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.RentContractCanceled') === '28d75d7f6a405072b1337c49414e7c89805fbab702800c1a4b653076bd2dc4db'
  }

  /**
   * a Rent contract is canceled
   */
  get asV122(): {contractId: bigint} {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): {contractId: bigint} {
    deprecateLatest()
    return this.asV122
  }
}

export class SmartContractModuleServiceContractApprovedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.ServiceContractApproved')
  }

  /**
   * A Service contract is approved
   */
  get isV122(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ServiceContractApproved') === '31b80feead37363efd85ab0f302bd2d559a9275d61d4642185d79b006d0ddc52'
  }

  /**
   * A Service contract is approved
   */
  get asV122(): v122.ServiceContract {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): v122.ServiceContract {
    deprecateLatest()
    return this.asV122
  }
}

export class SmartContractModuleServiceContractBilledEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.ServiceContractBilled')
  }

  /**
   * A Service contract is billed
   */
  get isV122(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ServiceContractBilled') === '7985d39a3e56b65ab2853980404ab7250260ef1f2f7395adf3092259fb9ddbc5'
  }

  /**
   * A Service contract is billed
   */
  get asV122(): {serviceContract: v122.ServiceContract, bill: v122.ServiceContractBill, amount: bigint} {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): {serviceContract: v122.ServiceContract, bill: v122.ServiceContractBill, amount: bigint} {
    deprecateLatest()
    return this.asV122
  }
}

export class SmartContractModuleServiceContractCanceledEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.ServiceContractCanceled')
  }

  /**
   * A Service contract is canceled
   */
  get isV122(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ServiceContractCanceled') === '5d9c761d54a2a85566da8e150a364cc6f59f363b1139be81f9993b7d62a74bb0'
  }

  /**
   * A Service contract is canceled
   */
  get asV122(): {serviceContractId: bigint, cause: v122.Cause} {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): {serviceContractId: bigint, cause: v122.Cause} {
    deprecateLatest()
    return this.asV122
  }
}

export class SmartContractModuleServiceContractCreatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.ServiceContractCreated')
  }

  /**
   * A Service contract is created
   */
  get isV122(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ServiceContractCreated') === '31b80feead37363efd85ab0f302bd2d559a9275d61d4642185d79b006d0ddc52'
  }

  /**
   * A Service contract is created
   */
  get asV122(): v122.ServiceContract {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): v122.ServiceContract {
    deprecateLatest()
    return this.asV122
  }
}

export class SmartContractModuleServiceContractFeesSetEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.ServiceContractFeesSet')
  }

  /**
   * A Service contract fees are set
   */
  get isV122(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ServiceContractFeesSet') === '31b80feead37363efd85ab0f302bd2d559a9275d61d4642185d79b006d0ddc52'
  }

  /**
   * A Service contract fees are set
   */
  get asV122(): v122.ServiceContract {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): v122.ServiceContract {
    deprecateLatest()
    return this.asV122
  }
}

export class SmartContractModuleServiceContractMetadataSetEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.ServiceContractMetadataSet')
  }

  /**
   * A Service contract metadata is set
   */
  get isV122(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.ServiceContractMetadataSet') === '31b80feead37363efd85ab0f302bd2d559a9275d61d4642185d79b006d0ddc52'
  }

  /**
   * A Service contract metadata is set
   */
  get asV122(): v122.ServiceContract {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): v122.ServiceContract {
    deprecateLatest()
    return this.asV122
  }
}

export class SmartContractModuleSolutionProviderApprovedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.SolutionProviderApproved')
  }

  get isV122(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.SolutionProviderApproved') === '840ac8d292e1374dbb168d73165f148f05f011c240521661b812cf877cec0614'
  }

  get asV122(): [bigint, boolean] {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): [bigint, boolean] {
    deprecateLatest()
    return this.asV122
  }
}

export class SmartContractModuleSolutionProviderCreatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.SolutionProviderCreated')
  }

  get isV122(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.SolutionProviderCreated') === 'd32a4b80af4fcacbe96dc685f8a21488024fe716bdb4ea57ff9ddee85e29bc26'
  }

  get asV122(): v122.SolutionProvider {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): v122.SolutionProvider {
    deprecateLatest()
    return this.asV122
  }
}

export class SmartContractModuleUpdatedUsedResourcesEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'smartContractModule.UpdatedUsedResources')
  }

  /**
   * Contract resources got updated
   */
  get isV122(): boolean {
    return this.ctx._chain.getEventHash('smartContractModule.UpdatedUsedResources') === 'a2596f7d808ddd9ac668241df18cffb93329f10e334b13b87782cc828372795a'
  }

  /**
   * Contract resources got updated
   */
  get asV122(): v122.ContractResources {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): v122.ContractResources {
    deprecateLatest()
    return this.asV122
  }
}

export class TfgridModuleConnectionPriceSetEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.ConnectionPriceSet')
  }

  get isV122(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.ConnectionPriceSet') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
  }

  get asV122(): number {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): number {
    deprecateLatest()
    return this.asV122
  }
}

export class TfgridModuleEntityDeletedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.EntityDeleted')
  }

  get isV122(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.EntityDeleted') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
  }

  get asV122(): number {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): number {
    deprecateLatest()
    return this.asV122
  }
}

export class TfgridModuleEntityStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.EntityStored')
  }

  get isV122(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.EntityStored') === '9d6387c93300e77d2fc96af3ccb27b7eddb14f3768bdf0cf045995fc0be93d47'
  }

  get asV122(): v122.Entity {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): v122.Entity {
    deprecateLatest()
    return this.asV122
  }
}

export class TfgridModuleEntityUpdatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.EntityUpdated')
  }

  get isV122(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.EntityUpdated') === '9d6387c93300e77d2fc96af3ccb27b7eddb14f3768bdf0cf045995fc0be93d47'
  }

  get asV122(): v122.Entity {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): v122.Entity {
    deprecateLatest()
    return this.asV122
  }
}

export class TfgridModuleFarmCertificationSetEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmCertificationSet')
  }

  get isV122(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmCertificationSet') === 'ffe62c890927616bc9d5af190bd4a3b2c69e29097ebc6ea5ee6a2e1e87ceb759'
  }

  get asV122(): [number, v122.FarmCertification] {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): [number, v122.FarmCertification] {
    deprecateLatest()
    return this.asV122
  }
}

export class TfgridModuleFarmDeletedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmDeleted')
  }

  get isV122(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmDeleted') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
  }

  get asV122(): number {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): number {
    deprecateLatest()
    return this.asV122
  }
}

export class TfgridModuleFarmPayoutV2AddressRegisteredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmPayoutV2AddressRegistered')
  }

  get isV122(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmPayoutV2AddressRegistered') === 'a0d19821e09bcebcf8e5acfe4b5eca3681c180d4c05c2f647fff4efbae5ffac9'
  }

  get asV122(): [number, Uint8Array] {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): [number, Uint8Array] {
    deprecateLatest()
    return this.asV122
  }
}

export class TfgridModuleFarmStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmStored')
  }

  get isV122(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmStored') === '74b71e5fe3d2ea0881a33f99511ab05ec0233a16d23bc46f38fa69f638b7abe8'
  }

  get asV122(): v122.Farm {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): v122.Farm {
    deprecateLatest()
    return this.asV122
  }
}

export class TfgridModuleFarmUpdatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmUpdated')
  }

  get isV122(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmUpdated') === '74b71e5fe3d2ea0881a33f99511ab05ec0233a16d23bc46f38fa69f638b7abe8'
  }

  get asV122(): v122.Farm {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): v122.Farm {
    deprecateLatest()
    return this.asV122
  }
}

export class TfgridModuleFarmingPolicySetEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmingPolicySet')
  }

  get isV122(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmingPolicySet') === 'd64e52200384d2b2a6378823d0e0b9eba44abc0a9fc1b82114ef18b71937324c'
  }

  get asV122(): [number, (v122.FarmingPolicyLimit | undefined)] {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): [number, (v122.FarmingPolicyLimit | undefined)] {
    deprecateLatest()
    return this.asV122
  }
}

export class TfgridModuleFarmingPolicyStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmingPolicyStored')
  }

  get isV122(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmingPolicyStored') === 'e45f1ccb50e73b0f9a65c63399730f27041aa3b5c8347272bbbe01c3b66f5712'
  }

  get asV122(): v122.FarmingPolicy {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): v122.FarmingPolicy {
    deprecateLatest()
    return this.asV122
  }
}

export class TfgridModuleFarmingPolicyUpdatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.FarmingPolicyUpdated')
  }

  get isV122(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.FarmingPolicyUpdated') === 'e45f1ccb50e73b0f9a65c63399730f27041aa3b5c8347272bbbe01c3b66f5712'
  }

  get asV122(): v122.FarmingPolicy {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): v122.FarmingPolicy {
    deprecateLatest()
    return this.asV122
  }
}

export class TfgridModuleNodeCertificationSetEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.NodeCertificationSet')
  }

  get isV122(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeCertificationSet') === 'd4945d9aee3a9679b5626ad868873cd15d01a6eafb319306d7528643c7ab38d2'
  }

  get asV122(): [number, v122.NodeCertification] {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): [number, v122.NodeCertification] {
    deprecateLatest()
    return this.asV122
  }
}

export class TfgridModuleNodeDeletedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.NodeDeleted')
  }

  get isV122(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeDeleted') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
  }

  get asV122(): number {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): number {
    deprecateLatest()
    return this.asV122
  }
}

export class TfgridModuleNodePublicConfigStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.NodePublicConfigStored')
  }

  get isV122(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodePublicConfigStored') === '3280822d064c517c372255a87e0f164783d75d41adc342fe0475179b687a0ad8'
  }

  get asV122(): [number, (v122.PublicConfig | undefined)] {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): [number, (v122.PublicConfig | undefined)] {
    deprecateLatest()
    return this.asV122
  }
}

export class TfgridModuleNodeStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.NodeStored')
  }

  get isV122(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeStored') === 'f41f098c82aee52660133d1fb75d350fab4d99e9a67ba251b35e04ee4c292fb3'
  }

  get asV122(): v122.Node {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): v122.Node {
    deprecateLatest()
    return this.asV122
  }
}

export class TfgridModuleNodeUpdatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.NodeUpdated')
  }

  get isV122(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeUpdated') === 'f41f098c82aee52660133d1fb75d350fab4d99e9a67ba251b35e04ee4c292fb3'
  }

  get asV122(): v122.Node {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): v122.Node {
    deprecateLatest()
    return this.asV122
  }
}

export class TfgridModuleNodeUptimeReportedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.NodeUptimeReported')
  }

  get isV122(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.NodeUptimeReported') === '4a0c168b038c7fd8096026ff00cc3456827e0f2c507248ecfbcf2c4c07367288'
  }

  get asV122(): [number, bigint, bigint] {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): [number, bigint, bigint] {
    deprecateLatest()
    return this.asV122
  }
}

export class TfgridModulePricingPolicyStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.PricingPolicyStored')
  }

  get isV122(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.PricingPolicyStored') === '088c108804351450f3ff89c4217a7450b4d211e3f833d8ab4746d27624010cc0'
  }

  get asV122(): v122.PricingPolicy {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): v122.PricingPolicy {
    deprecateLatest()
    return this.asV122
  }
}

export class TfgridModuleTwinDeletedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.TwinDeleted')
  }

  get isV122(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.TwinDeleted') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
  }

  get asV122(): number {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): number {
    deprecateLatest()
    return this.asV122
  }
}

export class TfgridModuleTwinEntityRemovedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.TwinEntityRemoved')
  }

  get isV122(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.TwinEntityRemoved') === 'a09602e40984745a7411a1855af06d133893a422fd68f7bdc4fb6a56bf1a3645'
  }

  get asV122(): [number, number] {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): [number, number] {
    deprecateLatest()
    return this.asV122
  }
}

export class TfgridModuleTwinEntityStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.TwinEntityStored')
  }

  get isV122(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.TwinEntityStored') === 'f41c776f2baf981d5a0d5e9d89f98858c2cdd7ea515b3d32a99e45dcb2c7a185'
  }

  get asV122(): [number, number, Uint8Array] {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): [number, number, Uint8Array] {
    deprecateLatest()
    return this.asV122
  }
}

export class TfgridModuleTwinStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.TwinStored')
  }

  get isV122(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.TwinStored') === '5b6f435dfe1514ae00c046d4634f4246d82542de8da2b6937732aec521f3408a'
  }

  get asV122(): v122.Twin {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): v122.Twin {
    deprecateLatest()
    return this.asV122
  }
}

export class TfgridModuleTwinUpdatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tfgridModule.TwinUpdated')
  }

  get isV122(): boolean {
    return this.ctx._chain.getEventHash('tfgridModule.TwinUpdated') === '5b6f435dfe1514ae00c046d4634f4246d82542de8da2b6937732aec521f3408a'
  }

  get asV122(): v122.Twin {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): v122.Twin {
    deprecateLatest()
    return this.asV122
  }
}

export class TftBridgeModuleBurnTransactionProcessedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tftBridgeModule.BurnTransactionProcessed')
  }

  get isV122(): boolean {
    return this.ctx._chain.getEventHash('tftBridgeModule.BurnTransactionProcessed') === '554a047c1ffa468c18106c4c9c346a7b03d75e25de542329ef60cf60d44206c9'
  }

  get asV122(): v122.BurnTransaction {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): v122.BurnTransaction {
    deprecateLatest()
    return this.asV122
  }
}

export class TftBridgeModuleMintCompletedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tftBridgeModule.MintCompleted')
  }

  get isV122(): boolean {
    return this.ctx._chain.getEventHash('tftBridgeModule.MintCompleted') === '7484d8a69c745c46e51d9cf158387d67ab42730f0da3184b219d6240b1b537d7'
  }

  get asV122(): v122.MintTransaction {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): v122.MintTransaction {
    deprecateLatest()
    return this.asV122
  }
}

export class TftBridgeModuleRefundTransactionProcessedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'tftBridgeModule.RefundTransactionProcessed')
  }

  get isV122(): boolean {
    return this.ctx._chain.getEventHash('tftBridgeModule.RefundTransactionProcessed') === 'b8b1f1dc54430185acf4dfda7337f6b320da504654d541cc5260613d3ec89062'
  }

  get asV122(): v122.RefundTransaction {
    assert(this.isV122)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV122
  }

  get asLatest(): v122.RefundTransaction {
    deprecateLatest()
    return this.asV122
  }
}
