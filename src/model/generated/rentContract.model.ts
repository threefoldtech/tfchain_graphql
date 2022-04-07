import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"
import {ContractState} from "./_contractState"

@Entity_()
export class RentContract {
  constructor(props?: Partial<RentContract>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("integer", {nullable: false})
  gridVersion!: number

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  contractID!: bigint

  @Column_("integer", {nullable: false})
  twinID!: number

  @Column_("integer", {nullable: false})
  nodeID!: number

  @Column_("varchar", {length: 10, nullable: false})
  state!: ContractState

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  createdAt!: bigint
}
