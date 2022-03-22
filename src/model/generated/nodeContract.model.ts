import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"
import {ContractState} from "./_contractState"
import {ContractUsedResources} from "./_contractUsedResources"

@Entity_()
export class NodeContract {
  constructor(props?: Partial<NodeContract>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("integer", {nullable: false})
  version!: number

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

  @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : new ContractUsedResources(undefined, obj)}, nullable: true})
  resourcesUsed!: ContractUsedResources | undefined | null
}
