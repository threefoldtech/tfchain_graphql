import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToOne as OneToOne_} from "typeorm"
import * as marshal from "./marshal"
import {ConsumableResources} from "./consumableResources.model"
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

  @OneToOne_(() => ConsumableResources)
  resources!: ConsumableResources | undefined | null

  @Column_("integer", {nullable: false})
  publicIPs!: number

  @Column_("varchar", {length: 11, nullable: false})
  state!: ContractState
}
