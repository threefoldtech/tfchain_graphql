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

  @Column_("text", {nullable: true})
  name!: string | undefined | null

  @Column_("integer", {nullable: true})
  cu!: number | undefined | null

  @Column_("integer", {nullable: true})
  su!: number | undefined | null

  @Column_("integer", {nullable: true})
  nu!: number | undefined | null

  @Column_("integer", {nullable: true})
  ipv4!: number | undefined | null

  @Column_("integer", {nullable: true})
  minimalUptime!: number | undefined | null

  @Column_("integer", {nullable: true})
  policyCreated!: number | undefined | null

  @Column_("integer", {nullable: true})
  policyEnd!: number | undefined | null

  @Column_("bool", {nullable: true})
  immutable!: boolean | undefined | null

  @Column_("bool", {nullable: true})
  default!: boolean | undefined | null

  @Column_("varchar", {length: 9, nullable: true})
  nodeCertification!: NodeCertification | undefined | null

  @Column_("varchar", {length: 12, nullable: true})
  farmCertification!: FarmCertification | undefined | null
}
