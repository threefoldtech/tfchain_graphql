import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToOne as OneToOne_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Location} from "./location.model"
import {PublicConfig} from "./publicConfig.model"
import {NodeResourcesTotal} from "./nodeResourcesTotal.model"
import {NodeConsumableResources} from "./nodeConsumableResources.model"
import {Interfaces} from "./interfaces.model"
import {NodeCertification} from "./_nodeCertification"
import {NodePower} from "./nodePower.model"

@Entity_()
export class Node {
  constructor(props?: Partial<Node>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("integer", {nullable: false})
  gridVersion!: number

  @Column_("integer", {nullable: false})
  nodeID!: number

  @Column_("integer", {nullable: false})
  farmID!: number

  @Column_("integer", {nullable: false})
  twinID!: number

  @Index_()
  @ManyToOne_(() => Location, {nullable: false})
  location!: Location

  @Column_("text", {nullable: true})
  country!: string | undefined | null

  @Column_("text", {nullable: true})
  city!: string | undefined | null

  @OneToOne_(() => PublicConfig)
  publicConfig!: PublicConfig | undefined | null

  @OneToOne_(() => NodeResourcesTotal)
  resourcesTotal!: NodeResourcesTotal | undefined | null

  @OneToOne_(() => NodeConsumableResources)
  consumableResources!: NodeConsumableResources | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  uptime!: bigint | undefined | null

  @Column_("integer", {nullable: false})
  created!: number

  @Column_("integer", {nullable: false})
  farmingPolicyId!: number

  @OneToMany_(() => Interfaces, e => e.node)
  interfaces!: Interfaces[]

  @Column_("varchar", {length: 9, nullable: true})
  certification!: NodeCertification | undefined | null

  @Column_("bool", {nullable: true})
  secure!: boolean | undefined | null

  @Column_("bool", {nullable: true})
  virtualized!: boolean | undefined | null

  @Column_("text", {nullable: true})
  serialNumber!: string | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  createdAt!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  updatedAt!: bigint

  @Column_("integer", {nullable: true})
  connectionPrice!: number | undefined | null

  @OneToOne_(() => NodePower)
  power!: NodePower | undefined | null
}
