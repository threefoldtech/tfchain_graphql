import assert from "assert"
import * as marshal from "./marshal"
import {ResourcesType} from "./_resourcesType"

export class ConsumableResources {
  private _total!: ResourcesType | undefined | null
  private _used!: ResourcesType | undefined | null

  constructor(props?: Partial<Omit<ConsumableResources, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._total = json.total == null ? undefined : new ResourcesType(undefined, json.total)
      this._used = json.used == null ? undefined : new ResourcesType(undefined, json.used)
    }
  }

  get total(): ResourcesType | undefined | null {
    return this._total
  }

  set total(value: ResourcesType | undefined | null) {
    this._total = value
  }

  get used(): ResourcesType | undefined | null {
    return this._used
  }

  set used(value: ResourcesType | undefined | null) {
    this._used = value
  }

  toJSON(): object {
    return {
      total: this.total == null ? undefined : this.total.toJSON(),
      used: this.used == null ? undefined : this.used.toJSON(),
    }
  }
}
