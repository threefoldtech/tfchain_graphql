import { Node, Location, PublicConfig, NodeCertification, Interfaces, UptimeEvent, NodeResourcesTotal, NodePower, PowerState, Power } from "../model";
import { 
  TfgridModuleNodeCertificationSetEvent, TfgridModuleNodeDeletedEvent, 
  TfgridModuleNodePublicConfigStoredEvent, TfgridModuleNodeStoredEvent, 
  TfgridModuleNodeUpdatedEvent, TfgridModuleNodeUptimeReportedEvent, 
  TfgridModulePowerStateChangedEvent, TfgridModulePowerTargetChangedEvent,
  TfgridModuleNodeGpuStatusChangedEvent, SmartContractModuleNodeExtraFeeSetEvent
} from "../types/events";
import { SubstrateBlock } from '@subsquid/substrate-processor';
import { In } from 'typeorm'
import { EventItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'
import { PublicConfig as V105PublicConfig } from '../types/v105'

import { Ctx } from '../processor'
import assert from "assert";
import { allowedNodeEnvironmentFlags } from "process";

export async function nodeStored(
  ctx: Ctx,
  item: EventItem<'TfgridModule.NodeStored', { event: { args: true } }>,
  timestamp: bigint
) {
  const node = new TfgridModuleNodeStoredEvent(ctx, item.event)

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
  }

  if (!nodeEvent) {
    return
  }

  const newNode = new Node()
  newNode.id = item.event.id
  newNode.gridVersion = nodeEvent.version
  newNode.farmID = nodeEvent.farmId
  newNode.nodeID = nodeEvent.id
  newNode.twinID = nodeEvent.twinId

  newNode.createdAt = timestamp
  newNode.updatedAt = timestamp

  if (node.isV9) {
    nodeEvent = node.asV9
    newNode.country = nodeEvent.country.toString()
    newNode.city = nodeEvent.city.toString()
  }
  if (node.isV28) {
    nodeEvent = node.asV28
    newNode.country = nodeEvent.country.toString()
    newNode.city = nodeEvent.city.toString()
  }

  newNode.created = Number(nodeEvent.created)
  newNode.farmingPolicyId = nodeEvent.farmingPolicyId
  newNode.certification = NodeCertification.Diy

  const newLocation = new Location()
  newLocation.id = item.event.id
  newLocation.latitude = nodeEvent.location.latitude.toString()
  newLocation.longitude = nodeEvent.location.longitude.toString()
  await ctx.store.save<Location>(newLocation)

  newNode.location = newLocation

  await ctx.store.save<Node>(newNode)

  const pubConfig = getNodePublicConfig(node)
  const newPubConfig = new PublicConfig()
  newPubConfig.id = item.event.id
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
  }

  if (node.isV118) {
    let nodeEvent = node.asV118
    newNode.country = nodeEvent.location.country.toString()
    newNode.city = nodeEvent.location.city.toString()
    newNode.secure = nodeEvent.secureBoot ? true : false
    newNode.virtualized = nodeEvent.virtualized ? true : false
    newNode.serialNumber = nodeEvent.serialNumber ? nodeEvent.serialNumber.toString() : 'Unknown'
    newNode.connectionPrice = nodeEvent.connectionPrice
  }

  await ctx.store.save<Node>(newNode)

  const resourcesTotal = new NodeResourcesTotal()
  resourcesTotal.node = newNode
  resourcesTotal.id = item.event.id
  resourcesTotal.sru = nodeEvent.resources.sru
  resourcesTotal.hru = nodeEvent.resources.hru
  resourcesTotal.mru = nodeEvent.resources.mru
  resourcesTotal.cru = nodeEvent.resources.cru
  await ctx.store.save<NodeResourcesTotal>(resourcesTotal)

  newNode.interfaces = []

  const interfacesPromisses = nodeEvent.interfaces.map(async intf => {
    const newInterface = new Interfaces()
    newInterface.id = item.event.id
    newInterface.node = newNode
    newInterface.name = intf.name.toString()
    newInterface.mac = intf.mac.toString()
    newInterface.ips = intf.ips.map(ip => ip.toString()).join(',')
    await ctx.store.save<Interfaces>(newInterface)
  })

  await Promise.all(interfacesPromisses)
}

export async function nodeUpdated(
  ctx: Ctx,
  item: EventItem<'TfgridModule.NodeUpdated', { event: { args: true } }>,
  timestamp: bigint
) {
  const node = new TfgridModuleNodeUpdatedEvent(ctx, item.event)

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
  }

  if (!nodeEvent) return

  const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeEvent.id }, relations: { location: true, interfaces: true } })

  if (!savedNode) return

  savedNode.gridVersion = nodeEvent.version
  savedNode.farmID = nodeEvent.farmId
  savedNode.nodeID = nodeEvent.id
  savedNode.twinID = nodeEvent.twinId
  savedNode.updatedAt = timestamp
  savedNode.farmingPolicyId = nodeEvent.farmingPolicyId

  // Recalculate total / free resoures when a node get's updated
  let resourcesTotal = await ctx.store.get(NodeResourcesTotal, { where: { node: { nodeID: savedNode.nodeID } }, relations: { node: true } })
  if (resourcesTotal) {
    resourcesTotal.sru = nodeEvent.resources.sru
    resourcesTotal.hru = nodeEvent.resources.hru
    resourcesTotal.mru = nodeEvent.resources.mru
    resourcesTotal.cru = nodeEvent.resources.cru
    await ctx.store.save<NodeResourcesTotal>(resourcesTotal)
  }

  if (node.isV9) {
    nodeEvent = node.asV9
    savedNode.country = nodeEvent.country.toString()
    savedNode.city = nodeEvent.city.toString()
  }

  if (node.isV118) {
    nodeEvent = node.asV118
    savedNode.country = nodeEvent.location.country.toString()
    savedNode.city = nodeEvent.location.city.toString()
  }

  if (savedNode.location) {
    const location = await ctx.store.get(Location, { where: { id: savedNode.location.id } })
    if (location) {
      location.latitude = nodeEvent.location.latitude.toString()
      location.longitude = nodeEvent.location.longitude.toString()
      await ctx.store.save<Location>(location)
      savedNode.location = location
    }
  }

  if (node.isV28) {
    const nodeAsV28 = node.asV28
    savedNode.country = nodeAsV28.country.toString()
    savedNode.city = nodeAsV28.city.toString()

    if (nodeAsV28.certificationType) {
      const certificationTypeAsString = nodeAsV28.certificationType.__kind.toString()
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
  }

  if (node.isV43) {
    const nodeAsV43 = node.asV43
    savedNode.country = nodeAsV43.country.toString()
    savedNode.city = nodeAsV43.city.toString()
    savedNode.secure = nodeAsV43.secureBoot ? true : false
    savedNode.virtualized = nodeAsV43.virtualized ? true : false
    savedNode.serialNumber = nodeAsV43.serialNumber.toString()
    if (nodeAsV43.certificationType) {
      const certificationTypeAsString = nodeAsV43.certificationType.__kind.toString()
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
  }

  // First remove all ifs
  const nodeIfs = await ctx.store.find(Interfaces, { where: { node: { nodeID: savedNode.nodeID } } })
  await ctx.store.remove(nodeIfs)

  // Save ones from update event
  await Promise.all(nodeEvent.interfaces.map(async intf => {
    const newInterface = new Interfaces()
    newInterface.id = item.event.id + intf.name.toString()
    newInterface.name = intf.name.toString()
    newInterface.mac = intf.mac.toString()
    newInterface.ips = intf.ips.map(ip => ip.toString()).join(',')
    newInterface.node = savedNode
    await ctx.store.save<Interfaces>(newInterface)

    savedNode.interfaces.push(newInterface)
  }))

  await ctx.store.save<Node>(savedNode)
}

export async function nodeDeleted(
  ctx: Ctx,
  item: EventItem<'TfgridModule.NodeDeleted', { event: { args: true } }>,
) {
  const nodeID = new TfgridModuleNodeDeletedEvent(ctx, item.event).asV49

  const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeID }, relations: { location: true, interfaces: true } })

  if (savedNode) {
    const resourcesTotal = await ctx.store.find(NodeResourcesTotal, { where: { node: { nodeID: savedNode.nodeID } }, relations: { node: true } })
    if (resourcesTotal) {
      const p = resourcesTotal.map(r => ctx.store.remove(r))
      await Promise.all(p)
    }

    const pubConfig = await ctx.store.get(PublicConfig, { where: { node: { nodeID: savedNode.nodeID } }, relations: { node: true } })
    if (pubConfig) {
      await ctx.store.remove(pubConfig)
    }

    const intfs = await ctx.store.find(Interfaces, { where: { node: { nodeID: savedNode.nodeID } }, relations: { node: true } })
    const promises = intfs.map(intf => {
      return ctx.store.remove(intf)
    })
    await Promise.all(promises)

    await ctx.store.remove(savedNode)
  }
}

export async function nodeUptimeReported(ctx: Ctx): Promise<void> {
  let uptimes = collectUptimeEvents(ctx)

  let touchedNodes = new Map(
    (await ctx.store.find(Node, {
      where: {
        nodeID: In([...new Set(uptimes.map(up => up.event.nodeID)).keys()])
      }, relations: { location: true, interfaces: true }
    })).map(n => [n.nodeID, n])
  )

  for (let up of uptimes) {
    let node = touchedNodes.get(up.event.nodeID)
    if (node) {
      node.uptime = up.event.uptime
      node.updatedAt = BigInt(up.block.timestamp) / BigInt(1000)
    }
  }

  await ctx.store.save(uptimes.map(up => up.event))
  await ctx.store.save([...touchedNodes.values()])
}


function collectUptimeEvents(ctx: Ctx): { block: SubstrateBlock, event: UptimeEvent }[] {
  let list: { block: SubstrateBlock, event: UptimeEvent }[] = []
  for (let block of ctx.blocks) {
    for (let item of block.items) {
      if (item.name === "TfgridModule.NodeUptimeReported") {
        const [nodeID, now, uptime] = new TfgridModuleNodeUptimeReportedEvent(ctx, item.event).asV49
        const event = new UptimeEvent()
        event.id = item.event.id
        event.nodeID = nodeID
        event.timestamp = now
        event.uptime = uptime
        list.push({
          block: block.header,
          event
        })
      }
    }
  }
  return list
}

export async function nodePublicConfigStored(
  ctx: Ctx,
  item: EventItem<'TfgridModule.NodePublicConfigStored', { event: { args: true } }>
) {
  const storedEvent = new TfgridModuleNodePublicConfigStoredEvent(ctx, item.event)

  let nodeID, config
  let ipv4, ipv6, gw4, gw6, domain

  if (storedEvent.isV49) {
    [nodeID, config] = storedEvent.asV49
    ipv4 = config.ipv4.toString()
    ipv6 = config.ipv6.toString()
    gw4 = config.gw4.toString()
    gw6 = config.gw6.toString()
    domain = config.domain.toString()
  } else if (storedEvent.isV105) {
    [nodeID, config] = storedEvent.asV105
    return await handlePublicConfigV105(ctx, item.event.id, nodeID, config)
  } else {
    return
  }

  const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeID }, relations: { location: true, interfaces: true } })
  if (!savedNode) return

  let publicConfig = await ctx.store.get(PublicConfig, { where: { node: { nodeID: savedNode.nodeID } }, relations: { node: true } })

  if (!publicConfig) {
    publicConfig = new PublicConfig()
    publicConfig.id = item.event.id
    publicConfig.node = savedNode
  }

  publicConfig.ipv4 = ipv4
  publicConfig.ipv6 = ipv6
  publicConfig.gw4 = gw4
  publicConfig.gw6 = gw6
  publicConfig.domain = domain || ''

  await ctx.store.save<PublicConfig>(publicConfig)
}

async function handlePublicConfigV105(ctx: Ctx, eventID: string, nodeID: number, config: V105PublicConfig | undefined) {
  if (!config) {
    const pubConfig = await ctx.store.get(PublicConfig, { where: { node: { nodeID } }, relations: { node: true } })
    if (pubConfig) {
      return await ctx.store.remove(pubConfig)
    }
  }

  const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeID }, relations: { location: true, interfaces: true } })
  if (!savedNode) return

  let publicConfig = await ctx.store.get(PublicConfig, { where: { node: { nodeID } }, relations: { node: true } })

  if (!publicConfig) {
    publicConfig = new PublicConfig()
    publicConfig.id = eventID
    publicConfig.node = savedNode
  }

  publicConfig.ipv4 = config?.ip4.ip ? config?.ip4.ip.toString() : null
  publicConfig.gw4 = config?.ip4.gw ? config?.ip4.gw.toString() : null
  publicConfig.ipv6 = config?.ip6?.ip ? config?.ip6?.ip.toString() : null
  publicConfig.gw6 = config?.ip6?.gw ? config?.ip6?.gw.toString() : null
  publicConfig.domain = config?.domain ? config.domain.toString() : null

  await ctx.store.save<PublicConfig>(publicConfig)
}

export async function nodeCertificationSet(
  ctx: Ctx,
  item: EventItem<'TfgridModule.NodeCertificationSet', { event: { args: true } }>
) {
  const [nodeID, certification] = new TfgridModuleNodeCertificationSetEvent(ctx, item.event).asV63

  const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeID }, relations: { location: true, interfaces: true } })
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

export async function powerTargetChanged(
  ctx: Ctx,
  item: EventItem<'TfgridModule.PowerTargetChanged', { event: { args: true } }>
) {
  const { farmId, nodeId, powerTarget } = new TfgridModulePowerTargetChangedEvent(ctx, item.event).asV125

  let target = Power.Up
  switch (powerTarget.__kind) {
    case 'Up':
      target = Power.Up
      break
    case 'Down':
      target = Power.Down
      break
  }

  const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeId }, relations: { location: true, interfaces: true } })
  if (!savedNode) return

  assert(savedNode.farmID === farmId)
  assert(savedNode.nodeID === nodeId)

  if (!savedNode.power) {
    savedNode.power = new NodePower()
    savedNode.power.state = PowerState.Up
  }
  savedNode.power.target = target
  await ctx.store.save<Node>(savedNode)
}

export async function powerStateChanged(
  ctx: Ctx,
  item: EventItem<'TfgridModule.PowerStateChanged', { event: { args: true } }>
) {
  const { farmId, nodeId, powerState } = new TfgridModulePowerStateChangedEvent(ctx, item.event).asV125

  let state = PowerState.Up
  switch (powerState.__kind) {
    case 'Up':
      state = PowerState.Up
      break
    case 'Down':
      state = PowerState.Down
      break
  }

  const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeId }, relations: { location: true, interfaces: true } })
  if (!savedNode) return

  if (!savedNode.power) {
    savedNode.power = new NodePower()
    savedNode.power.target = Power.Up
  }
  savedNode.power.state = state
  await ctx.store.save<Node>(savedNode)
}

export async function nodeGpuStatusChanged(
  ctx: Ctx,
  item: EventItem<'TfgridModule.NodeGpuStatusChanged', { event: { args: true } }>
) {
  const { nodeId, gpuStatus } = new TfgridModuleNodeGpuStatusChangedEvent(ctx, item.event).asV134

  const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeId }, relations: { location: true, interfaces: true } })
  if (!savedNode) return

  savedNode.hasGpu = gpuStatus
  await ctx.store.save<Node>(savedNode)
}

export async function nodeExtraFeeSet(
  ctx: Ctx,
  item: EventItem<'SmartContractModule.NodeExtraFeeSet', { event: { args: true } }>
) {
  const { nodeId, extraFee } = new SmartContractModuleNodeExtraFeeSetEvent(ctx, item.event).asV134

  const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeId }, relations: { location: true, interfaces: true } })
  if (!savedNode) return

  savedNode.extraFee = extraFee
  // Also mark the node as dedicated if the fee is not 0
  savedNode.dedicated = extraFee > 0

  await ctx.store.save<Node>(savedNode)
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