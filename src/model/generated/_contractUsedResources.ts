import assert from "assert"
import * as marshal from "./marshal"

export class ContractUsedResources {
  private _hru!: bigint | undefined | null
  private _sru!: bigint | undefined | null
  private _cru!: bigint | undefined | null
  private _mru!: bigint | undefined | null

  constructor(props?: Partial<Omit<ContractUsedResources, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._hru = json.hru == null ? undefined : marshal.bigint.fromJSON(json.hru)
      this._sru = json.sru == null ? undefined : marshal.bigint.fromJSON(json.sru)
      this._cru = json.cru == null ? undefined : marshal.bigint.fromJSON(json.cru)
      this._mru = json.mru == null ? undefined : marshal.bigint.fromJSON(json.mru)
    }
  }

  get hru(): bigint | undefined | null {
    return this._hru
  }

  set hru(value: bigint | undefined | null) {
    this._hru = value
  }

  get sru(): bigint | undefined | null {
    return this._sru
  }

  set sru(value: bigint | undefined | null) {
    this._sru = value
  }

  get cru(): bigint | undefined | null {
    return this._cru
  }

  set cru(value: bigint | undefined | null) {
    this._cru = value
  }

  get mru(): bigint | undefined | null {
    return this._mru
  }

  set mru(value: bigint | undefined | null) {
    this._mru = value
  }

  toJSON(): object {
    return {
      hru: this.hru == null ? undefined : marshal.bigint.toJSON(this.hru),
      sru: this.sru == null ? undefined : marshal.bigint.toJSON(this.sru),
      cru: this.cru == null ? undefined : marshal.bigint.toJSON(this.cru),
      mru: this.mru == null ? undefined : marshal.bigint.toJSON(this.mru),
    }
  }
}
