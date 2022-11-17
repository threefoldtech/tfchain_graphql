import {
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { Node, Location, PublicConfig, NodeCertification, Interfaces, UptimeEvent, NodeResourcesTotal, PowerState, NodePower, NodeConsumableResources, Resources } from "../model";
import { TfgridModuleNodeCertificationSetEvent, TfgridModuleNodeDeletedEvent, TfgridModuleNodePublicConfigStoredEvent, TfgridModuleNodeStoredEvent, TfgridModuleNodeUpdatedEvent, TfgridModuleNodeUptimeReportedEvent, TfgridModulePowerStateChangedEvent, TfgridModulePowerTargetChangedEvent } from "../types/events";

export async function nodeStored(ctx: EventHandlerContext) {
  const node = new TfgridModuleNodeStoredEvent(ctx)

  console.log(ctx._chain.getEventHash('tfgridModule.NodeStored'))
  let nodeEvent
  if (node.isV9) {
    nodeEvent = node.asV9
  } else if (node.isV28) {
    nodeEvent = node.asV28
  } else if (node.isV43) {
    nodeEvent = node.asV43
  } else if (node.isV63) {
    nodeEvent = node.asV63
  } else if (node.isV101) {
    nodeEvent = node.asV101
  } else if (node.isV105) {
    nodeEvent = node.asV105
  } else if (node.isV118) {
    nodeEvent = node.asV118
  } else if (node.isV119) {
    nodeEvent = node.asV119
  }

  if (!nodeEvent) {
    return
  }

  const newNode = new Node()
  newNode.id = ctx.event.id
  newNode.gridVersion = nodeEvent.version
  newNode.farmID = nodeEvent.farmId
  newNode.nodeID = nodeEvent.id
  newNode.twinID = nodeEvent.twinId

  newNode.createdAt = BigInt(ctx.event.blockTimestamp)
  newNode.updatedAt = BigInt(ctx.event.blockTimestamp)

  if (node.isV9) {
    nodeEvent = node.asV9
    newNode.country = nodeEvent.country.toString()
    newNode.city = nodeEvent.city.toString()

    const resourcesTotal = new NodeResourcesTotal()
    resourcesTotal.node = newNode
    resourcesTotal.id = ctx.event.id
    resourcesTotal.sru = nodeEvent.resources.sru
    resourcesTotal.hru = nodeEvent.resources.hru
    resourcesTotal.mru = nodeEvent.resources.mru
    resourcesTotal.cru = nodeEvent.resources.cru

    await ctx.store.save<NodeResourcesTotal>(resourcesTotal)
  }

  if (node.isV28) {
    nodeEvent = node.asV28
    newNode.country = nodeEvent.country.toString()
    newNode.city = nodeEvent.city.toString()
    const resourcesTotal = new NodeResourcesTotal()
    resourcesTotal.node = newNode
    resourcesTotal.id = ctx.event.id
    resourcesTotal.sru = nodeEvent.resources.sru
    resourcesTotal.hru = nodeEvent.resources.hru
    resourcesTotal.mru = nodeEvent.resources.mru
    resourcesTotal.cru = nodeEvent.resources.cru

    await ctx.store.save<NodeResourcesTotal>(resourcesTotal)
  }

  newNode.created = Number(nodeEvent.created)
  newNode.farmingPolicyId = nodeEvent.farmingPolicyId
  newNode.certification = NodeCertification.Diy

  const newLocation = new Location()
  newLocation.id = ctx.event.id
  newLocation.latitude = nodeEvent.location.latitude.toString()
  newLocation.longitude = nodeEvent.location.longitude.toString()
  await ctx.store.save<Location>(newLocation)

  newNode.location = newLocation

  const pubConfig = getNodePublicConfig(node)
  const newPubConfig = new PublicConfig()
  newPubConfig.id = ctx.event.id
  newPubConfig.ipv4 = pubConfig?.ip4
  newPubConfig.gw4 = pubConfig?.gw4
  newPubConfig.ipv6 = pubConfig?.ip6
  newPubConfig.gw6 = pubConfig?.gw6
  newPubConfig.node = newNode

  if (node.isV43) {
    const nodeAsV43 = node.asV43
    newNode.country = nodeAsV43.country.toString()
    newNode.city = nodeAsV43.city.toString()
    newNode.secure = nodeAsV43.secureBoot ? true : false
    newNode.virtualized = nodeAsV43.virtualized ? true : false
    newNode.serialNumber = nodeAsV43.serialNumber.toString()

    const resourcesTotal = new NodeResourcesTotal()
    resourcesTotal.node = newNode
    resourcesTotal.id = ctx.event.id
    resourcesTotal.sru = nodeAsV43.resources.sru
    resourcesTotal.hru = nodeAsV43.resources.hru
    resourcesTotal.mru = nodeAsV43.resources.mru
    resourcesTotal.cru = nodeAsV43.resources.cru

    await ctx.store.save<NodeResourcesTotal>(resourcesTotal)
  }

  if (node.isV105 || node.isV101 || node.isV63) {
    let nodeEvent
    if (node.isV101) {
      nodeEvent = node.asV101
    } else if (node.isV63) {
      nodeEvent = node.asV63
    } else if (node.isV105) {
      nodeEvent = node.asV105
    } else {
      return
    }
    newNode.country = nodeEvent.country.toString()
    newNode.city = nodeEvent.city.toString()
    newNode.secure = nodeEvent.secureBoot ? true : false
    newNode.virtualized = nodeEvent.virtualized ? true : false
    newNode.serialNumber = nodeEvent.serialNumber.toString()
    newNode.connectionPrice = nodeEvent.connectionPrice

    const resourcesTotal = new NodeResourcesTotal()
    resourcesTotal.node = newNode
    resourcesTotal.id = ctx.event.id
    resourcesTotal.sru = nodeEvent.resources.sru
    resourcesTotal.hru = nodeEvent.resources.hru
    resourcesTotal.mru = nodeEvent.resources.mru
    resourcesTotal.cru = nodeEvent.resources.cru

    await ctx.store.save<NodeResourcesTotal>(resourcesTotal)
  }

  if (node.isV118) {
    let nodeEvent = node.asV118
    newNode.country = nodeEvent.location.country.toString()
    newNode.city = nodeEvent.location.city.toString()
    newNode.secure = nodeEvent.secureBoot ? true : false
    newNode.virtualized = nodeEvent.virtualized ? true : false
    newNode.serialNumber = nodeEvent.serialNumber ? nodeEvent.serialNumber.toString() : 'Unknown'
    newNode.connectionPrice = nodeEvent.connectionPrice

    const resourcesTotal = new NodeResourcesTotal()
    resourcesTotal.node = newNode
    resourcesTotal.id = ctx.event.id
    resourcesTotal.sru = nodeEvent.resources.sru
    resourcesTotal.hru = nodeEvent.resources.hru
    resourcesTotal.mru = nodeEvent.resources.mru
    resourcesTotal.cru = nodeEvent.resources.cru

    await ctx.store.save<NodeResourcesTotal>(resourcesTotal)
  }

  if (node.isV119) {
    let nodeEvent = node.asV119
    newNode.country = nodeEvent.location.country.toString()
    newNode.city = nodeEvent.location.city.toString()
    newNode.secure = nodeEvent.secureBoot ? true : false
    newNode.virtualized = nodeEvent.virtualized ? true : false
    newNode.serialNumber = nodeEvent.serialNumber ? nodeEvent.serialNumber.toString() : 'Unknown'
    newNode.connectionPrice = nodeEvent.connectionPrice

    await ctx.store.save<Node>(newNode)

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

    const totalResources = new Resources()
    totalResources.sru = nodeEvent.resources.totalResources.sru
    totalResources.hru = nodeEvent.resources.totalResources.hru
    totalResources.mru = nodeEvent.resources.totalResources.mru
    totalResources.cru = nodeEvent.resources.totalResources.cru

    const usedResources = new Resources()
    usedResources.sru = nodeEvent.resources.usedResources.sru
    usedResources.hru = nodeEvent.resources.usedResources.hru
    usedResources.mru = nodeEvent.resources.usedResources.mru
    usedResources.cru = nodeEvent.resources.usedResources.cru

    nodeConsumableResources.total = totalResources
    nodeConsumableResources.used = usedResources

    await ctx.store.save<NodeConsumableResources>(nodeConsumableResources)
  }

  await ctx.store.save<Node>(newNode)

  newNode.interfaces = []

  const interfacesPromisses = nodeEvent.interfaces.map(async intf => {
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

export async function nodeUpdated(ctx: EventHandlerContext) {
  const node = new TfgridModuleNodeUpdatedEvent(ctx)

  let nodeEvent
  if (node.isV9) {
    nodeEvent = node.asV9
  } else if (node.isV28) {
    nodeEvent = node.asV28
  } else if (node.isV43) {
    nodeEvent = node.asV43
  } else if (node.isV63) {
    nodeEvent = node.asV63
  } else if (node.isV101) {
    nodeEvent = node.asV101
  } else if (node.isV105) {
    nodeEvent = node.asV105
  } else if (node.isV118) {
    nodeEvent = node.asV118
  } else if (node.isV119) {
    nodeEvent = node.asV119
  }

  if (!nodeEvent) return

  const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeEvent.id } })
  if (!savedNode) return

  savedNode.gridVersion = nodeEvent.version
  savedNode.farmID = nodeEvent.farmId
  savedNode.nodeID = nodeEvent.id
  savedNode.twinID = nodeEvent.twinId
  savedNode.updatedAt = BigInt(ctx.event.blockTimestamp)
  savedNode.farmingPolicyId = nodeEvent.farmingPolicyId

  if (node.isV9) {
    nodeEvent = node.asV9
    savedNode.country = nodeEvent.country.toString()
    savedNode.city = nodeEvent.city.toString()

    // Recalculate total / free resoures when a node get's updated
    let resourcesTotal = await ctx.store.get(NodeResourcesTotal, { where: { node: savedNode } })
    if (resourcesTotal) {
      resourcesTotal.sru = nodeEvent.resources.sru
      resourcesTotal.hru = nodeEvent.resources.hru
      resourcesTotal.mru = nodeEvent.resources.mru
      resourcesTotal.cru = nodeEvent.resources.cru
      await ctx.store.save<NodeResourcesTotal>(resourcesTotal)
    }
  }

  if (node.isV118) {
    nodeEvent = node.asV118
    savedNode.country = nodeEvent.location.country.toString()
    savedNode.city = nodeEvent.location.city.toString()

    // Recalculate total / free resoures when a node get's updated
    let resourcesTotal = await ctx.store.get(NodeResourcesTotal, { where: { node: savedNode } })
    if (resourcesTotal) {
      resourcesTotal.sru = nodeEvent.resources.sru
      resourcesTotal.hru = nodeEvent.resources.hru
      resourcesTotal.mru = nodeEvent.resources.mru
      resourcesTotal.cru = nodeEvent.resources.cru
      await ctx.store.save<NodeResourcesTotal>(resourcesTotal)
    }
  }

  if (savedNode.location) {
    savedNode.location.latitude = nodeEvent.location.latitude.toString()
    savedNode.location.longitude = nodeEvent.location.longitude.toString()
    await ctx.store.save<Location>(savedNode.location)
  }

  await ctx.store.save<Node>(savedNode)

  if (node.isV28) {
    const nodeEvent = node.asV28
    savedNode.country = nodeEvent.country.toString()
    savedNode.city = nodeEvent.city.toString()

    if (nodeEvent.certificationType) {
      const certificationTypeAsString = nodeEvent.certificationType.__kind.toString()
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

    // Recalculate total / free resoures when a node get's updated
    let resourcesTotal = await ctx.store.get(NodeResourcesTotal, { where: { node: savedNode } })
    if (resourcesTotal) {
      resourcesTotal.sru = nodeEvent.resources.sru
      resourcesTotal.hru = nodeEvent.resources.hru
      resourcesTotal.mru = nodeEvent.resources.mru
      resourcesTotal.cru = nodeEvent.resources.cru
      await ctx.store.save<NodeResourcesTotal>(resourcesTotal)
    }
  }

  if (node.isV43) {
    const nodeEvent = node.asV43
    savedNode.country = nodeEvent.country.toString()
    savedNode.city = nodeEvent.city.toString()
    savedNode.secure = nodeEvent.secureBoot ? true : false
    savedNode.virtualized = nodeEvent.virtualized ? true : false
    savedNode.serialNumber = nodeEvent.serialNumber.toString()
    if (nodeEvent.certificationType) {
      const certificationTypeAsString = nodeEvent.certificationType.__kind.toString()
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

    // Recalculate total / free resoures when a node get's updated
    let resourcesTotal = await ctx.store.get(NodeResourcesTotal, { where: { node: savedNode } })
    if (resourcesTotal) {
      resourcesTotal.sru = nodeEvent.resources.sru
      resourcesTotal.hru = nodeEvent.resources.hru
      resourcesTotal.mru = nodeEvent.resources.mru
      resourcesTotal.cru = nodeEvent.resources.cru
      await ctx.store.save<NodeResourcesTotal>(resourcesTotal)
    }
  }

  if (node.isV105 || node.isV101 || node.isV63) {
    let nodeEvent
    if (node.isV101) {
      nodeEvent = node.asV101
    } else if (node.isV63) {
      nodeEvent = node.asV63
    } else if (node.isV105) {
      nodeEvent = node.asV105
    } else {
      return
    }
    savedNode.country = nodeEvent.country.toString()
    savedNode.city = nodeEvent.city.toString()
    savedNode.secure = nodeEvent.secureBoot ? true : false
    savedNode.virtualized = nodeEvent.virtualized ? true : false
    savedNode.serialNumber = nodeEvent.serialNumber.toString()
    if (nodeEvent.certification) {
      const certificationTypeAsString = nodeEvent.certification.__kind.toString()
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
    // Recalculate total / free resoures when a node get's updated
    let resourcesTotal = await ctx.store.get(NodeResourcesTotal, { where: { node: savedNode } })
    if (resourcesTotal) {
      resourcesTotal.sru = nodeEvent.resources.sru
      resourcesTotal.hru = nodeEvent.resources.hru
      resourcesTotal.mru = nodeEvent.resources.mru
      resourcesTotal.cru = nodeEvent.resources.cru
      await ctx.store.save<NodeResourcesTotal>(resourcesTotal)
    }
  }

  if (node.isV118) {
    const nodeEvent = node.asV118

    savedNode.country = nodeEvent.location.country.toString()
    savedNode.city = nodeEvent.location.city.toString()
    savedNode.secure = nodeEvent.secureBoot ? true : false
    savedNode.virtualized = nodeEvent.virtualized ? true : false
    savedNode.serialNumber = nodeEvent.serialNumber ? nodeEvent.serialNumber.toString() : 'Unknown'
    if (nodeEvent.certification) {
      const certificationTypeAsString = nodeEvent.certification.__kind.toString()
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

    // Recalculate total / free resoures when a node get's updated
    let resourcesTotal = await ctx.store.get(NodeResourcesTotal, { where: { node: savedNode } })
    if (resourcesTotal) {
      resourcesTotal.sru = nodeEvent.resources.sru
      resourcesTotal.hru = nodeEvent.resources.hru
      resourcesTotal.mru = nodeEvent.resources.mru
      resourcesTotal.cru = nodeEvent.resources.cru
      await ctx.store.save<NodeResourcesTotal>(resourcesTotal)
    }
  }

  if (node.isV119) {
    const nodeEvent = node.asV119

    savedNode.country = nodeEvent.location.country.toString()
    savedNode.city = nodeEvent.location.city.toString()
    savedNode.secure = nodeEvent.secureBoot ? true : false
    savedNode.virtualized = nodeEvent.virtualized ? true : false
    savedNode.serialNumber = nodeEvent.serialNumber ? nodeEvent.serialNumber.toString() : 'Unknown'
    if (nodeEvent.certification) {
      const certificationTypeAsString = nodeEvent.certification.__kind.toString()
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

    // Recalculate total / free resoures when a node get's updated
    let nodeConsumableResources = await ctx.store.get(NodeConsumableResources, { where: { node: savedNode } })
    if (nodeConsumableResources) {
      nodeConsumableResources.total.sru = nodeEvent.resources.totalResources.sru
      nodeConsumableResources.total.hru = nodeEvent.resources.totalResources.hru
      nodeConsumableResources.total.mru = nodeEvent.resources.totalResources.mru
      nodeConsumableResources.total.cru = nodeEvent.resources.totalResources.cru

      nodeConsumableResources.used.sru = nodeEvent.resources.usedResources.sru
      nodeConsumableResources.used.hru = nodeEvent.resources.usedResources.hru
      nodeConsumableResources.used.mru = nodeEvent.resources.usedResources.mru
      nodeConsumableResources.used.cru = nodeEvent.resources.usedResources.cru

      await ctx.store.save<NodeConsumableResources>(nodeConsumableResources)
    }
  }

  await ctx.store.save<Node>(savedNode)

  // savedNode.interfaces = []

  const interfacesPromisses = nodeEvent.interfaces.map(async intf => {
    let newInterface

    if (savedNode.interfaces) {
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
    savedNode.interfaces.push(newInterface)
  })
  await Promise.all(interfacesPromisses)
  await ctx.store.save<Node>(savedNode)
}

export async function nodeDeleted(ctx: EventHandlerContext) {
  const nodeID = new TfgridModuleNodeDeletedEvent(ctx).asV9

  const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeID } })

  if (savedNode) {
    const resourcesTotal = await ctx.store.get(NodeResourcesTotal, { where: { node: savedNode } })
    if (resourcesTotal) {
      await ctx.store.remove(resourcesTotal)
    }
    const pubConfig = await ctx.store.get(PublicConfig, { where: { node: savedNode } })
    if (pubConfig) {
      await ctx.store.remove(pubConfig)
    }

    const intfs = await ctx.store.find(Interfaces, { where: { node: savedNode } })
    const promises = intfs.map(intf => {
      return ctx.store.remove(intf)
    })
    await Promise.all(promises)

    await ctx.store.remove(savedNode)
  }
}

export async function nodeUptimeReported(ctx: EventHandlerContext) {
  const [nodeID, now, uptime] = new TfgridModuleNodeUptimeReportedEvent(ctx).asV9

  const newUptimeEvent = new UptimeEvent()
  newUptimeEvent.id = ctx.event.id
  newUptimeEvent.nodeID = nodeID
  newUptimeEvent.timestamp = now
  newUptimeEvent.uptime = uptime
  await ctx.store.save<UptimeEvent>(newUptimeEvent)

  const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeID } })

  if (savedNode) {
    savedNode.uptime = uptime
    savedNode.updatedAt = BigInt(ctx.event.blockTimestamp)
    await ctx.store.save<Node>(savedNode)
  }
}

export async function nodePublicConfigStored(ctx: EventHandlerContext) {
  const storedEvent = new TfgridModuleNodePublicConfigStoredEvent(ctx)

  let nodeID, config
  if (storedEvent.isV12) {
    nodeID = storedEvent.asV12[0]
    config = storedEvent.asV12[1]

    const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeID } })
    if (!savedNode) return

    let publicConfig = await ctx.store.get(PublicConfig, { where: { node: savedNode } })

    if (!publicConfig) {
      publicConfig = new PublicConfig()
      publicConfig.id = ctx.event.id
      publicConfig.node = savedNode
    }

    publicConfig.ipv4 = config.ipv4.toString()
    publicConfig.ipv6 = config.ipv6.toString()
    publicConfig.gw4 = config.gw4.toString()
    publicConfig.gw6 = config.gw6.toString()
    publicConfig.domain = config.domain.toString() || ''

    await ctx.store.save<PublicConfig>(publicConfig)

  } else if (storedEvent.isV105) {
    nodeID = storedEvent.asV105[0]
    let pubconfig = storedEvent.asV105[1]

    const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeID } })
    if (!savedNode) return

    let savedPubConfig = await ctx.store.get(PublicConfig, { where: { node: savedNode } })

    if (!savedPubConfig) {
      savedPubConfig = new PublicConfig()
      savedPubConfig.id = ctx.event.id
      savedPubConfig.node = savedNode
    }

    if (!pubconfig) {
      await ctx.store.remove<PublicConfig>(savedPubConfig)
    } else {
      savedPubConfig.ipv4 = pubconfig?.ip4.ip.toString()
      savedPubConfig.ipv6 = pubconfig?.ip6?.ip.toString()
      savedPubConfig.gw4 = pubconfig?.ip4.gw.toString()
      savedPubConfig.gw6 = pubconfig?.ip6?.gw.toString()
      savedPubConfig.domain = pubconfig?.domain ? pubconfig.domain.toString() : ''

      await ctx.store.save<PublicConfig>(savedPubConfig)
    }
  }
}

export async function nodeCertificationSet(ctx: EventHandlerContext) {
  const [nodeID, certification] = new TfgridModuleNodeCertificationSetEvent(ctx).asV63

  const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeID } })
  if (!savedNode) return

  let certType = NodeCertification.Diy
  switch (certification.__kind.toString()) {
    case 'Diy':
      certType = NodeCertification.Diy
      break
    case 'Certified':
      certType = NodeCertification.Certified
      break
  }

  savedNode.certification = certType

  await ctx.store.save<Node>(savedNode)
}

export async function powerTargetChanged(ctx: EventHandlerContext) {
  const { nodeId, powerTarget } = new TfgridModulePowerTargetChangedEvent(ctx).asV119

  const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeId } })
  if (!savedNode) return

  const nodePower = await ctx.store.get(NodePower, { where: { node: savedNode } })
  if (!nodePower) return

  switch (powerTarget.__kind) {
    case 'Up': nodePower.target = PowerState.Up
    case 'Down': nodePower.target = PowerState.Down
  }

  await ctx.store.save<NodePower>(nodePower)
}

export async function powerStateChanged(ctx: EventHandlerContext) {
  const { nodeId, powerState } = new TfgridModulePowerStateChangedEvent(ctx).asV119

  const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeId } })
  if (!savedNode) return

  const nodePower = await ctx.store.get(NodePower, { where: { node: savedNode } })
  if (!nodePower) return

  switch (powerState.__kind) {
    case 'Up': nodePower.state = PowerState.Up
    case 'Down': nodePower.state = PowerState.Down
  }

  await ctx.store.save<NodePower>(nodePower)
}



interface NodePublicConfig {
  ip4: string
  gw4: string
  ip6: string
  gw6: string
  domain: string
}

function getNodePublicConfig(node: TfgridModuleNodeStoredEvent): NodePublicConfig | null | undefined {
  let nodeEvent
  if (node.isV9) {
    nodeEvent = node.asV9
    if (nodeEvent.publicConfig) {
      return {
        ip4: nodeEvent.publicConfig?.ipv4.toString(),
        gw4: nodeEvent.publicConfig?.gw4.toString(),
        ip6: nodeEvent.publicConfig?.ipv6.toString(),
        gw6: nodeEvent.publicConfig?.gw6.toString(),
        domain: nodeEvent.publicConfig?.domain.toString()
      }
    }
  } else if (node.isV28) {
    nodeEvent = node.asV28
    if (nodeEvent.publicConfig) {
      return {
        ip4: nodeEvent.publicConfig?.ipv4.toString(),
        gw4: nodeEvent.publicConfig?.gw4.toString(),
        ip6: nodeEvent.publicConfig?.ipv6.toString(),
        gw6: nodeEvent.publicConfig?.gw6.toString(),
        domain: nodeEvent.publicConfig?.domain.toString()
      }
    }
  } else if (node.isV43) {
    nodeEvent = node.asV43
    if (nodeEvent.publicConfig) {
      return {
        ip4: nodeEvent.publicConfig?.ipv4.toString(),
        gw4: nodeEvent.publicConfig?.gw4.toString(),
        ip6: nodeEvent.publicConfig?.ipv6.toString(),
        gw6: nodeEvent.publicConfig?.gw6.toString(),
        domain: nodeEvent.publicConfig?.domain.toString()
      }
    }
  } else if (node.isV63) {
    nodeEvent = node.asV63
    if (nodeEvent.publicConfig) {
      return {
        ip4: nodeEvent.publicConfig?.ipv4.toString(),
        gw4: nodeEvent.publicConfig?.gw4.toString(),
        ip6: nodeEvent.publicConfig?.ipv6.toString(),
        gw6: nodeEvent.publicConfig?.gw6.toString(),
        domain: nodeEvent.publicConfig?.domain.toString()
      }
    }
  } else if (node.isV101) {
    nodeEvent = node.asV101
    if (nodeEvent.publicConfig) {
      return {
        ip4: nodeEvent.publicConfig?.ipv4.toString(),
        gw4: nodeEvent.publicConfig?.gw4.toString(),
        ip6: nodeEvent.publicConfig?.ipv6.toString(),
        gw6: nodeEvent.publicConfig?.gw6.toString(),
        domain: nodeEvent.publicConfig?.domain.toString()
      }
    }
  } else if (node.isV105) {
    nodeEvent = node.asV105
    if (nodeEvent.publicConfig) {
      let domain = ''
      if (nodeEvent.publicConfig.domain) {
        domain = nodeEvent.publicConfig.domain.toString()
      }
      return {
        ip4: nodeEvent.publicConfig?.ip4.ip.toString(),
        gw4: nodeEvent.publicConfig?.ip4.gw.toString(),
        ip6: nodeEvent.publicConfig?.ip6?.ip.toString() || '',
        gw6: nodeEvent.publicConfig?.ip6?.gw.toString() || '',
        domain
      }
    }
  } else {
    return null
  }

  return null
}

