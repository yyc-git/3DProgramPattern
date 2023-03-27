import type { Map } from "immutable"

export type material = number

export type state = {
    hasBasicMapMap: Map<material, boolean>,
    isSupportHardwareInstance: boolean,
    isSupportBatchInstance: boolean
}
