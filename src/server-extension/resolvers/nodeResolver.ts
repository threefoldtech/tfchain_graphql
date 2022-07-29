import { Query, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'
// import { NFTEntity } from '../../model/generated'
// import { SaleNftEntity } from '../model/sales.model'
import { NodesWithUsedResourcesQuery } from "../queries/nodesWithResources"
import { makeQuery } from "../utils"
import { Node } from '../../model'

@Resolver()
export class NodesWithResourcesResolved {
    constructor(private tx: () => Promise<EntityManager>) { }

    @Query(() => [Node])
    async salesFeed(): Promise<[Node]> {
        const result: [Node] = await makeQuery(this.tx, Node, NodesWithUsedResourcesQuery)
        return result
    }
}