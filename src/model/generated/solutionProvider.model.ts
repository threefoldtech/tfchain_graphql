import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"
import {Provider} from "./_provider"

@Entity_()
export class SolutionProvider {
  constructor(props?: Partial<SolutionProvider>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  solutionProviderID!: bigint

  @Column_("text", {nullable: false})
  description!: string

  @Column_("text", {nullable: false})
  link!: string

  @Column_("bool", {nullable: false})
  approved!: boolean

  @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.map((val: any) => val == null ? undefined : val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => val == null ? undefined : new Provider(undefined, val))}, nullable: true})
  providers!: (Provider | undefined | null)[] | undefined | null
}
