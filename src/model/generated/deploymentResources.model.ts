import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Deployment} from "./deployment.model"

@Entity_()
export class DeploymentResources {
  constructor(props?: Partial<DeploymentResources>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Deployment, {nullable: false})
  contract!: Deployment

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  hru!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  sru!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  cru!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  mru!: bigint
}
