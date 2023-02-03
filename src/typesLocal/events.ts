import assert from 'assert'
import {Chain, ChainContext, EventContext, Event, Result, Option} from './support'
import * as v125 from './v125'

export class BalancesTransferEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Balances.Transfer')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Transfer succeeded.
     */
    get isV125(): boolean {
        return this._chain.getEventHash('Balances.Transfer') === '0ffdf35c495114c2d42a8bf6c241483fd5334ca0198662e14480ad040f1e3a66'
    }

    /**
     * Transfer succeeded.
     */
    get asV125(): {from: Uint8Array, to: Uint8Array, amount: bigint} {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleContractBilledEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.ContractBilled')
        this._chain = ctx._chain
        this.event = event
    }

    get isV125(): boolean {
        return this._chain.getEventHash('SmartContractModule.ContractBilled') === '80f35d404149c70acbd173262c31ae49812dbb6c9f279954678dd758bb5aa239'
    }

    get asV125(): v125.ContractBill {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleContractCreatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.ContractCreated')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A contract got created
     */
    get isV125(): boolean {
        return this._chain.getEventHash('SmartContractModule.ContractCreated') === 'bc600595215d0331e91aaeff45059fe6383f3362d537b936e491fe1154d3a842'
    }

    /**
     * A contract got created
     */
    get asV125(): v125.Contract {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleContractGracePeriodEndedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.ContractGracePeriodEnded')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A Contract grace period was ended
     */
    get isV125(): boolean {
        return this._chain.getEventHash('SmartContractModule.ContractGracePeriodEnded') === '2a451998845cc7fbb5269823cda637a7f9805f49123c343665bb37cbbf9cfbe4'
    }

    /**
     * A Contract grace period was ended
     */
    get asV125(): {contractId: bigint, nodeId: number, twinId: number} {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleContractGracePeriodStartedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.ContractGracePeriodStarted')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A Contract grace period is triggered
     */
    get isV125(): boolean {
        return this._chain.getEventHash('SmartContractModule.ContractGracePeriodStarted') === '5c4b7518ed686396094c34c59a2f5d1cd0da102a76c852ec194b5c72a0faf79e'
    }

    /**
     * A Contract grace period is triggered
     */
    get asV125(): {contractId: bigint, nodeId: number, twinId: number, blockNumber: bigint} {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleContractUpdatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.ContractUpdated')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A contract was updated
     */
    get isV125(): boolean {
        return this._chain.getEventHash('SmartContractModule.ContractUpdated') === 'bc600595215d0331e91aaeff45059fe6383f3362d537b936e491fe1154d3a842'
    }

    /**
     * A contract was updated
     */
    get asV125(): v125.Contract {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleNameContractCanceledEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.NameContractCanceled')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A Name contract is canceled
     */
    get isV125(): boolean {
        return this._chain.getEventHash('SmartContractModule.NameContractCanceled') === '28d75d7f6a405072b1337c49414e7c89805fbab702800c1a4b653076bd2dc4db'
    }

    /**
     * A Name contract is canceled
     */
    get asV125(): {contractId: bigint} {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleNodeContractCanceledEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.NodeContractCanceled')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A Node contract is canceled
     */
    get isV125(): boolean {
        return this._chain.getEventHash('SmartContractModule.NodeContractCanceled') === '2a451998845cc7fbb5269823cda637a7f9805f49123c343665bb37cbbf9cfbe4'
    }

    /**
     * A Node contract is canceled
     */
    get asV125(): {contractId: bigint, nodeId: number, twinId: number} {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleNruConsumptionReportReceivedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.NruConsumptionReportReceived')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Network resources report received for contract
     */
    get isV125(): boolean {
        return this._chain.getEventHash('SmartContractModule.NruConsumptionReportReceived') === '8fb8781273a0957437746af773ed15577fcddcf30727d6027f1651e65345eaf8'
    }

    /**
     * Network resources report received for contract
     */
    get asV125(): v125.NruConsumption {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleRentContractCanceledEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.RentContractCanceled')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * a Rent contract is canceled
     */
    get isV125(): boolean {
        return this._chain.getEventHash('SmartContractModule.RentContractCanceled') === '28d75d7f6a405072b1337c49414e7c89805fbab702800c1a4b653076bd2dc4db'
    }

    /**
     * a Rent contract is canceled
     */
    get asV125(): {contractId: bigint} {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleServiceContractApprovedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.ServiceContractApproved')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A Service contract is approved
     */
    get isV125(): boolean {
        return this._chain.getEventHash('SmartContractModule.ServiceContractApproved') === '31b80feead37363efd85ab0f302bd2d559a9275d61d4642185d79b006d0ddc52'
    }

    /**
     * A Service contract is approved
     */
    get asV125(): v125.ServiceContract {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleServiceContractBilledEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.ServiceContractBilled')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A Service contract is billed
     */
    get isV125(): boolean {
        return this._chain.getEventHash('SmartContractModule.ServiceContractBilled') === '7985d39a3e56b65ab2853980404ab7250260ef1f2f7395adf3092259fb9ddbc5'
    }

    /**
     * A Service contract is billed
     */
    get asV125(): {serviceContract: v125.ServiceContract, bill: v125.ServiceContractBill, amount: bigint} {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleServiceContractCanceledEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.ServiceContractCanceled')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A Service contract is canceled
     */
    get isV125(): boolean {
        return this._chain.getEventHash('SmartContractModule.ServiceContractCanceled') === '5d9c761d54a2a85566da8e150a364cc6f59f363b1139be81f9993b7d62a74bb0'
    }

    /**
     * A Service contract is canceled
     */
    get asV125(): {serviceContractId: bigint, cause: v125.Cause} {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleServiceContractCreatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.ServiceContractCreated')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A Service contract is created
     */
    get isV125(): boolean {
        return this._chain.getEventHash('SmartContractModule.ServiceContractCreated') === '31b80feead37363efd85ab0f302bd2d559a9275d61d4642185d79b006d0ddc52'
    }

    /**
     * A Service contract is created
     */
    get asV125(): v125.ServiceContract {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleServiceContractFeesSetEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.ServiceContractFeesSet')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A Service contract fees are set
     */
    get isV125(): boolean {
        return this._chain.getEventHash('SmartContractModule.ServiceContractFeesSet') === '31b80feead37363efd85ab0f302bd2d559a9275d61d4642185d79b006d0ddc52'
    }

    /**
     * A Service contract fees are set
     */
    get asV125(): v125.ServiceContract {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleServiceContractMetadataSetEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.ServiceContractMetadataSet')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A Service contract metadata is set
     */
    get isV125(): boolean {
        return this._chain.getEventHash('SmartContractModule.ServiceContractMetadataSet') === '31b80feead37363efd85ab0f302bd2d559a9275d61d4642185d79b006d0ddc52'
    }

    /**
     * A Service contract metadata is set
     */
    get asV125(): v125.ServiceContract {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleSolutionProviderApprovedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.SolutionProviderApproved')
        this._chain = ctx._chain
        this.event = event
    }

    get isV125(): boolean {
        return this._chain.getEventHash('SmartContractModule.SolutionProviderApproved') === '840ac8d292e1374dbb168d73165f148f05f011c240521661b812cf877cec0614'
    }

    get asV125(): [bigint, boolean] {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleSolutionProviderCreatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.SolutionProviderCreated')
        this._chain = ctx._chain
        this.event = event
    }

    get isV125(): boolean {
        return this._chain.getEventHash('SmartContractModule.SolutionProviderCreated') === 'd32a4b80af4fcacbe96dc685f8a21488024fe716bdb4ea57ff9ddee85e29bc26'
    }

    get asV125(): v125.SolutionProvider {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleUpdatedUsedResourcesEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.UpdatedUsedResources')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Contract resources got updated
     */
    get isV125(): boolean {
        return this._chain.getEventHash('SmartContractModule.UpdatedUsedResources') === 'a2596f7d808ddd9ac668241df18cffb93329f10e334b13b87782cc828372795a'
    }

    /**
     * Contract resources got updated
     */
    get asV125(): v125.ContractResources {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleConnectionPriceSetEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.ConnectionPriceSet')
        this._chain = ctx._chain
        this.event = event
    }

    get isV125(): boolean {
        return this._chain.getEventHash('TfgridModule.ConnectionPriceSet') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
    }

    get asV125(): number {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleEntityDeletedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.EntityDeleted')
        this._chain = ctx._chain
        this.event = event
    }

    get isV125(): boolean {
        return this._chain.getEventHash('TfgridModule.EntityDeleted') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
    }

    get asV125(): number {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleEntityStoredEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.EntityStored')
        this._chain = ctx._chain
        this.event = event
    }

    get isV125(): boolean {
        return this._chain.getEventHash('TfgridModule.EntityStored') === '9d6387c93300e77d2fc96af3ccb27b7eddb14f3768bdf0cf045995fc0be93d47'
    }

    get asV125(): v125.Entity {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleEntityUpdatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.EntityUpdated')
        this._chain = ctx._chain
        this.event = event
    }

    get isV125(): boolean {
        return this._chain.getEventHash('TfgridModule.EntityUpdated') === '9d6387c93300e77d2fc96af3ccb27b7eddb14f3768bdf0cf045995fc0be93d47'
    }

    get asV125(): v125.Entity {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleFarmCertificationSetEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.FarmCertificationSet')
        this._chain = ctx._chain
        this.event = event
    }

    get isV125(): boolean {
        return this._chain.getEventHash('TfgridModule.FarmCertificationSet') === 'ffe62c890927616bc9d5af190bd4a3b2c69e29097ebc6ea5ee6a2e1e87ceb759'
    }

    get asV125(): [number, v125.FarmCertification] {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleFarmDeletedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.FarmDeleted')
        this._chain = ctx._chain
        this.event = event
    }

    get isV125(): boolean {
        return this._chain.getEventHash('TfgridModule.FarmDeleted') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
    }

    get asV125(): number {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleFarmPayoutV2AddressRegisteredEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.FarmPayoutV2AddressRegistered')
        this._chain = ctx._chain
        this.event = event
    }

    get isV125(): boolean {
        return this._chain.getEventHash('TfgridModule.FarmPayoutV2AddressRegistered') === 'a0d19821e09bcebcf8e5acfe4b5eca3681c180d4c05c2f647fff4efbae5ffac9'
    }

    get asV125(): [number, Uint8Array] {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleFarmStoredEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.FarmStored')
        this._chain = ctx._chain
        this.event = event
    }

    get isV125(): boolean {
        return this._chain.getEventHash('TfgridModule.FarmStored') === '74b71e5fe3d2ea0881a33f99511ab05ec0233a16d23bc46f38fa69f638b7abe8'
    }

    get asV125(): v125.Farm {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleFarmUpdatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.FarmUpdated')
        this._chain = ctx._chain
        this.event = event
    }

    get isV125(): boolean {
        return this._chain.getEventHash('TfgridModule.FarmUpdated') === '74b71e5fe3d2ea0881a33f99511ab05ec0233a16d23bc46f38fa69f638b7abe8'
    }

    get asV125(): v125.Farm {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleFarmingPolicySetEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.FarmingPolicySet')
        this._chain = ctx._chain
        this.event = event
    }

    get isV125(): boolean {
        return this._chain.getEventHash('TfgridModule.FarmingPolicySet') === 'd64e52200384d2b2a6378823d0e0b9eba44abc0a9fc1b82114ef18b71937324c'
    }

    get asV125(): [number, (v125.FarmingPolicyLimit | undefined)] {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleFarmingPolicyStoredEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.FarmingPolicyStored')
        this._chain = ctx._chain
        this.event = event
    }

    get isV125(): boolean {
        return this._chain.getEventHash('TfgridModule.FarmingPolicyStored') === 'e45f1ccb50e73b0f9a65c63399730f27041aa3b5c8347272bbbe01c3b66f5712'
    }

    get asV125(): v125.FarmingPolicy {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleFarmingPolicyUpdatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.FarmingPolicyUpdated')
        this._chain = ctx._chain
        this.event = event
    }

    get isV125(): boolean {
        return this._chain.getEventHash('TfgridModule.FarmingPolicyUpdated') === 'e45f1ccb50e73b0f9a65c63399730f27041aa3b5c8347272bbbe01c3b66f5712'
    }

    get asV125(): v125.FarmingPolicy {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleNodeCertificationSetEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.NodeCertificationSet')
        this._chain = ctx._chain
        this.event = event
    }

    get isV125(): boolean {
        return this._chain.getEventHash('TfgridModule.NodeCertificationSet') === 'd4945d9aee3a9679b5626ad868873cd15d01a6eafb319306d7528643c7ab38d2'
    }

    get asV125(): [number, v125.NodeCertification] {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleNodeDeletedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.NodeDeleted')
        this._chain = ctx._chain
        this.event = event
    }

    get isV125(): boolean {
        return this._chain.getEventHash('TfgridModule.NodeDeleted') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
    }

    get asV125(): number {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleNodePublicConfigStoredEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.NodePublicConfigStored')
        this._chain = ctx._chain
        this.event = event
    }

    get isV125(): boolean {
        return this._chain.getEventHash('TfgridModule.NodePublicConfigStored') === '3280822d064c517c372255a87e0f164783d75d41adc342fe0475179b687a0ad8'
    }

    get asV125(): [number, (v125.PublicConfig | undefined)] {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleNodeStoredEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.NodeStored')
        this._chain = ctx._chain
        this.event = event
    }

    get isV125(): boolean {
        return this._chain.getEventHash('TfgridModule.NodeStored') === 'f41f098c82aee52660133d1fb75d350fab4d99e9a67ba251b35e04ee4c292fb3'
    }

    get asV125(): v125.Node {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleNodeUpdatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.NodeUpdated')
        this._chain = ctx._chain
        this.event = event
    }

    get isV125(): boolean {
        return this._chain.getEventHash('TfgridModule.NodeUpdated') === 'f41f098c82aee52660133d1fb75d350fab4d99e9a67ba251b35e04ee4c292fb3'
    }

    get asV125(): v125.Node {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleNodeUptimeReportedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.NodeUptimeReported')
        this._chain = ctx._chain
        this.event = event
    }

    get isV125(): boolean {
        return this._chain.getEventHash('TfgridModule.NodeUptimeReported') === '4a0c168b038c7fd8096026ff00cc3456827e0f2c507248ecfbcf2c4c07367288'
    }

    get asV125(): [number, bigint, bigint] {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModulePowerStateChangedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.PowerStateChanged')
        this._chain = ctx._chain
        this.event = event
    }

    get isV125(): boolean {
        return this._chain.getEventHash('TfgridModule.PowerStateChanged') === 'd5322b23c8c357b4efd50099056dcfba214b94466b72d863ffc1ee8dbd90f80c'
    }

    get asV125(): {farmId: number, nodeId: number, powerState: v125.PowerState} {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModulePowerTargetChangedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.PowerTargetChanged')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Send an event to zero os to change its state
     */
    get isV125(): boolean {
        return this._chain.getEventHash('TfgridModule.PowerTargetChanged') === 'c1d738baed628d197d192e6970ff592c9dc24c34f8aebc19303672d3d54dec89'
    }

    /**
     * Send an event to zero os to change its state
     */
    get asV125(): {farmId: number, nodeId: number, powerTarget: v125.Power} {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModulePricingPolicyStoredEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.PricingPolicyStored')
        this._chain = ctx._chain
        this.event = event
    }

    get isV125(): boolean {
        return this._chain.getEventHash('TfgridModule.PricingPolicyStored') === '088c108804351450f3ff89c4217a7450b4d211e3f833d8ab4746d27624010cc0'
    }

    get asV125(): v125.PricingPolicy {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleTwinDeletedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.TwinDeleted')
        this._chain = ctx._chain
        this.event = event
    }

    get isV125(): boolean {
        return this._chain.getEventHash('TfgridModule.TwinDeleted') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
    }

    get asV125(): number {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleTwinEntityRemovedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.TwinEntityRemoved')
        this._chain = ctx._chain
        this.event = event
    }

    get isV125(): boolean {
        return this._chain.getEventHash('TfgridModule.TwinEntityRemoved') === 'a09602e40984745a7411a1855af06d133893a422fd68f7bdc4fb6a56bf1a3645'
    }

    get asV125(): [number, number] {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleTwinEntityStoredEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.TwinEntityStored')
        this._chain = ctx._chain
        this.event = event
    }

    get isV125(): boolean {
        return this._chain.getEventHash('TfgridModule.TwinEntityStored') === 'f41c776f2baf981d5a0d5e9d89f98858c2cdd7ea515b3d32a99e45dcb2c7a185'
    }

    get asV125(): [number, number, Uint8Array] {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleTwinStoredEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.TwinStored')
        this._chain = ctx._chain
        this.event = event
    }

    get isV125(): boolean {
        return this._chain.getEventHash('TfgridModule.TwinStored') === '5b6f435dfe1514ae00c046d4634f4246d82542de8da2b6937732aec521f3408a'
    }

    get asV125(): v125.Twin {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleTwinUpdatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.TwinUpdated')
        this._chain = ctx._chain
        this.event = event
    }

    get isV125(): boolean {
        return this._chain.getEventHash('TfgridModule.TwinUpdated') === '5b6f435dfe1514ae00c046d4634f4246d82542de8da2b6937732aec521f3408a'
    }

    get asV125(): v125.Twin {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}
