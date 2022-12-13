import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class ExecutedContractMigration {
  constructor(props?: Partial<ExecutedContractMigration>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("bool", {nullable: false})
  executed!: boolean
}
