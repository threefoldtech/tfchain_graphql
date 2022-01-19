import {Resolver, Query} from "type-graphql"
import {InjectManager} from "typeorm-typedi-extensions"
import {EntityManager} from "typeorm"
import {Node} from "../generated/model"

@Resolver()
export class NodePublicConfigResolver {
  constructor(
    @InjectManager() private db: EntityManager
  ) {}

  @Query(() => [Node], { nullable: true })
  async nodesWherePublicConfig(): Promise<Node[]>  {
    let nodes = await this.db.getRepository(Node).createQueryBuilder().getMany()
    const nodesP = nodes.filter(n => n.publicConfig)
    console.log(nodesP)
    return nodesP
  }
}