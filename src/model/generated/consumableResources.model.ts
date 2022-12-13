import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToOne as OneToOne_, Index as Index_, JoinColumn as JoinColumn_} from "typeorm"
import * as marshal from "./marshal"
import {CapacityReservationContract} from "./capacityReservationContract.model"
import {Resources} from "./_resources"

@Entity_()
export class ConsumableResources {
  constructor(props?: Partial<ConsumableResources>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_({unique: true})
  @OneToOne_(() => CapacityReservationContract, {nullable: false})
  @JoinColumn_()
  contract!: CapacityReservationContract

  @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => new Resources(undefined, marshal.nonNull(obj))}, nullable: false})
  total!: Resources

  @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => new Resources(undefined, marshal.nonNull(obj))}, nullable: false})
  used!: Resources
}
