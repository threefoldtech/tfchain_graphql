import { EventHandlerContext, Store } from "@subsquid/substrate-processor";
import { CapacityReservationContract, ConsumableResources, Resources, ContractState, DeploymentContract } from "../../model";
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

export async function parseDeploymentContractCreate(id: string, ctr: v119.Contract, store: Store) {
    let cap
    if (ctr.contractType.__kind === 'DeploymentContract') {
        cap = ctr.contractType.value
    }

    if (!cap) return

    let newDeploymentContract = new DeploymentContract()
    newDeploymentContract.id = id
    newDeploymentContract.contractID = ctr.contractId
    newDeploymentContract.twinID = ctr.twinId

    newDeploymentContract.state = ContractState.Created
    newDeploymentContract.createdAt = BigInt(ctx.event.blockTimestamp)

    if (contract.deploymentData.toString().indexOf('\x00') >= 0) {
        newDeploymentContract.deploymentData = ""
    } else {
        newDeploymentContract.deploymentData = contract.deploymentData.toString()
    }
    if (contract.deploymentHash.toString().indexOf('\x00') >= 0) {
        newDeploymentContract.deploymentHash = ""
    } else {
        newDeploymentContract.deploymentHash = contract.deploymentHash.toString()
    }

    newDeploymentContract.capacityReservationID = contract.capacityReservationId
    newDeploymentContract.numberOfPublicIPs = contract.publicIps
    newDeploymentContract.solutionProviderID = Number(contractEvent.solutionProviderId) || 0

    await ctx.store.save<DeploymentContract>(newDeploymentContract)

    let contractResources = new DeploymentContractResources()
    contractResources.id = id
    contractResources.contract = newDeploymentContract

    contractResources.cru = contract.resources.cru
    contractResources.sru = contract.resources.sru
    contractResources.hru = contract.resources.hru
    contractResources.mru = contract.resources.mru

    newDeploymentContract.resourcesUsed = contractResources
    newDeploymentContract.publicIps = contract.publicIpsList.map(ip => {
        let cIP = new ContractPublicIp
        cIP.ip = ip.ip.toString()
        cIP.gateway = ip.gateway.toString()
        return cIP
    })

    await ctx.store.save<DeploymentContractResources>(contractResources)
    await ctx.store.save<DeploymentContract>(newDeploymentContract)

    contract.publicIpsList.forEach(async ip => {
        if (ip.ip.toString().indexOf('\x00') >= 0) {
            return
        }
        const savedIp = await ctx.store.get(PublicIp, { where: { ip: ip.ip.toString() } })

        if (savedIp) {
            savedIp.contractId = newDeploymentContract.contractID
            await ctx.store.save<PublicIp>(savedIp)
        }
    })
}