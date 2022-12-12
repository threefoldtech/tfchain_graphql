import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToOne as OneToOne_} from "typeorm"
import * as marshal from "./marshal"
import {DeploymentPublicIp} from "./_deploymentPublicIp"
import {DeploymentResources} from "./deploymentResources.model"

@Entity_()
export class Deployment {
  constructor(props?: Partial<Deployment>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  deploymentID!: bigint

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

  @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.map((val: any) => val == null ? undefined : val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => val == null ? undefined : new DeploymentPublicIp(undefined, val))}, nullable: true})
  publicIps!: (DeploymentPublicIp | undefined | null)[] | undefined | null

  @OneToOne_(() => DeploymentResources)
  resources!: DeploymentResources | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  createdAt!: bigint
}
