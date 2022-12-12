import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToOne as OneToOne_, Index as Index_, JoinColumn as JoinColumn_} from "typeorm"
import * as marshal from "./marshal"
import {Deployment} from "./deployment.model"

@Entity_()
export class DeploymentResources {
  constructor(props?: Partial<DeploymentResources>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_({unique: true})
  @OneToOne_(() => Deployment, {nullable: false})
  @JoinColumn_()
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
