import type {Result, Option} from './support'

export interface ContractBill {
    contractId: bigint
    timestamp: bigint
    discountLevel: DiscountLevel
    amountBilled: bigint
}

export interface Contract {
    version: number
    state: ContractState
    contractId: bigint
    twinId: number
    contractType: ContractData
    solutionProviderId: (bigint | undefined)
}

export interface NruConsumption {
    contractId: bigint
    timestamp: bigint
    window: bigint
    nru: bigint
}

export interface ServiceContract {
    serviceContractId: bigint
    serviceTwinId: number
    consumerTwinId: number
    baseFee: bigint
    variableFee: bigint
    metadata: Uint8Array
    acceptedByService: boolean
    acceptedByConsumer: boolean
    lastBill: bigint
    state: ServiceContractState
}

export interface ServiceContractBill {
    variableAmount: bigint
    window: bigint
    metadata: Uint8Array
}

export type Cause = Cause_CanceledByUser | Cause_OutOfFunds

export interface Cause_CanceledByUser {
    __kind: 'CanceledByUser'
}

export interface Cause_OutOfFunds {
    __kind: 'OutOfFunds'
}

export interface SolutionProvider {
    solutionProviderId: bigint
    providers: Provider[]
    description: Uint8Array
    link: Uint8Array
    approved: boolean
}

export interface ContractResources {
    contractId: bigint
    used: Resources
}

export interface Entity {
    version: number
    id: number
    name: Uint8Array
    accountId: Uint8Array
    country: Uint8Array
    city: Uint8Array
}

export type FarmCertification = FarmCertification_NotCertified | FarmCertification_Gold

export interface FarmCertification_NotCertified {
    __kind: 'NotCertified'
}

export interface FarmCertification_Gold {
    __kind: 'Gold'
}

export interface Farm {
    version: number
    id: number
    name: Uint8Array
    twinId: number
    pricingPolicyId: number
    certification: FarmCertification
    publicIps: PublicIP[]
    dedicatedFarm: boolean
    farmingPolicyLimits: (FarmingPolicyLimit | undefined)
}

export interface FarmingPolicyLimit {
    farmingPolicyId: number
    cu: (bigint | undefined)
    su: (bigint | undefined)
    end: (bigint | undefined)
    nodeCount: (number | undefined)
    nodeCertification: boolean
}

export interface FarmingPolicy {
    version: number
    id: number
    name: Uint8Array
    cu: number
    su: number
    nu: number
    ipv4: number
    minimalUptime: number
    policyCreated: number
    policyEnd: number
    immutable: boolean
    default: boolean
    nodeCertification: NodeCertification
    farmCertification: FarmCertification
}

export type NodeCertification = NodeCertification_Diy | NodeCertification_Certified

export interface NodeCertification_Diy {
    __kind: 'Diy'
}

export interface NodeCertification_Certified {
    __kind: 'Certified'
}

export interface PublicConfig {
    ip4: IP4
    ip6: (IP6 | undefined)
    domain: (Uint8Array | undefined)
}

export interface Node {
    version: number
    id: number
    farmId: number
    twinId: number
    resources: Resources
    location: Location
    publicConfig: (PublicConfig | undefined)
    created: bigint
    farmingPolicyId: number
    interfaces: Interface[]
    certification: NodeCertification
    secureBoot: boolean
    virtualized: boolean
    serialNumber: (Uint8Array | undefined)
    connectionPrice: number
}

export interface PricingPolicy {
    version: number
    id: number
    name: Uint8Array
    su: Policy
    cu: Policy
    nu: Policy
    ipu: Policy
    uniqueName: Policy
    domainName: Policy
    foundationAccount: Uint8Array
    certifiedSalesAccount: Uint8Array
    discountForDedicationNodes: number
}

export interface Twin {
    id: number
    accountId: Uint8Array
    relay: (Uint8Array | undefined)
    entities: EntityProof[]
    pk: (Uint8Array | undefined)
}

export type DiscountLevel = DiscountLevel_None | DiscountLevel_Default | DiscountLevel_Bronze | DiscountLevel_Silver | DiscountLevel_Gold

export interface DiscountLevel_None {
    __kind: 'None'
}

export interface DiscountLevel_Default {
    __kind: 'Default'
}

export interface DiscountLevel_Bronze {
    __kind: 'Bronze'
}

export interface DiscountLevel_Silver {
    __kind: 'Silver'
}

export interface DiscountLevel_Gold {
    __kind: 'Gold'
}

export type ContractState = ContractState_Created | ContractState_Deleted | ContractState_GracePeriod

export interface ContractState_Created {
    __kind: 'Created'
}

export interface ContractState_Deleted {
    __kind: 'Deleted'
    value: Cause
}

export interface ContractState_GracePeriod {
    __kind: 'GracePeriod'
    value: bigint
}

export type ContractData = ContractData_NodeContract | ContractData_NameContract | ContractData_RentContract

export interface ContractData_NodeContract {
    __kind: 'NodeContract'
    value: NodeContract
}

export interface ContractData_NameContract {
    __kind: 'NameContract'
    value: NameContract
}

export interface ContractData_RentContract {
    __kind: 'RentContract'
    value: RentContract
}

export type ServiceContractState = ServiceContractState_Created | ServiceContractState_AgreementReady | ServiceContractState_ApprovedByBoth

export interface ServiceContractState_Created {
    __kind: 'Created'
}

export interface ServiceContractState_AgreementReady {
    __kind: 'AgreementReady'
}

export interface ServiceContractState_ApprovedByBoth {
    __kind: 'ApprovedByBoth'
}

export interface Provider {
    who: Uint8Array
    take: number
}

export interface Resources {
    hru: bigint
    sru: bigint
    cru: bigint
    mru: bigint
}

export interface PublicIP {
    ip: Uint8Array
    gateway: Uint8Array
    contractId: bigint
}

export interface IP4 {
    ip: Uint8Array
    gw: Uint8Array
}

export interface IP6 {
    ip: Uint8Array
    gw: Uint8Array
}

export interface Location {
    city: Uint8Array
    country: Uint8Array
    latitude: Uint8Array
    longitude: Uint8Array
}

export interface Interface {
    name: Uint8Array
    mac: Uint8Array
    ips: Uint8Array[]
}

export interface Policy {
    value: number
    unit: Unit
}

export interface EntityProof {
    entityId: number
    signature: Uint8Array
}

export interface NodeContract {
    nodeId: number
    deploymentHash: Uint8Array
    deploymentData: Uint8Array
    publicIps: number
    publicIpsList: PublicIP[]
}

export interface NameContract {
    name: Uint8Array
}

export interface RentContract {
    nodeId: number
}

export type Unit = Unit_Bytes | Unit_Kilobytes | Unit_Megabytes | Unit_Gigabytes | Unit_Terrabytes

export interface Unit_Bytes {
    __kind: 'Bytes'
}

export interface Unit_Kilobytes {
    __kind: 'Kilobytes'
}

export interface Unit_Megabytes {
    __kind: 'Megabytes'
}

export interface Unit_Gigabytes {
    __kind: 'Gigabytes'
}

export interface Unit_Terrabytes {
    __kind: 'Terrabytes'
}
