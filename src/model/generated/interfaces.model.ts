import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Node} from "./node.model"

@Entity_()
export class Interfaces {
    constructor(props?: Partial<Interfaces>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Node, {nullable: true})
    node!: Node

    @Column_("text", {nullable: false})
    name!: string

    @Column_("text", {nullable: false})
    mac!: string

    @Column_("text", {nullable: false})
    ips!: string
}
