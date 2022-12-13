import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToOne as OneToOne_, Index as Index_, JoinColumn as JoinColumn_} from "typeorm"
import * as marshal from "./marshal"
import {Node} from "./node.model"
import {Resources} from "./_resources"

@Entity_()
export class NodeConsumableResources {
  constructor(props?: Partial<NodeConsumableResources>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_({unique: true})
  @OneToOne_(() => Node, {nullable: false})
  @JoinColumn_()
  node!: Node

  @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => new Resources(undefined, marshal.nonNull(obj))}, nullable: false})
  total!: Resources

  @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => new Resources(undefined, marshal.nonNull(obj))}, nullable: false})
  used!: Resources
}
