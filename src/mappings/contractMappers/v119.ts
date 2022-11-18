import { EventHandlerContext, Store } from "@subsquid/substrate-processor";
import { CapacityReservationContract, ConsumableResources, Resources, ContractState, Deployment, DeploymentResources, DeploymentPublicIp, PublicIp } from "../../model";
import * as v119 from '../../types/v119'

export async function parseCapacityContractCreate(id: string, ctr: v119.Contract, store: Store) {
    let cap
    if (ctr.contractType.__kind === 'CapacityReservationContract') {
        cap = ctr.contractType.value
    }

    if (!cap) return

    let newCapacityReservationContract = new CapacityReservationContract()
    newCapacityReservationContract.id = id
    newCapacityReservationContract.contractID = ctr.contractId

    newCapacityReservationContract.state = ContractState.Created
    newCapacityReservationContract.nodeID = cap.nodeId
    await store.save<CapacityReservationContract>(newCapacityReservationContract)

    let consumableResources = new ConsumableResources()
    consumableResources.contract = newCapacityReservationContract

    let resourcesTotal = new Resources()
    resourcesTotal.cru = cap.resources.totalResources.cru
    resourcesTotal.sru = cap.resources.totalResources.sru
    resourcesTotal.hru = cap.resources.totalResources.hru
    resourcesTotal.mru = cap.resources.totalResources.mru
    consumableResources.total = resourcesTotal

    let resourcesUsed = new Resources()
    resourcesUsed.cru = BigInt(0)
    resourcesUsed.sru = BigInt(0)
    resourcesUsed.hru = BigInt(0)
    resourcesUsed.mru = BigInt(0)
    consumableResources.used = resourcesUsed

    await store.save<ConsumableResources>(consumableResources)

    // newCapacityReservationContract.resources = consumableResources

    newCapacityReservationContract.publicIPs = cap.publicIps

    await store.save<CapacityReservationContract>(newCapacityReservationContract)
}

export async function parseDeploymentContractCreate(id: string, deployment: v119.Deployment, store: Store) {
    let newDeployment = new Deployment()
    newDeployment.id = id
    newDeployment.deploymentID = deployment.id
    newDeployment.twinID = deployment.twinId

    // newDeployment.createdAt = BigInt(ctx.event.blockTimestamp)

    if (deployment.deploymentData.toString().indexOf('\x00') >= 0) {
        newDeployment.deploymentData = ""
    } else {
        newDeployment.deploymentData = deployment.deploymentData.toString()
    }
    if (deployment.deploymentHash.toString().indexOf('\x00') >= 0) {
        newDeployment.deploymentHash = ""
    } else {
        newDeployment.deploymentHash = deployment.deploymentHash.toString()
    }

    newDeployment.capacityReservationID = deployment.capacityReservationId
    newDeployment.numberOfPublicIPs = deployment.publicIps

    await store.save<Deployment>(newDeployment)

    let contractResources = new DeploymentResources()
    contractResources.id = id
    contractResources.contract = newDeployment

    contractResources.cru = deployment.resources.cru
    contractResources.sru = deployment.resources.sru
    contractResources.hru = deployment.resources.hru
    contractResources.mru = deployment.resources.mru

    newDeployment.resources = contractResources
    newDeployment.publicIps = deployment.publicIpsList.map(ip => {
        let cIP = new DeploymentPublicIp()
        cIP.ip = ip.ip.toString()
        cIP.gateway = ip.gateway.toString()
        return cIP
    })

    await store.save<DeploymentResources>(contractResources)
    await store.save<Deployment>(newDeployment)

    deployment.publicIpsList.forEach(async ip => {
        if (ip.ip.toString().indexOf('\x00') >= 0) {
            return
        }
        const savedIp = await store.get(PublicIp, { where: { ip: ip.ip.toString() } })

        if (savedIp) {
            savedIp.contractId = newDeployment.deploymentID
            await store.save<PublicIp>(savedIp)
        }
    })
}