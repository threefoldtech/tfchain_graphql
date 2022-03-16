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
  RentContractCreateInput,
  RentContractCreateManyArgs,
  RentContractUpdateArgs,
  RentContractWhereArgs,
  RentContractWhereInput,
  RentContractWhereUniqueInput,
  RentContractOrderByEnum,
} from '../../warthog';

import { RentContract } from './rent-contract.model';
import { RentContractService } from './rent-contract.service';

@ObjectType()
export class RentContractEdge {
  @Field(() => RentContract, { nullable: false })
  node!: RentContract;

  @Field(() => String, { nullable: false })
  cursor!: string;
}

@ObjectType()
export class RentContractConnection {
  @Field(() => Int, { nullable: false })
  totalCount!: number;

  @Field(() => [RentContractEdge], { nullable: false })
  edges!: RentContractEdge[];

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
export class RentContractConnectionWhereArgs extends ConnectionPageInputOptions {
  @Field(() => RentContractWhereInput, { nullable: true })
  where?: RentContractWhereInput;

  @Field(() => RentContractOrderByEnum, { nullable: true })
  orderBy?: [RentContractOrderByEnum];
}

@Resolver(RentContract)
export class RentContractResolver {
  constructor(@Inject('RentContractService') public readonly service: RentContractService) {}

  @Query(() => [RentContract])
  async rentContracts(
    @Args() { where, orderBy, limit, offset }: RentContractWhereArgs,
    @Fields() fields: string[]
  ): Promise<RentContract[]> {
    return this.service.find<RentContractWhereInput>(where, orderBy, limit, offset, fields);
  }

  @Query(() => RentContract, { nullable: true })
  async rentContractByUniqueInput(
    @Arg('where') where: RentContractWhereUniqueInput,
    @Fields() fields: string[]
  ): Promise<RentContract | null> {
    const result = await this.service.find(where, undefined, 1, 0, fields);
    return result && result.length >= 1 ? result[0] : null;
  }

  @Query(() => RentContractConnection)
  async rentContractsConnection(
    @Args() { where, orderBy, ...pageOptions }: RentContractConnectionWhereArgs,
    @Info() info: any
  ): Promise<RentContractConnection> {
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
      result = await this.service.findConnection<RentContractWhereInput>(where, orderBy, pageOptions, rawFields);
    } catch (err: any) {
      console.log(err);
      // TODO: should continue to return this on `Error: Items is empty` or throw the error
      if (!(err.message as string).includes('Items is empty')) throw err;
    }

    return result as Promise<RentContractConnection>;
  }
}
