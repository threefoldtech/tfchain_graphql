import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToOne as OneToOne_, Index as Index_, JoinColumn as JoinColumn_} from "typeorm"
import {Node} from "./node.model"

@Entity_()
export class PublicConfig {
    constructor(props?: Partial<PublicConfig>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_({unique: true})
    @OneToOne_(() => Node, {nullable: false})
    @JoinColumn_()
    node!: Node

    @Column_("text", {nullable: true})
    ipv4!: string | undefined | null

    @Column_("text", {nullable: true})
    ipv6!: string | undefined | null

    @Column_("text", {nullable: true})
    gw4!: string | undefined | null

    @Column_("text", {nullable: true})
    gw6!: string | undefined | null

    @Column_("text", {nullable: true})
    domain!: string | undefined | null
}
