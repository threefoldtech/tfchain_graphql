import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {NodeContract} from "./nodeContract.model"

@Entity_()
export class ContractResources {
    constructor(props?: Partial<ContractResources>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => NodeContract, {nullable: true})
    contract!: NodeContract

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    hru!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    sru!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    cru!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    mru!: bigint
}
