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
  NruConsumptionCreateInput,
  NruConsumptionCreateManyArgs,
  NruConsumptionUpdateArgs,
  NruConsumptionWhereArgs,
  NruConsumptionWhereInput,
  NruConsumptionWhereUniqueInput,
  NruConsumptionOrderByEnum,
} from '../../warthog';

import { NruConsumption } from './nru-consumption.model';
import { NruConsumptionService } from './nru-consumption.service';

@ObjectType()
export class NruConsumptionEdge {
  @Field(() => NruConsumption, { nullable: false })
  node!: NruConsumption;

  @Field(() => String, { nullable: false })
  cursor!: string;
}

@ObjectType()
export class NruConsumptionConnection {
  @Field(() => Int, { nullable: false })
  totalCount!: number;

  @Field(() => [NruConsumptionEdge], { nullable: false })
  edges!: NruConsumptionEdge[];

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
export class NruConsumptionConnectionWhereArgs extends ConnectionPageInputOptions {
  @Field(() => NruConsumptionWhereInput, { nullable: true })
  where?: NruConsumptionWhereInput;

  @Field(() => NruConsumptionOrderByEnum, { nullable: true })
  orderBy?: [NruConsumptionOrderByEnum];
}

@Resolver(NruConsumption)
export class NruConsumptionResolver {
  constructor(@Inject('NruConsumptionService') public readonly service: NruConsumptionService) {}

  @Query(() => [NruConsumption])
  async nruConsumptions(
    @Args() { where, orderBy, limit, offset }: NruConsumptionWhereArgs,
    @Fields() fields: string[]
  ): Promise<NruConsumption[]> {
    return this.service.find<NruConsumptionWhereInput>(where, orderBy, limit, offset, fields);
  }

  @Query(() => NruConsumption, { nullable: true })
  async nruConsumptionByUniqueInput(
    @Arg('where') where: NruConsumptionWhereUniqueInput,
    @Fields() fields: string[]
  ): Promise<NruConsumption | null> {
    const result = await this.service.find(where, undefined, 1, 0, fields);
    return result && result.length >= 1 ? result[0] : null;
  }

  @Query(() => NruConsumptionConnection)
  async nruConsumptionsConnection(
    @Args() { where, orderBy, ...pageOptions }: NruConsumptionConnectionWhereArgs,
    @Info() info: any
  ): Promise<NruConsumptionConnection> {
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
      result = await this.service.findConnection<NruConsumptionWhereInput>(where, orderBy, pageOptions, rawFields);
    } catch (err: any) {
      console.log(err);
      // TODO: should continue to return this on `Error: Items is empty` or throw the error
      if (!(err.message as string).includes('Items is empty')) throw err;
    }

    return result as Promise<NruConsumptionConnection>;
  }
}
