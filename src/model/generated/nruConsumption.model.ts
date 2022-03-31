import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class NruConsumption {
  constructor(props?: Partial<NruConsumption>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("integer", {nullable: false})
  contractID!: number

  @Column_("integer", {nullable: false})
  timestamp!: number

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  window!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  nru!: bigint | undefined | null
}
