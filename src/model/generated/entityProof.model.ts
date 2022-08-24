import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Twin} from "./twin.model"

@Entity_()
export class EntityProof {
  constructor(props?: Partial<EntityProof>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("int4", {nullable: false})
  entityID!: number

  @Column_("text", {nullable: false})
  signature!: string

  @Index_()
  @ManyToOne_(() => Twin, {nullable: false})
  twinRel!: Twin
}
