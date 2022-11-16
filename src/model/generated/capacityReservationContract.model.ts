import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"
import {ConsumableResources} from "./_consumableResources"

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

  @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : new ConsumableResources(undefined, obj)}, nullable: true})
  resources!: ConsumableResources | undefined | null

  @Column_("integer", {nullable: false})
  publicIPs!: number

  @Column_("integer", {array: true, nullable: false})
  deploymentContracts!: (number)[]
}
