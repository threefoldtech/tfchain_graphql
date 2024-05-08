import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class PriceStored {
    constructor(props?: Partial<PriceStored>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("int4", {nullable: false})
    newPrice!: number

    @Column_("int4", {nullable: false})
    block!: number

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    timestamp!: bigint
}
