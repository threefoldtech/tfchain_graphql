import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {ContractPublicIp} from "./_contractPublicIp"
import {ContractState} from "./_contractState"
import {DeploymentContractResources} from "./deploymentContractResources.model"

@Entity_()
export class DeploymentContract {
  constructor(props?: Partial<DeploymentContract>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  contractID!: bigint

  @Column_("integer", {nullable: false})
  twinID!: number

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  capacityReservationID!: bigint

  @Column_("text", {nullable: false})
  deploymentData!: string

  @Column_("text", {nullable: false})
  deploymentHash!: string

  @Column_("integer", {nullable: false})
  numberOfPublicIPs!: number

  @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.map((val: any) => val == null ? undefined : val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => val == null ? undefined : new ContractPublicIp(undefined, val))}, nullable: true})
  publicIps!: (ContractPublicIp | undefined | null)[] | undefined | null

  @Column_("varchar", {length: 11, nullable: false})
  state!: ContractState

  @Index_()
  @ManyToOne_(() => DeploymentContractResources, {nullable: true})
  resourcesUsed!: DeploymentContractResources | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  createdAt!: bigint

  @Column_("integer", {nullable: true})
  solutionProviderID!: number | undefined | null
}
