import assert from "assert"
import * as marshal from "./marshal"

export class Provider {
    private _who!: string
    private _take!: number

    constructor(props?: Partial<Omit<Provider, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._who = marshal.string.fromJSON(json.who)
            this._take = marshal.int.fromJSON(json.take)
        }
    }

    get who(): string {
        assert(this._who != null, 'uninitialized access')
        return this._who
    }

    set who(value: string) {
        this._who = value
    }

    get take(): number {
        assert(this._take != null, 'uninitialized access')
        return this._take
    }

    set take(value: number) {
        this._take = value
    }

    toJSON(): object {
        return {
            who: this.who,
            take: this.take,
        }
    }
}
