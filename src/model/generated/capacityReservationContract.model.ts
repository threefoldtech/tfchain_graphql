import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"
import {Resources} from "./_resources"
import {ContractState} from "./_contractState"

@Entity_()
export class CapacityReservationContract {
  constructor(props?: Partial<CapacityReservationContract>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  contractID!: bigint

  @Column_("integer", {nullable: false})
  nodeID!: number

  @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => new Resources(undefined, marshal.nonNull(obj))}, nullable: false})
  resources!: Resources

  @Column_("integer", {nullable: false})
  publicIPs!: number

  @Column_("varchar", {length: 11, nullable: false})
  state!: ContractState
}
