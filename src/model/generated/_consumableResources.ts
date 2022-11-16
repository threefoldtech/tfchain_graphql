import assert from "assert"
import * as marshal from "./marshal"
import {ResourcesType} from "./_resourcesType"

export class ConsumableResources {
  private _total!: ResourcesType
  private _used!: ResourcesType

  constructor(props?: Partial<Omit<ConsumableResources, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._total = new ResourcesType(undefined, marshal.nonNull(json.total))
      this._used = new ResourcesType(undefined, marshal.nonNull(json.used))
    }
  }

  get total(): ResourcesType {
    assert(this._total != null, 'uninitialized access')
    return this._total
  }

  set total(value: ResourcesType) {
    this._total = value
  }

  get used(): ResourcesType {
    assert(this._used != null, 'uninitialized access')
    return this._used
  }

  set used(value: ResourcesType) {
    this._used = value
  }

  toJSON(): object {
    return {
      total: this.total.toJSON(),
      used: this.used.toJSON(),
    }
  }
}
