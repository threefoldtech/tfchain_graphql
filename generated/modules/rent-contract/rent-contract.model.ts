import { BaseModel, IntField, Model, EnumField, StringField, JSONField } from '@subsquid/warthog';

import * as jsonTypes from '../jsonfields/jsonfields.model';

import { ContractState } from '../enums/enums';
export { ContractState };

@Model({ api: {} })
export class RentContract extends BaseModel {
  @IntField({})
  contractId!: number;

  @IntField({})
  nodeId!: number;

  @IntField({})
  twinId!: number;

  @EnumField('ContractState', ContractState, {})
  state!: ContractState;

  constructor(init?: Partial<RentContract>) {
    super();
    Object.assign(this, init);
  }
}
