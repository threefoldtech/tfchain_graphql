import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class Location {
  constructor(props?: Partial<Location>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  longitude!: string

  @Column_("text", {nullable: false})
  latitude!: string
}
