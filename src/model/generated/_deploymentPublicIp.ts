import assert from "assert"
import * as marshal from "./marshal"

export class DeploymentPublicIp {
  private _ip!: string
  private _gateway!: string

  constructor(props?: Partial<Omit<DeploymentPublicIp, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._ip = marshal.string.fromJSON(json.ip)
      this._gateway = marshal.string.fromJSON(json.gateway)
    }
  }

  get ip(): string {
    assert(this._ip != null, 'uninitialized access')
    return this._ip
  }

  set ip(value: string) {
    this._ip = value
  }

  get gateway(): string {
    assert(this._gateway != null, 'uninitialized access')
    return this._gateway
  }

  set gateway(value: string) {
    this._gateway = value
  }

  toJSON(): object {
    return {
      ip: this.ip,
      gateway: this.gateway,
    }
  }
}
