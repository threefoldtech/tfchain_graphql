import { Node, Location, PublicConfig, NodeCertification, Interfaces, UptimeEvent, NodeResourcesTotal } from "../model";
import { TfgridModuleNodeCertificationSetEvent, TfgridModuleNodeDeletedEvent, TfgridModuleNodePublicConfigStoredEvent, TfgridModuleNodeStoredEvent, TfgridModuleNodeUpdatedEvent, TfgridModuleNodeUptimeReportedEvent } from "../types/events";
import { Equal } from 'typeorm';
import {
  EventHandlerContext,
} from "../types/context";
import { SubstrateBlock } from '@subsquid/substrate-processor';
import { In } from 'typeorm'

import { Ctx } from '../processor'

export async function nodeCreateUpdateOrDelete(ctx: Ctx) {
  for (let block of ctx.blocks) {
    for (let item of block.items) {
      if (item.name === "TfgridModule.NodeStored") {
        const nodeStoredEvent = new TfgridModuleNodeStoredEvent(ctx, item.event)
        await nodeStored(ctx, nodeStoredEvent, item.event.id, block.header.timestamp)
      }
      if (item.name === "TfgridModule.NodeUpdated") {
        const nodeUpdatedEvent = new TfgridModuleNodeUpdatedEvent(ctx, item.event)
        await nodeUpdated(ctx, nodeUpdatedEvent, item.event.id, block.header.timestamp)
      }
      if (item.name === "TfgridModule.NodeDeleted") {
        const nodeDeletedEvent = new TfgridModuleNodeDeletedEvent(ctx, item.event)
        await nodeDeleted(ctx, nodeDeletedEvent)
      }
    }
  }
}

export async function nodeStored(ctx: Ctx, node: TfgridModuleNodeStoredEvent, id: string, timestamp: number) {
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
  newNode.id = id
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
  newLocation.id = id
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
  resourcesTotal.id = id
  resourcesTotal.sru = nodeEvent.resources.sru
  resourcesTotal.hru = nodeEvent.resources.hru
  resourcesTotal.mru = nodeEvent.resources.mru
  resourcesTotal.cru = nodeEvent.resources.cru

  await ctx.store.save<NodeResourcesTotal>(resourcesTotal)

  if (nodeEvent.publicConfig) {
    const pubConfig = new PublicConfig()
    pubConfig.node = newNode
    pubConfig.id = id
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
    newInterface.id = id
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

export async function nodeUpdated(ctx: Ctx, node: TfgridModuleNodeUpdatedEvent, id: string, timestamp: number) {
  // const node = new TfgridModuleNodeUpdatedEvent(ctx)

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
        newInterface.id = id
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

export async function nodeDeleted(ctx: Ctx, node: TfgridModuleNodeDeletedEvent) {
  // const nodeID = new TfgridModuleNodeDeletedEvent(ctx).asV49
  const nodeID = node.asV49

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

// export async function nodeUptimeReported(ctx: Ctx): Promise<[UptimeEvent[], Promise<any>[]]> {
//   let uptimeEvents: UptimeEvent[] = []
//   let nodeUpdatePromises: Promise<any>[] = []

//   for (let block of ctx.blocks) {
//     for (let item of block.items) {
//       if (item.name === "TfgridModule.NodeUptimeReported") {
//         const [nodeID, now, uptime] = new TfgridModuleNodeUptimeReportedEvent(ctx, item.event).asV49
      
//         const newUptimeEvent = new UptimeEvent()
//         newUptimeEvent.id = item.event.id
//         newUptimeEvent.nodeID = nodeID
//         newUptimeEvent.timestamp = now
//         newUptimeEvent.uptime = uptime

//         // await ctx.store.save<UptimeEvent>(newUptimeEvent)
//         uptimeEvents.push(newUptimeEvent)

//         let nodeUpdatePromise = new Promise(() => {
//           ctx.store.get(Node, { where: { nodeID } })
//             .then(savedNode => {
//               if (savedNode) {
//                 savedNode.uptime = uptime
//                 savedNode.updatedAt = BigInt(block.header.timestamp)
//                 return ctx.store.save<Node>(savedNode)
//               }
//             })
//           })
//         nodeUpdatePromises.push(nodeUpdatePromise)
//       }
//     }
//   }
//   return [uptimeEvents, nodeUpdatePromises]
// }

export async function nodePublicConfigStored(ctx: EventHandlerContext) {
  const storedEvent = new TfgridModuleNodePublicConfigStoredEvent(ctx)

  let nodeID, config
  if (storedEvent.isV49) {
    nodeID = storedEvent.asV49[0]
    config = storedEvent.asV49[1]

    const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeID } })
    if (!savedNode) return

    let publicConfig = await ctx.store.get(PublicConfig, { where: { node: Equal(savedNode) }, relations: { node: true } })

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
    config = storedEvent.asV105[1]

    const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeID } })
    if (!savedNode) return

    let publicConfig = await ctx.store.get(PublicConfig, { where: { node: Equal(savedNode) }, relations: { node: true } })

    if (!publicConfig) {
      publicConfig = new PublicConfig()
      publicConfig.id = ctx.event.id
      publicConfig.node = savedNode
    }

    publicConfig.ipv4 = config?.ip4.ip.toString()
    publicConfig.ipv6 = config?.ip6?.ip.toString()
    publicConfig.gw4 = config?.ip4.gw.toString()
    publicConfig.gw6 = config?.ip6?.gw.toString()
    publicConfig.domain = config?.domain ? config.domain.toString() : ''

    await ctx.store.save<PublicConfig>(publicConfig)
  }
}

// export async function nodeMarkedAsDedicated(ctx: EventHandlerContext) {
//   const [nodeID, dedicated] = new SmartContractModuleNodeMarkedAsDedicatedEvent(ctx).asV63

//   const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeID } })
//   if (!savedNode) return

//   savedNode.dedicated = dedicated
//   await ctx.store.save<Node>(savedNode)
// }

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