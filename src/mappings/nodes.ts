import {
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { Node, Location, PublicConfig, CertificationType, Interfaces, UptimeEvent } from "../model";
import { TfgridModuleNodeDeletedEvent, TfgridModuleNodePublicConfigStoredEvent, TfgridModuleNodeStoredEvent, TfgridModuleNodeUpdatedEvent, TfgridModuleNodeUptimeReportedEvent } from "../types/events";

export async function nodeStored(ctx: EventHandlerContext) {
  const node  = new TfgridModuleNodeStoredEvent(ctx)
  const newNode = new Node()

  let nodeEvent
  if (node.isV9) {
    nodeEvent = node.asV9
  } else if (node.isV28) {
    nodeEvent = node.asV28
  } else if (node.isV43) {
    nodeEvent = node.asV43
  }

  if (!nodeEvent) return

  newNode.id = ctx.event.id
  newNode.gridVersion = nodeEvent.version
  newNode.farmID = nodeEvent.farmId
  newNode.nodeID = nodeEvent.id
  newNode.twinID = nodeEvent.twinId

  newNode.sru = nodeEvent.resources.sru
  newNode.hru = nodeEvent.resources.hru
  newNode.mru = nodeEvent.resources.mru
  newNode.cru = nodeEvent.resources.cru

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
  
  if (nodeEvent.publicConfig) {
    const pubConfig = new PublicConfig()
    pubConfig.ipv4 = nodeEvent.publicConfig.ipv4.toString()
    pubConfig.ipv6 = nodeEvent.publicConfig.ipv6.toString()
    pubConfig.gw4 = nodeEvent.publicConfig.gw4.toString()
    pubConfig.gw6 = nodeEvent.publicConfig.gw6.toString()
    pubConfig.domain = nodeEvent.publicConfig.domain.toString() || ''

    await ctx.store.save<PublicConfig>(pubConfig)
    newNode.publicConfig = pubConfig
  }
  

  if (node.isV28 || node.isV43) {
    const nodeAsV27 = node.asV28 || node.asV43
    if (nodeAsV27.certificationType) {
      const certificationTypeAsString = nodeAsV27.certificationType.toString()
      let certType = CertificationType.Diy
      switch (certificationTypeAsString) {
        case 'Diy': 
          certType = CertificationType.Diy
        break
        case 'Certified': 
          certType = CertificationType.Certified
        break
    }
      newNode.certificationType = certType
    } else {
      newNode.certificationType = CertificationType.Diy
    }
  }

  if (node.isV43) {
    const nodeAsV43 = node.asV43 
    newNode.secure = nodeAsV43.secureBoot ? true : false
    newNode.virtualized = nodeAsV43.virtualized ? true : false
    newNode.serialNumber = nodeAsV43.serialNumber.toString()
  }

  await ctx.store.save<Node>(newNode)

  // const interfacesPromisses = nodeEvent.interfaces.map(intf => {
  //   const newInterface = new Interfaces()
  //   newInterface.id = ctx.event.id
  //   newInterface.name = intf.name.toString()
  //   newInterface.mac = intf.mac.toString()
  //   newInterface.node = newNode
  //   newInterface.ips = intf.ips.map(ip => ip.toString()).join(',')
  //   return ctx.store.save<Interfaces>(newInterface)
  // })

  // await Promise.all(interfacesPromisses)
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
  }

  if (!nodeEvent) return

  const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeEvent.id } })
  if (!savedNode) return

  savedNode.id = ctx.event.id
  savedNode.gridVersion = nodeEvent.version
  savedNode.farmID = nodeEvent.farmId
  savedNode.nodeID = nodeEvent.id
  savedNode.twinID = nodeEvent.twinId

  savedNode.sru = nodeEvent.resources.sru
  savedNode.hru = nodeEvent.resources.hru
  savedNode.mru = nodeEvent.resources.mru
  savedNode.cru = nodeEvent.resources.cru

  savedNode.country = nodeEvent.country.toString()
  savedNode.city = nodeEvent.city.toString()

  savedNode.created = Number(nodeEvent.created)
  savedNode.farmingPolicyId = nodeEvent.farmingPolicyId

  const newLocation = new Location()
  newLocation.id = ctx.event.id
  newLocation.latitude = nodeEvent.location.latitude.toString()
  newLocation.longitude = nodeEvent.location.longitude.toString()
  await ctx.store.save<Location>(newLocation)

  savedNode.location = newLocation

  if (node.isV28 || node.isV43) {
    const nodeAsV27 = node.asV28 || node.asV43
    if (nodeAsV27.certificationType) {
      const certificationTypeAsString = nodeAsV27.certificationType.toString()
      let certType = CertificationType.Diy
      switch (certificationTypeAsString) {
        case 'Diy': 
          certType = CertificationType.Diy
        break
        case 'Certified': 
          certType = CertificationType.Certified
        break
    }
      savedNode.certificationType = certType
    } else {
      savedNode.certificationType = CertificationType.Diy
    }
  }

  if (node.isV43) {
    const nodeAsV43 = node.asV43 
    savedNode.secure = nodeAsV43.secureBoot ? true : false
    savedNode.virtualized = nodeAsV43.virtualized ? true : false
    savedNode.serialNumber = nodeAsV43.serialNumber.toString()
  }

  await ctx.store.save<Node>(savedNode)

  const interfacesPromisses = nodeEvent.interfaces.map(intf => {
    let newInterface

    if (savedNode.interfaces) {
      // if an interface with same name exists
      const found = savedNode.interfaces.findIndex(interf => interf.name === intf.name.toString())
      if (found > 0) {
        newInterface = savedNode.interfaces[found]    
      } else {
        newInterface = new Interfaces()
      }
    }
    
    if (!newInterface) return

    newInterface.id = ctx.event.id
    newInterface.name = intf.name.toString()
    newInterface.mac = intf.mac.toString()
    newInterface.node = savedNode
    newInterface.ips = intf.ips.map(ip => ip.toString()).join(',')
    
    return ctx.store.save<Interfaces>(newInterface)
  })
  await Promise.all(interfacesPromisses)
}

export async function nodeDeleted(ctx: EventHandlerContext) {
  const nodeID = new TfgridModuleNodeDeletedEvent(ctx).asV9

  const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeID } })

  
  if (savedNode) {
    const promises = savedNode.interfaces.map(int => {
      return ctx.store.remove(int)
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
    await ctx.store.save<Node>(savedNode)
  }
}

export async function nodePublicConfigStored(ctx: EventHandlerContext) {
  const [nodeID, config] = new TfgridModuleNodePublicConfigStoredEvent(ctx).asV12

  const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeID } })

  if (savedNode) {
    const pubConfig = new PublicConfig()
    pubConfig.ipv4 = config.ipv4.toString()
    pubConfig.ipv6 = config.ipv6.toString()
    pubConfig.gw4 = config.gw4.toString()
    pubConfig.gw6 = config.gw6.toString()
    pubConfig.domain = config.domain.toString() || ''

    savedNode.publicConfig = pubConfig
    await ctx.store.save<Node>(savedNode)
  }
}