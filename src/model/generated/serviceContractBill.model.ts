import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class ServiceContractBill {
  constructor(props?: Partial<ServiceContractBill>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  serviceContractID!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  variableAmount!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  window!: bigint

  @Column_("text", {nullable: true})
  metadata!: string | undefined | null
}
