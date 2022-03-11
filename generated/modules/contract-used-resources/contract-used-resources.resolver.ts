import {
  Arg,
  Args,
  Mutation,
  Query,
  Root,
  Resolver,
  FieldResolver,
  ObjectType,
  Field,
  Int,
  ArgsType,
  Info,
  Ctx,
} from 'type-graphql';
import graphqlFields from 'graphql-fields';
import { Inject } from 'typedi';
import { Min } from 'class-validator';
import {
  Fields,
  StandardDeleteResponse,
  UserId,
  PageInfo,
  RawFields,
  NestedFields,
  BaseContext,
} from '@subsquid/warthog';

import {
  ContractUsedResourcesCreateInput,
  ContractUsedResourcesCreateManyArgs,
  ContractUsedResourcesUpdateArgs,
  ContractUsedResourcesWhereArgs,
  ContractUsedResourcesWhereInput,
  ContractUsedResourcesWhereUniqueInput,
  ContractUsedResourcesOrderByEnum,
} from '../../warthog';

import { ContractUsedResources } from './contract-used-resources.model';
import { ContractUsedResourcesService } from './contract-used-resources.service';

@ObjectType()
export class ContractUsedResourcesEdge {
  @Field(() => ContractUsedResources, { nullable: false })
  node!: ContractUsedResources;

  @Field(() => String, { nullable: false })
  cursor!: string;
}

@ObjectType()
export class ContractUsedResourcesConnection {
  @Field(() => Int, { nullable: false })
  totalCount!: number;

  @Field(() => [ContractUsedResourcesEdge], { nullable: false })
  edges!: ContractUsedResourcesEdge[];

  @Field(() => PageInfo, { nullable: false })
  pageInfo!: PageInfo;
}

@ArgsType()
export class ConnectionPageInputOptions {
  @Field(() => Int, { nullable: true })
  @Min(0)
  first?: number;

  @Field(() => String, { nullable: true })
  after?: string; // V3: TODO: should we make a RelayCursor scalar?

  @Field(() => Int, { nullable: true })
  @Min(0)
  last?: number;

  @Field(() => String, { nullable: true })
  before?: string;
}

@ArgsType()
export class ContractUsedResourcesConnectionWhereArgs extends ConnectionPageInputOptions {
  @Field(() => ContractUsedResourcesWhereInput, { nullable: true })
  where?: ContractUsedResourcesWhereInput;

  @Field(() => ContractUsedResourcesOrderByEnum, { nullable: true })
  orderBy?: [ContractUsedResourcesOrderByEnum];
}

@Resolver(ContractUsedResources)
export class ContractUsedResourcesResolver {
  constructor(@Inject('ContractUsedResourcesService') public readonly service: ContractUsedResourcesService) {}

  @Query(() => [ContractUsedResources])
  async contractUsedResources(
    @Args() { where, orderBy, limit, offset }: ContractUsedResourcesWhereArgs,
    @Fields() fields: string[]
  ): Promise<ContractUsedResources[]> {
    return this.service.find<ContractUsedResourcesWhereInput>(where, orderBy, limit, offset, fields);
  }

  @Query(() => ContractUsedResources, { nullable: true })
  async contractUsedResourcesByUniqueInput(
    @Arg('where') where: ContractUsedResourcesWhereUniqueInput,
    @Fields() fields: string[]
  ): Promise<ContractUsedResources | null> {
    const result = await this.service.find(where, undefined, 1, 0, fields);
    return result && result.length >= 1 ? result[0] : null;
  }

  @Query(() => ContractUsedResourcesConnection)
  async contractUsedResourcesConnection(
    @Args() { where, orderBy, ...pageOptions }: ContractUsedResourcesConnectionWhereArgs,
    @Info() info: any
  ): Promise<ContractUsedResourcesConnection> {
    const rawFields = graphqlFields(info, {}, { excludedFields: ['__typename'] });

    let result: any = {
      totalCount: 0,
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
    // If the related database table does not have any records then an error is thrown to the client
    // by warthog
    try {
      result = await this.service.findConnection<ContractUsedResourcesWhereInput>(
        where,
        orderBy,
        pageOptions,
        rawFields
      );
    } catch (err: any) {
      console.log(err);
      // TODO: should continue to return this on `Error: Items is empty` or throw the error
      if (!(err.message as string).includes('Items is empty')) throw err;
    }

    return result as Promise<ContractUsedResourcesConnection>;
  }
}
