import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class AveragePriceStored {
    constructor(props?: Partial<AveragePriceStored>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("int4", {nullable: false})
    newAveragePrice!: number

    @Column_("int4", {nullable: false})
    block!: number

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    timestamp!: bigint
}
