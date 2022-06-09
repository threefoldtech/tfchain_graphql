import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import {NodeCertification} from "./_nodeCertification"
import {FarmCertification} from "./_farmCertification"

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

  @Column_("integer", {nullable: false})
  minimalUptime!: number

  @Column_("integer", {nullable: false})
  policyCreated!: number

  @Column_("integer", {nullable: false})
  policyEnd!: number

  @Column_("bool", {nullable: true})
  immutable!: boolean | undefined | null

  @Column_("bool", {nullable: true})
  default!: boolean | undefined | null

  @Column_("varchar", {length: 9, nullable: false})
  nodeCertification!: NodeCertification

  @Column_("varchar", {length: 12, nullable: false})
  farmCertification!: FarmCertification
}
