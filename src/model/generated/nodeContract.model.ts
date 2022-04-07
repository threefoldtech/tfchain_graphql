import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {ContractState} from "./_contractState"
import {ContractResources} from "./contractResources.model"

@Entity_()
export class NodeContract {
  constructor(props?: Partial<NodeContract>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("integer", {nullable: false})
  gridVersion!: number

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  contractID!: bigint

  @Column_("integer", {nullable: false})
  twinID!: number

  @Column_("integer", {nullable: false})
  nodeID!: number

  @Column_("text", {nullable: false})
  deploymentData!: string

  @Column_("text", {nullable: false})
  deploymentHash!: string

  @Column_("integer", {nullable: false})
  numberOfPublicIPs!: number

  @Column_("varchar", {length: 10, nullable: false})
  state!: ContractState

  @Index_()
  @ManyToOne_(() => ContractResources, {nullable: true})
  resourcesUsed!: ContractResources | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  createdAt!: bigint
}
