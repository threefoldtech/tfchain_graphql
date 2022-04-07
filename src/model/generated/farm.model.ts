import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import {CertificationType} from "./_certificationType"
import {PublicIp} from "./publicIp.model"

@Entity_()
export class Farm {
  constructor(props?: Partial<Farm>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("integer", {nullable: false})
  gridVersion!: number

  @Column_("integer", {nullable: false})
  farmID!: number

  @Column_("text", {nullable: false})
  name!: string

  @Column_("integer", {nullable: false})
  twinID!: number

  @Column_("integer", {nullable: false})
  pricingPolicyID!: number

  @Column_("varchar", {length: 9, nullable: false})
  certificationType!: CertificationType

  @OneToMany_(() => PublicIp, e => e.farm)
  publicIPs!: PublicIp[]

  @Column_("text", {nullable: true})
  stellarAddress!: string | undefined | null

  @Column_("bool", {nullable: true})
  dedicatedFarm!: boolean | undefined | null
}
