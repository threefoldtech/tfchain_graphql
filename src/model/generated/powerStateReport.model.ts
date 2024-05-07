import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"
import {PowerState} from "./_powerState"

@Entity_()
export class PowerStateReport {
    constructor(props?: Partial<PowerStateReport>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("int4", {nullable: false})
    farmID!: number

    @Column_("int4", {nullable: false})
    nodeID!: number

    @Column_("varchar", {length: 4, nullable: false})
    newPowerState!: PowerState

    @Column_("int4", {nullable: false})
    block!: number

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    timestamp!: bigint
}
