import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class Country {
  constructor(props?: Partial<Country>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("int4", {nullable: false})
  countryID!: number

  @Column_("text", {nullable: false})
  code!: string

  @Column_("text", {nullable: false})
  name!: string

  @Column_("text", {nullable: false})
  region!: string

  @Column_("text", {nullable: false})
  subregion!: string

  @Column_("text", {nullable: true})
  lat!: string | undefined | null

  @Column_("text", {nullable: true})
  long!: string | undefined | null
}
