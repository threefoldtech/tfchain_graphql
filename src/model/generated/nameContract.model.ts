import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import {ContractState} from "./_contractState"

@Entity_()
export class NameContract {
  constructor(props?: Partial<NameContract>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("integer", {nullable: false})
  version!: number

  @Column_("integer", {nullable: false})
  contractID!: number

  @Column_("integer", {nullable: false})
  twinID!: number

  @Column_("text", {nullable: false})
  name!: string

  @Column_("varchar", {length: 10, nullable: false})
  state!: ContractState
}
