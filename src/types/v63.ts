import type {Result} from './support'

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
}

export interface NruConsumption {
  contractId: bigint
  timestamp: bigint
  window: bigint
  nru: bigint
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
  ipv4: Uint8Array
  ipv6: Uint8Array
  gw4: Uint8Array
  gw6: Uint8Array
  domain: Uint8Array
}

export interface Node {
  version: number
  id: number
  farmId: number
  twinId: number
  resources: Resources
  location: Location
  country: Uint8Array
  city: Uint8Array
  publicConfig: (PublicConfig | undefined)
  created: bigint
  farmingPolicyId: number
  interfaces: Interface[]
  certification: NodeCertification
  secureBoot: boolean
  virtualized: boolean
  serialNumber: Uint8Array
  dedicated: boolean
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
  discountForDedicatedNodes: number
}

export interface Twin {
  id: number
  ip: Uint8Array
  version: number
  entities: EntityProof[]
  accountId: Uint8Array
}

export interface BurnTransaction {
  block: number
  amount: bigint
  target: Uint8Array
  signatures: StellarSignature[]
  sequenceNumber: bigint
}

export interface MintTransaction {
  amount: bigint
  target: Uint8Array
  block: number
  votes: number
}

export interface RefundTransaction {
  block: number
  amount: bigint
  target: Uint8Array
  txHash: Uint8Array
  signatures: StellarSignature[]
  sequenceNumber: bigint
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

export type ContractState = ContractState_Created | ContractState_Deleted | ContractState_OutOfFunds | ContractState_GracePeriod

export interface ContractState_Created {
  __kind: 'Created'
}

export interface ContractState_Deleted {
  __kind: 'Deleted'
}

export interface ContractState_OutOfFunds {
  __kind: 'OutOfFunds'
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

export interface Location {
  longitude: Uint8Array
  latitude: Uint8Array
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

export interface StellarSignature {
  signature: Uint8Array
  stellarPubkey: Uint8Array
}

export interface NodeContract {
  nodeId: number
  deploymentData: Uint8Array
  deploymentHash: Uint8Array
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
