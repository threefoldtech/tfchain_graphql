import { EventHandlerContext } from '@subsquid/substrate-processor'
import { NodePower, NodeConsumableResources, NodeCertification, Node, PowerState, Resources, Location, PublicConfig, Interfaces } from "../../model";
import * as v120 from '../../types/v120'

export async function createNodeV120(ctx: EventHandlerContext, node: v120.Node) {
  const newNode = new Node()

  newNode.id = ctx.event.id
  newNode.gridVersion = node.version
  newNode.farmID = node.farmId
  newNode.nodeID = node.id
  newNode.twinID = node.twinId

  newNode.created = Number(node.created)
  newNode.farmingPolicyId = node.farmingPolicyId
  newNode.certification = NodeCertification.Diy

  const newLocation = new Location()
  newLocation.id = ctx.event.id
  newLocation.latitude = node.location.latitude.toString()
  newLocation.longitude = node.location.longitude.toString()
  await ctx.store.save<Location>(newLocation)

  newNode.location = newLocation
  
  newNode.country = node.location.country.toString()
  newNode.city = node.location.city.toString()
  newNode.secure = node.secureBoot ? true : false
  newNode.virtualized = node.virtualized ? true : false
  newNode.serialNumber = node.serialNumber ? node.serialNumber.toString() : 'Unknown'
  newNode.connectionPrice = node.connectionPrice

  await ctx.store.save<Node>(newNode)

  if (node.publicConfig) {
    const newPubConfig = new PublicConfig()
    newPubConfig.id = ctx.event.id
    newPubConfig.ipv4 = node.publicConfig.ip4.ip.toString()
    newPubConfig.gw4 = node.publicConfig?.ip4.gw.toString()
    newPubConfig.ipv6 = node.publicConfig?.ip6?.ip.toString()
    newPubConfig.gw6 = node.publicConfig?.ip6?.gw.toString()
    newPubConfig.node = newNode

    await ctx.store.save<PublicConfig>(newPubConfig)
  }

  // Construct the node power object
  const power = new NodePower()
  power.id = ctx.event.id
  power.node = newNode
  power.state = PowerState.Up
  power.target = PowerState.Up
  power.lastUptime = BigInt(ctx.event.blockTimestamp)
  await ctx.store.save<NodePower>(power)

  const nodeConsumableResources = new NodeConsumableResources()
  nodeConsumableResources.id = ctx.event.id
  nodeConsumableResources.node = newNode

  // Resources are emitted in another event (NodeConsumableResourcesChanged)
  const totalResources = new Resources()
  totalResources.sru = BigInt(0)
  totalResources.hru = BigInt(0)
  totalResources.mru = BigInt(0)
  totalResources.cru = BigInt(0)

  const usedResources = new Resources()
  usedResources.sru = BigInt(0)
  usedResources.hru = BigInt(0)
  usedResources.mru = BigInt(0)
  usedResources.cru = BigInt(0)

  nodeConsumableResources.total = totalResources
  nodeConsumableResources.used = usedResources

  await ctx.store.save<NodeConsumableResources>(nodeConsumableResources)

  const interfacesPromisses = node.interfaces.map(async intf => {
    const newInterface = new Interfaces()
    newInterface.id = ctx.event.id
    newInterface.node = newNode
    newInterface.name = intf.name.toString()
    newInterface.mac = intf.mac.toString()
    newInterface.ips = intf.ips.map(ip => ip.toString()).join(',')
    await ctx.store.save<Interfaces>(newInterface)
    newNode.interfaces.push(newInterface)
  })

  await Promise.all(interfacesPromisses)

  await ctx.store.save<Node>(newNode)
}

export async function updateNodeV120(ctx: EventHandlerContext, node: v120.Node) {
  let savedNode = await ctx.store.get(Node, { where: { nodeID: node.id } })
  if (!savedNode) return

  savedNode.gridVersion = node.version
  savedNode.farmID = node.farmId
  savedNode.nodeID = node.id
  savedNode.twinID = node.twinId
  savedNode.updatedAt = BigInt(ctx.event.blockTimestamp)
  savedNode.farmingPolicyId = node.farmingPolicyId

  if (savedNode.location) {
    savedNode.location.latitude = node.location.latitude.toString()
    savedNode.location.longitude = node.location.longitude.toString()
    await ctx.store.save<Location>(savedNode.location)
  }

  savedNode.country = node.location.country.toString()
  savedNode.city = node.location.city.toString()
  savedNode.secure = node.secureBoot ? true : false
  savedNode.virtualized = node.virtualized ? true : false
  savedNode.serialNumber = node.serialNumber ? node.serialNumber.toString() : 'Unknown'

  if (node.certification) {
    const certificationTypeAsString = node.certification.__kind.toString()
    let certType = NodeCertification.Diy
    switch (certificationTypeAsString) {
      case 'Diy':
        certType = NodeCertification.Diy
        break
      case 'Certified':
        certType = NodeCertification.Certified
        break
    }
    savedNode.certification = certType
  } else {
    savedNode.certification = NodeCertification.Diy
  }

  const interfacesPromisses = node.interfaces.map(async intf => {
    let newInterface

    if (savedNode?.interfaces) {
      // if an interface with same name exists
      const found = savedNode.interfaces.findIndex(interf => interf.name === intf.name.toString())
      if (found > 0) {
        newInterface = savedNode.interfaces[found]
      } else {
        newInterface = new Interfaces()
        newInterface.id = ctx.event.id
        newInterface.node = savedNode
      }
    }

    if (!newInterface) return

    newInterface.name = intf.name.toString()
    newInterface.mac = intf.mac.toString()
    newInterface.ips = intf.ips.map(ip => ip.toString()).join(',')

    await ctx.store.save<Interfaces>(newInterface)
    savedNode?.interfaces.push(newInterface)
  })
  await Promise.all(interfacesPromisses)

  await ctx.store.save<Node>(savedNode)
}