import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {ContractState} from "./_contractState"
import {ContractType} from "./_contractType"

@Entity_()
export class Contract {
    constructor(props?: Partial<Contract>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("int4", {nullable: false})
    gridVersion!: number

    @Index_()
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    contractID!: bigint

    @Column_("int4", {nullable: false})
    twinID!: number

    @Column_("int4", {nullable: true})
    nodeID!: number | undefined | null

    @Column_("text", {nullable: true})
    deploymentData!: string | undefined | null

    @Column_("text", {nullable: true})
    deploymentHash!: string | undefined | null

    @Column_("int4", {nullable: true})
    numberOfPublicIPs!: number | undefined | null

    @Index_()
    @Column_("varchar", {length: 11, nullable: false})
    state!: ContractState

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    createdAt!: bigint

    @Column_("int4", {nullable: true})
    solutionProviderID!: number | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    usedCRU!: bigint | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    usedMRU!: bigint | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    usedSRU!: bigint | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    usedHRU!: bigint | undefined | null

    @Column_("text", {nullable: true})
    name!: string | undefined | null

    @Index_()
    @Column_("varchar", {length: 4, nullable: false})
    type!: ContractType
}
