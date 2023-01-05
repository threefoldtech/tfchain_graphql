import { Node, Location, PublicConfig, NodeCertification, Interfaces, UptimeEvent, NodeResourcesTotal } from "../model";
import { TfgridModuleNodeCertificationSetEvent, TfgridModuleNodeDeletedEvent, TfgridModuleNodePublicConfigStoredEvent, TfgridModuleNodeStoredEvent, TfgridModuleNodeUpdatedEvent, TfgridModuleNodeUptimeReportedEvent } from "../types/events";
import { Equal } from 'typeorm';
import { SubstrateBlock } from '@subsquid/substrate-processor';
import { In } from 'typeorm'
import { EventItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'

import { Ctx } from '../processor'

export async function nodeStored(
  ctx: Ctx,
  item: EventItem<'TfgridModule.NodeStored', { event: { args: true } }>,
  timestamp: number
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
  }

  if (!nodeEvent) return

  const newNode = new Node()
  newNode.id = item.event.id
  newNode.gridVersion = nodeEvent.version
  newNode.farmID = nodeEvent.farmId
  newNode.nodeID = nodeEvent.id
  newNode.twinID = nodeEvent.twinId

  newNode.createdAt = BigInt(timestamp)
  newNode.updatedAt = BigInt(timestamp)

  newNode.country = nodeEvent.country.toString()
  newNode.city = nodeEvent.city.toString()

  newNode.created = Number(nodeEvent.created)
  newNode.farmingPolicyId = nodeEvent.farmingPolicyId

  const newLocation = new Location()
  newLocation.id = item.event.id
  newLocation.latitude = nodeEvent.location.latitude.toString()
  newLocation.longitude = nodeEvent.location.longitude.toString()
  await ctx.store.save<Location>(newLocation)

  newNode.location = newLocation

  await ctx.store.save<Node>(newNode)

  if (node.isV28) {
    const nodeAsV28 = node.asV28
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
      newNode.certification = certType
    } else {
      newNode.certification = NodeCertification.Diy
    }
  }

  if (node.isV43) {
    const nodeAsV43 = node.asV43
    newNode.secure = nodeAsV43.secureBoot ? true : false
    newNode.virtualized = nodeAsV43.virtualized ? true : false
    newNode.serialNumber = nodeAsV43.serialNumber.toString()
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
      newNode.certification = certType
    } else {
      newNode.certification = NodeCertification.Diy
    }
  }

  if (node.isV101 || node.isV63) {
    let nodeEvent
    if (node.isV101) {
      nodeEvent = node.asV101
    } else if (node.isV63) {
      nodeEvent = node.asV63
    } else {
      return
    }
    newNode.secure = nodeEvent.secureBoot ? true : false
    newNode.virtualized = nodeEvent.virtualized ? true : false
    newNode.serialNumber = nodeEvent.serialNumber.toString()
    newNode.connectionPrice = nodeEvent.connectionPrice
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
      newNode.certification = certType
    } else {
      newNode.certification = NodeCertification.Diy
    }
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

  if (nodeEvent.publicConfig) {
    const pubConfig = new PublicConfig()
    pubConfig.node = newNode
    pubConfig.id = item.event.id
    pubConfig.ipv4 = nodeEvent.publicConfig.ipv4.toString()
    pubConfig.ipv6 = nodeEvent.publicConfig.ipv6.toString()
    pubConfig.gw4 = nodeEvent.publicConfig.gw4.toString()
    pubConfig.gw6 = nodeEvent.publicConfig.gw6.toString()
    pubConfig.domain = nodeEvent.publicConfig.domain.toString() || ''

    await ctx.store.save<PublicConfig>(pubConfig)
    newNode.publicConfig = pubConfig
  }

  newNode.interfaces = []

  const interfacesPromisses = nodeEvent.interfaces.map(async intf => {
    const newInterface = new Interfaces()
    newInterface.id = item.event.id
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

export async function nodeUpdated(
  ctx: Ctx,
  item: EventItem<'TfgridModule.NodeUpdated', { event: { args: true } }>,
  timestamp: number
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
  }

  if (!nodeEvent) return

  const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeEvent.id } , relations: { location: true }})

  if (!savedNode) return

  savedNode.gridVersion = nodeEvent.version
  savedNode.farmID = nodeEvent.farmId
  savedNode.nodeID = nodeEvent.id
  savedNode.twinID = nodeEvent.twinId
  savedNode.updatedAt = BigInt(timestamp)

  // Recalculate total / free resoures when a node get's updated
  let resourcesTotal = await ctx.store.get(NodeResourcesTotal, { where: { node: Equal(savedNode) }, relations: { node: true } })
  if (resourcesTotal) {
    resourcesTotal.sru = nodeEvent.resources.sru
    resourcesTotal.hru = nodeEvent.resources.hru
    resourcesTotal.mru = nodeEvent.resources.mru
    resourcesTotal.cru = nodeEvent.resources.cru
    await ctx.store.save<NodeResourcesTotal>(resourcesTotal)
  }

  savedNode.country = nodeEvent.country.toString()
  savedNode.city = nodeEvent.city.toString()

  if (savedNode.location) {
    savedNode.location.latitude = nodeEvent.location.latitude.toString()
    savedNode.location.longitude = nodeEvent.location.longitude.toString()
    await ctx.store.save<Location>(savedNode.location)
  }

  await ctx.store.save<Node>(savedNode)

  if (node.isV28) {
    const nodeAsV28 = node.asV28
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

  if (node.isV101 || node.isV63) {
    let nodeEvent
    if (node.isV101) {
      nodeEvent = node.asV101
    } else if (node.isV63) {
      nodeEvent = node.asV63
    } else {
      return
    }
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
        newInterface.id = item.event.id
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

export async function nodeDeleted(
  ctx: Ctx,
  item: EventItem<'TfgridModule.NodeDeleted', { event: { args: true } }>,
) {
  const nodeID = new TfgridModuleNodeDeletedEvent(ctx, item.event).asV49

  const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeID } })

  if (savedNode) {
    const resourcesTotal = await ctx.store.find(NodeResourcesTotal, { where: { node: Equal(savedNode) }, relations: { node: true } })
    if (resourcesTotal) {
      const p = resourcesTotal.map(r => ctx.store.remove(r))
      await Promise.all(p)
    }

    const pubConfig = await ctx.store.get(PublicConfig, { where: { node: Equal(savedNode) }, relations: { node: true } })
    if (pubConfig) {
      await ctx.store.remove(pubConfig)
    }

    const intfs = await ctx.store.find(Interfaces, { where: { node: Equal(savedNode) }, relations: { node: true } })
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
          id: In([...new Set(uptimes.map(up => up.event.nodeID)).keys()])
        }
      })).map(n => [n.id, n])
  )

  for (let up of uptimes) {
    let node = touchedNodes.get(up.event.nodeID.toString())
    if (node) {
      node.uptime = up.event.uptime
      node.updatedAt = BigInt(up.block.timestamp)
    }
  }
  
  await ctx.store.save(uptimes.map(up => up.event))
  await ctx.store.save([...touchedNodes.values()])
}


function collectUptimeEvents(ctx: Ctx): {block: SubstrateBlock, event: UptimeEvent}[] {
  let list: {block: SubstrateBlock, event: UptimeEvent}[] = []
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
    ipv4 = config?.ip4.ip.toString()
    ipv6 = config?.ip6?.ip.toString()
    gw4 = config?.ip4.gw.toString()
    gw6 = config?.ip6?.gw.toString()
    domain = config?.domain ? config.domain.toString() : ''
  } else {
    return
  }

  const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeID } })
  if (!savedNode) return

  let publicConfig = await ctx.store.get(PublicConfig, { where: { node: Equal(savedNode) }, relations: { node: true } })

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

export async function nodeCertificationSet(
  ctx: Ctx,
  item: EventItem<'TfgridModule.NodeCertificationSet', { event: { args: true } }>
) {
  const [nodeID, certification] = new TfgridModuleNodeCertificationSetEvent(ctx, item.event).asV63

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