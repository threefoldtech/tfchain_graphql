import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import {Provider} from "./provider.model"

@Entity_()
export class SolutionProvider {
  constructor(props?: Partial<SolutionProvider>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("integer", {nullable: false})
  solutionProviderID!: number

  @Column_("text", {nullable: false})
  description!: string

  @Column_("text", {nullable: false})
  link!: string

  @Column_("bool", {nullable: false})
  approved!: boolean

  @OneToMany_(() => Provider, e => e.solutionProvider)
  providers!: Provider[]
}
