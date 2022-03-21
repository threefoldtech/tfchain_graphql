import assert from "assert"
import * as marshal from "./marshal"

export class PublicConfig {
  private _ipv4!: string | undefined | null
  private _ipv6!: string | undefined | null
  private _gw4!: string | undefined | null
  private _gw6!: string | undefined | null
  private _domain!: string | undefined | null

  constructor(props?: Partial<Omit<PublicConfig, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._ipv4 = json.ipv4 == null ? undefined : marshal.string.fromJSON(json.ipv4)
      this._ipv6 = json.ipv6 == null ? undefined : marshal.string.fromJSON(json.ipv6)
      this._gw4 = json.gw4 == null ? undefined : marshal.string.fromJSON(json.gw4)
      this._gw6 = json.gw6 == null ? undefined : marshal.string.fromJSON(json.gw6)
      this._domain = json.domain == null ? undefined : marshal.string.fromJSON(json.domain)
    }
  }

  get ipv4(): string | undefined | null {
    return this._ipv4
  }

  set ipv4(value: string | undefined | null) {
    this._ipv4 = value
  }

  get ipv6(): string | undefined | null {
    return this._ipv6
  }

  set ipv6(value: string | undefined | null) {
    this._ipv6 = value
  }

  get gw4(): string | undefined | null {
    return this._gw4
  }

  set gw4(value: string | undefined | null) {
    this._gw4 = value
  }

  get gw6(): string | undefined | null {
    return this._gw6
  }

  set gw6(value: string | undefined | null) {
    this._gw6 = value
  }

  get domain(): string | undefined | null {
    return this._domain
  }

  set domain(value: string | undefined | null) {
    this._domain = value
  }

  toJSON(): object {
    return {
      ipv4: this.ipv4,
      ipv6: this.ipv6,
      gw4: this.gw4,
      gw6: this.gw6,
      domain: this.domain,
    }
  }
}
