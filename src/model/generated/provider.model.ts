import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {SolutionProvider} from "./solutionProvider.model"

@Entity_()
export class Provider {
  constructor(props?: Partial<Provider>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => SolutionProvider, {nullable: false})
  solutionProvider!: SolutionProvider

  @Column_("text", {nullable: false})
  who!: string

  @Column_("integer", {nullable: false})
  take!: number
}
