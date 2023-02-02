export interface Contract {
  version: number
  state: ContractState
  contractId: bigint
  twinId: number
  contractType: ContractData
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

export interface PublicIP {
  ip: Uint8Array
  gateway: Uint8Array
  contractId: bigint
}
