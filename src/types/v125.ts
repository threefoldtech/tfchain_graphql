export type PowerState = PowerState_Up | PowerState_Down

export interface PowerState_Up {
    __kind: 'Up'
}

export interface PowerState_Down {
    __kind: 'Down'
    value: number
}

export type Power = Power_Up | Power_Down

export interface Power_Up {
    __kind: 'Up'
}

export interface Power_Down {
    __kind: 'Down'
}