import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"
import {Policy} from "./_policy"

@Entity_()
export class PricingPolicy {
  constructor(props?: Partial<PricingPolicy>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("int4", {nullable: false})
  gridVersion!: number

  @Column_("int4", {nullable: false})
  pricingPolicyID!: number

  @Column_("text", {nullable: false})
  name!: string

  @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => new Policy(undefined, marshal.nonNull(obj))}, nullable: false})
  su!: Policy

  @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => new Policy(undefined, marshal.nonNull(obj))}, nullable: false})
  cu!: Policy

  @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => new Policy(undefined, marshal.nonNull(obj))}, nullable: false})
  nu!: Policy

  @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => new Policy(undefined, marshal.nonNull(obj))}, nullable: false})
  ipu!: Policy

  @Column_("text", {nullable: false})
  foundationAccount!: string

  @Column_("text", {nullable: false})
  certifiedSalesAccount!: string

  @Column_("int4", {nullable: false})
  dedicatedNodeDiscount!: number
}
