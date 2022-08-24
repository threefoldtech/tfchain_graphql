import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import {FarmCertification} from "./_farmCertification"
import {PublicIp} from "./publicIp.model"

@Entity_()
export class Farm {
  constructor(props?: Partial<Farm>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("int4", {nullable: false})
  gridVersion!: number

  @Column_("int4", {nullable: false})
  farmID!: number

  @Column_("text", {nullable: false})
  name!: string

  @Column_("int4", {nullable: false})
  twinID!: number

  @Column_("int4", {nullable: false})
  pricingPolicyID!: number

  @Column_("varchar", {length: 12, nullable: true})
  certification!: FarmCertification | undefined | null

  @OneToMany_(() => PublicIp, e => e.farm)
  publicIPs!: PublicIp[]

  @Column_("text", {nullable: true})
  stellarAddress!: string | undefined | null

  @Column_("bool", {nullable: true})
  dedicatedFarm!: boolean | undefined | null
}
