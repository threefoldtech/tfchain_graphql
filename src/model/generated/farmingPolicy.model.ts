import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"
import {CertificationType} from "./_certificationType"

@Entity_()
export class FarmingPolicy {
  constructor(props?: Partial<FarmingPolicy>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("integer", {nullable: false})
  gridVersion!: number

  @Column_("integer", {nullable: false})
  farmingPolicyID!: number

  @Column_("text", {nullable: false})
  name!: string

  @Column_("integer", {nullable: false})
  cu!: number

  @Column_("integer", {nullable: false})
  su!: number

  @Column_("integer", {nullable: false})
  nu!: number

  @Column_("integer", {nullable: false})
  ipv4!: number

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  timestamp!: bigint

  @Column_("varchar", {length: 9, nullable: false})
  certificationType!: CertificationType
}
