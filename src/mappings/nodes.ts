import {
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { Node, Location, PublicConfig, NodeCertification, Interfaces, UptimeEvent, NodeResourcesTotal } from "../model";
import { TfgridModuleNodeCertificationSetEvent, TfgridModuleNodeDeletedEvent, TfgridModuleNodeMarkedAsDedicatedEvent, TfgridModuleNodePublicConfigStoredEvent, TfgridModuleNodeStoredEvent, TfgridModuleNodeUpdatedEvent, TfgridModuleNodeUptimeReportedEvent } from "../types/events";

export async function nodeStored(ctx: EventHandlerContext) {
  const node  = new TfgridModuleNodeStoredEvent(ctx)
  let nodeEvent
  if (node.isV9) {
    nodeEvent = node.asV9
  } else if (node.isV28) {
    nodeEvent = node.asV28
  } else if (node.isV43) {
    nodeEvent = node.asV43
  } else if (node.isV63) {
    nodeEvent = node.asV63
  }
  
  if (!nodeEvent) return
  
  const newNode = new Node()
  newNode.id = ctx.event.id
  newNode.gridVersion = nodeEvent.version
  newNode.farmID = nodeEvent.farmId
  newNode.nodeID = nodeEvent.id
  newNode.twinID = nodeEvent.twinId

  newNode.createdAt = BigInt(ctx.event.blockTimestamp)
  newNode.updatedAt = BigInt(ctx.event.blockTimestamp)

  newNode.country = nodeEvent.country.toString()
  newNode.city = nodeEvent.city.toString()

  newNode.created = Number(nodeEvent.created)
  newNode.farmingPolicyId = nodeEvent.farmingPolicyId

  const newLocation = new Location()
  newLocation.id = ctx.event.id
  newLocation.latitude = nodeEvent.location.latitude.toString()
  newLocation.longitude = nodeEvent.location.longitude.toString()
  await ctx.store.save<Location>(newLocation)

  newNode.location = newLocation

  if (node.isV28) {
    const nodeAsV28 = node.asV28
    if (nodeAsV28.certificationType) {
      const certificationTypeAsString = nodeAsV28.certificationType.toString()
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

  if (node.isV63) {
    const nodeAsV63 = node.asV63
    newNode.secure = nodeAsV63.secureBoot ? true : false
    newNode.virtualized = nodeAsV63.virtualized ? true : false
    newNode.serialNumber = nodeAsV63.serialNumber.toString()
    newNode.connectionPrice = nodeAsV63.connectionPrice
    if (nodeAsV63.certification) {
      const certificationTypeAsString = nodeAsV63.certification.__kind.toString()
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
  resourcesTotal.id = ctx.event.id
  resourcesTotal.sru = nodeEvent.resources.sru
  resourcesTotal.hru = nodeEvent.resources.hru
  resourcesTotal.mru = nodeEvent.resources.mru
  resourcesTotal.cru = nodeEvent.resources.cru

  await ctx.store.save<NodeResourcesTotal>(resourcesTotal)

  if (nodeEvent.publicConfig) {
    const pubConfig = new PublicConfig()
    pubConfig.node = newNode
    pubConfig.id = ctx.event.id
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
  const node  = new TfgridModuleNodeUpdatedEvent(ctx)

  let nodeEvent
  if (node.isV9) {
    nodeEvent = node.asV9
  } else if (node.isV28) {
    nodeEvent = node.asV28
  } else if (node.isV43) {
    nodeEvent = node.asV43
  } else if (node.isV63) {
    nodeEvent = node.asV63
  }

  if (!nodeEvent) return

  const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeEvent.id } })
  if (!savedNode) return

  savedNode.gridVersion = nodeEvent.version
  savedNode.farmID = nodeEvent.farmId
  savedNode.nodeID = nodeEvent.id
  savedNode.twinID = nodeEvent.twinId
  savedNode.updatedAt = BigInt(ctx.event.blockTimestamp)

  // Recalculate total / free resoures when a node get's updated
  let resourcesTotal = await ctx.store.get(NodeResourcesTotal, { where: { node: savedNode } })
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

  if (node.isV63) {
    const nodeAsV63 = node.asV63 
    savedNode.secure = nodeAsV63.secureBoot ? true : false
    savedNode.virtualized = nodeAsV63.virtualized ? true : false
    savedNode.serialNumber = nodeAsV63.serialNumber.toString()
    if (nodeAsV63.certification) {
      const certificationTypeAsString = nodeAsV63.certification.__kind.toString()
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

    const intfs = await ctx.store.find(Interfaces, { where: { node: savedNode }})
    const promises = intfs.map(intf => {
      return ctx.store.remove(intf)
    })
    await Promise.all(promises)
    // console.log("-------------DELETING NODE-------------")
    // console.log(savedNode.interfaces)

    // if (savedNode.interfaces) {
    //   console.log(savedNode.interfaces)
    //   const promises = savedNode.interfaces.map(async int => {
    //     const intf = await ctx.store.get(Interfaces, { where: { id: int.id }})
    //     return ctx.store.remove(intf)
    //   })
    //   await Promise.all(promises)
    // }
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
  const [nodeID, config] = new TfgridModuleNodePublicConfigStoredEvent(ctx).asV12

  const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeID } })
  if (!savedNode) return

  let publicConfig = await ctx.store.get(PublicConfig, { where: { node: savedNode }})

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
}

export async function nodeMarkedAsDedicated(ctx: EventHandlerContext) {
  const [nodeID, dedicated] = new TfgridModuleNodeMarkedAsDedicatedEvent(ctx).asV63

  const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeID } })
  if (!savedNode) return

  savedNode.dedicated = dedicated
  await ctx.store.save<Node>(savedNode)
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