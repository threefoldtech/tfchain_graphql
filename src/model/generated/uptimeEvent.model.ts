import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class UptimeEvent {
  constructor(props?: Partial<UptimeEvent>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("integer", {nullable: false})
  nodeID!: number

  @Column_("integer", {nullable: false})
  uptime!: number

  @Column_("integer", {nullable: false})
  timestamp!: number
}
