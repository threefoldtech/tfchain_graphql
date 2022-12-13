import assert from "assert"
import * as marshal from "./marshal"

export class Resources {
  private _hru!: bigint
  private _sru!: bigint
  private _cru!: bigint
  private _mru!: bigint

  constructor(props?: Partial<Omit<Resources, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._hru = marshal.bigint.fromJSON(json.hru)
      this._sru = marshal.bigint.fromJSON(json.sru)
      this._cru = marshal.bigint.fromJSON(json.cru)
      this._mru = marshal.bigint.fromJSON(json.mru)
    }
  }

  get hru(): bigint {
    assert(this._hru != null, 'uninitialized access')
    return this._hru
  }

  set hru(value: bigint) {
    this._hru = value
  }

  get sru(): bigint {
    assert(this._sru != null, 'uninitialized access')
    return this._sru
  }

  set sru(value: bigint) {
    this._sru = value
  }

  get cru(): bigint {
    assert(this._cru != null, 'uninitialized access')
    return this._cru
  }

  set cru(value: bigint) {
    this._cru = value
  }

  get mru(): bigint {
    assert(this._mru != null, 'uninitialized access')
    return this._mru
  }

  set mru(value: bigint) {
    this._mru = value
  }

  toJSON(): object {
    return {
      hru: marshal.bigint.toJSON(this.hru),
      sru: marshal.bigint.toJSON(this.sru),
      cru: marshal.bigint.toJSON(this.cru),
      mru: marshal.bigint.toJSON(this.mru),
    }
  }
}
