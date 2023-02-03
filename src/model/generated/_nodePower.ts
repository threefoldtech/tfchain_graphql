import assert from "assert"
import * as marshal from "./marshal"
import {PowerState} from "./_powerState"
import {Power} from "./_power"

export class NodePower {
    private _state!: PowerState
    private _target!: Power

    constructor(props?: Partial<Omit<NodePower, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._state = marshal.enumFromJson(json.state, PowerState)
            this._target = marshal.enumFromJson(json.target, Power)
        }
    }

    get state(): PowerState {
        assert(this._state != null, 'uninitialized access')
        return this._state
    }

    set state(value: PowerState) {
        this._state = value
    }

    get target(): Power {
        assert(this._target != null, 'uninitialized access')
        return this._target
    }

    set target(value: Power) {
        this._target = value
    }

    toJSON(): object {
        return {
            state: this.state,
            target: this.target,
        }
    }
}
