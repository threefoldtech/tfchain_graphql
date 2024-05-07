import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"
import {Power} from "./_power"

@Entity_()
export class PowerTargetReport {
    constructor(props?: Partial<PowerTargetReport>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("int4", {nullable: false})
    farmID!: number

    @Column_("int4", {nullable: false})
    nodeID!: number

    @Column_("varchar", {length: 4, nullable: false})
    newPowerTarget!: Power

    @Column_("int4", {nullable: false})
    block!: number

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    timestamp!: bigint
}
