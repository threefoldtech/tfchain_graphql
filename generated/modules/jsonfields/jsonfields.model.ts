import {
  BaseModel,
  BooleanField,
  DateField,
  FloatField,
  IntField,
  NumericField,
  JSONField,
  BytesField,
  EnumField,
  StringField,
  ObjectType,
} from '@subsquid/warthog';
import BN from 'bn.js';
import { InputType, Field } from 'type-graphql';

@InputType('ContractUsedResourcesInput')
@ObjectType()
export class ContractUsedResources {
  @NumericField({
    nullable: true,
  })
  hru?: BN;

  @NumericField({
    nullable: true,
  })
  sru?: BN;

  @NumericField({
    nullable: true,
  })
  cru?: BN;

  @NumericField({
    nullable: true,
  })
  mru?: BN;
}

@InputType('PolicyInput')
@ObjectType()
export class Policy {
  @IntField({
    nullable: true,
  })
  value?: number;

  @StringField({
    nullable: true,
  })
  unit?: string;
}

@InputType('PublicConfigInput')
@ObjectType()
export class PublicConfig {
  @StringField({
    nullable: true,
  })
  ipv4?: string;

  @StringField({
    nullable: true,
  })
  ipv6?: string;

  @StringField({
    nullable: true,
  })
  gw4?: string;

  @StringField({
    nullable: true,
  })
  gw6?: string;

  @StringField({
    nullable: true,
  })
  domain?: string;
}
