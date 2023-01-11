import assert from "assert"
import * as marshal from "./marshal"

export class Policy {
    private _value!: number | undefined | null
    private _unit!: string | undefined | null

    constructor(props?: Partial<Omit<Policy, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._value = json.value == null ? undefined : marshal.int.fromJSON(json.value)
            this._unit = json.unit == null ? undefined : marshal.string.fromJSON(json.unit)
        }
    }

    get value(): number | undefined | null {
        return this._value
    }

    set value(value: number | undefined | null) {
        this._value = value
    }

    get unit(): string | undefined | null {
        return this._unit
    }

    set unit(value: string | undefined | null) {
        this._unit = value
    }

    toJSON(): object {
        return {
            value: this.value,
            unit: this.unit,
        }
    }
}
