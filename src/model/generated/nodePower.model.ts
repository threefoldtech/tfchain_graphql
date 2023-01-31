import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import {PowerState} from "./_powerState"
import {Power} from "./_power"

@Entity_()
export class NodePower {
  constructor(props?: Partial<NodePower>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("integer", {nullable: false})
  farmID!: number

  @Column_("integer", {nullable: false})
  nodeID!: number

  @Column_("varchar", {length: 4, nullable: false})
  state!: PowerState

  @Column_("varchar", {length: 4, nullable: false})
  target!: Power
}
