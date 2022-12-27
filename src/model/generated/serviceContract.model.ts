import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"
import {ServiceContractState} from "./_serviceContractState"

@Entity_()
export class ServiceContract {
  constructor(props?: Partial<ServiceContract>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  serviceContractID!: bigint

  @Column_("integer", {nullable: false})
  serviceTwinID!: number

  @Column_("integer", {nullable: false})
  consumerTwinID!: number

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  baseFee!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  variableFee!: bigint

  @Column_("text", {nullable: false})
  metadata!: string

  @Column_("bool", {nullable: false})
  acceptedByService!: boolean

  @Column_("bool", {nullable: false})
  acceptedByConsumer!: boolean

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  lastBill!: bigint

  @Column_("varchar", {length: 14, nullable: false})
  state!: ServiceContractState
}
