import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToOne as OneToOne_, Index as Index_, JoinColumn as JoinColumn_} from "typeorm"
import {Node} from "./node.model"
import {PowerState} from "./_powerState"

@Entity_()
export class NodePower {
  constructor(props?: Partial<NodePower>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_({unique: true})
  @OneToOne_(() => Node, {nullable: false})
  @JoinColumn_()
  node!: Node

  @Column_("varchar", {length: 4, nullable: true})
  target!: PowerState | undefined | null

  @Column_("varchar", {length: 4, nullable: true})
  state!: PowerState | undefined | null

  @Column_("integer", {nullable: false})
  lastUptime!: number
}
