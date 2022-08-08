import type {Result} from './support'

export interface Contract {
  version: number
  state: ContractState
  contractId: bigint
  twinId: number
  contractType: ContractData
  solutionProviderId: (bigint | undefined)
}

export interface SolutionProvider {
  solutionProviderId: bigint
  providers: Provider[]
  description: Uint8Array
  link: Uint8Array
  approved: boolean
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

export interface Provider {
  who: AccountId32
  take: number
}

export type Cause = Cause_CanceledByUser | Cause_OutOfFunds

export interface Cause_CanceledByUser {
  __kind: 'CanceledByUser'
}

export interface Cause_OutOfFunds {
  __kind: 'OutOfFunds'
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

export type AccountId32 = Uint8Array

export interface PublicIP {
  ip: Uint8Array
  gateway: Uint8Array
  contractId: bigint
}
