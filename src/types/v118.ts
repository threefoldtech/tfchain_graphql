import type { Result } from './support'

export type NodeCertification = NodeCertification_Diy | NodeCertification_Certified

export interface NodeCertification_Diy {
  __kind: 'Diy'
}

export interface NodeCertification_Certified {
  __kind: 'Certified'
}

export interface PublicConfig {
  ip4: IP
  ip6: (IP | undefined)
  domain: (Domain | undefined)
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
  serialNumber: (SerialNumber | undefined)
  connectionPrice: number
}

export interface Interface {
  name: InterfaceName
  mac: InterfaceMac
  ips: InterfaceIp[]
}

export interface Resources {
  hru: bigint
  sru: bigint
  cru: bigint
  mru: bigint
}

export type FarmName = Uint8Array

export interface PublicIP {
  ip: Uint8Array
  gateway: GatewayIP
  contractId: bigint
}

export interface IP {
  ip: IP4
  gw: GW4
}

export type Domain = Uint8Array

export type CountryName = Uint8Array

export type CityName = Uint8Array

export type GatewayIP = Uint8Array

export type IP4 = Uint8Array

export type GW4 = Uint8Array

export type SerialNumber = Uint8Array

export type InterfaceName = Uint8Array

export type InterfaceMac = Uint8Array

export type InterfaceIp = Uint8Array

export interface Location {
  city: CityName
  country: CountryName
  latitude: Uint8Array
  longitude: Uint8Array
}

