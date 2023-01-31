import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class Entity {
  constructor(props?: Partial<Entity>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("int4", {nullable: false})
  gridVersion!: number

  @Column_("int4", {nullable: false})
  entityID!: number

  @Column_("text", {nullable: false})
  name!: string

  @Column_("text", {nullable: true})
  country!: string | undefined | null

  @Column_("text", {nullable: true})
  city!: string | undefined | null

  @Column_("text", {nullable: false})
  accountID!: string
}
