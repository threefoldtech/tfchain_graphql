import { Store, SubstrateEvent } from "@subsquid/substrate-processor";
import { Deployment, DeploymentResources, DeploymentPublicIp, PublicIp, CapacityReservationContract } from "../../model";
import * as v120 from '../../types/v120'

export async function createDeployment(id: string, timestamp: bigint, deployment: v120.Deployment, store: Store) {
    let newDeployment = new Deployment()
    newDeployment.id = id
    newDeployment.deploymentID = deployment.id
    newDeployment.twinID = deployment.twinId

    newDeployment.createdAt = timestamp

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

    const savedCapacityContract = await store.find(CapacityReservationContract, { where: { contractID: deployment.capacityReservationId } })
    if (savedCapacityContract.length >= 1) {
        savedCapacityContract[0].publicIPs += deployment.publicIps
        await store.save<CapacityReservationContract>(savedCapacityContract)
    }

    const savedResources = await store.find(DeploymentResources, { where: { contract: newDeployment } })
    if (!savedResources) {
        let deploymentResources = new DeploymentResources()
        deploymentResources.id = id
        deploymentResources.contract = newDeployment
    
        deploymentResources.cru = deployment.resources.cru
        deploymentResources.sru = deployment.resources.sru
        deploymentResources.hru = deployment.resources.hru
        deploymentResources.mru = deployment.resources.mru
    
        newDeployment.resources = deploymentResources
        await store.save<DeploymentResources>(deploymentResources)
    }

    newDeployment.publicIps = deployment.publicIpsList.map(ip => {
        let cIP = new DeploymentPublicIp()
        cIP.ip = ip.ip.toString()
        if (ip.gw) {
            cIP.gateway = ip.gw.toString()
        } else {
            cIP.gateway = "undefined"
        }
        return cIP
    })

    await store.save<Deployment>(newDeployment)

    deployment.publicIpsList.forEach(async ip => {
        if (ip.ip.toString().indexOf('\x00') >= 0) {
            return
        }
        const savedIp = await store.find(PublicIp, { where: { ip: ip.ip.toString() } })

        if (savedIp.length >= 1) {
            savedIp[0].contractId = newDeployment.deploymentID
            await store.save<PublicIp>(savedIp)
        }
    })
}

export async function updateDeployment(deployment: v120.Deployment, store: Store) {
    const savedDeployment = await store.get(Deployment, { where: { deploymentID: deployment.id } })

    if (!savedDeployment) return

    savedDeployment.numberOfPublicIPs = deployment.publicIps

    if (deployment.deploymentData.toString().indexOf('\x00') >= 0) {
        savedDeployment.deploymentData = ""
    } else {
        savedDeployment.deploymentData = deployment.deploymentData.toString()
    }
    if (deployment.deploymentHash.toString().indexOf('\x00') >= 0) {
        savedDeployment.deploymentHash = ""
    } else {
        savedDeployment.deploymentHash = deployment.deploymentHash.toString()
    }

    const savedCapacityContract = await store.get(CapacityReservationContract, { where: { contractID: deployment.capacityReservationId } })
    if (savedCapacityContract) {
        savedCapacityContract.publicIPs -= savedDeployment.numberOfPublicIPs
        savedCapacityContract.publicIPs += deployment.publicIps
        await store.save<CapacityReservationContract>(savedCapacityContract)
    }

    const savedDeploymentResources = await store.get(DeploymentResources, { where: { contract: savedDeployment } })
    if (savedDeploymentResources) {
        savedDeploymentResources.cru = deployment.resources.cru
        savedDeploymentResources.sru = deployment.resources.sru
        savedDeploymentResources.hru = deployment.resources.hru
        savedDeploymentResources.mru = deployment.resources.mru
        await store.save<DeploymentResources>(savedDeploymentResources)
    }

    savedDeployment.resources = savedDeploymentResources

    await store.save<Deployment>(savedDeployment)
}