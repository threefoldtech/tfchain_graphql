import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class City {
  constructor(props?: Partial<City>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("int4", {nullable: false})
  cityID!: number

  @Column_("int4", {nullable: false})
  countryID!: number

  @Column_("text", {nullable: false})
  name!: string
}
