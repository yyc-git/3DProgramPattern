import type { Map } from "immutable"

export type material = number

type color = [number, number, number]

type mapUnit = number

export type state = {
    hasBasicMapMap: Map<material, boolean>,
    isSupportHardwareInstance: boolean,
    isSupportBatchInstance: boolean
    colors:Map<material, color>,
    mapUnits:Map<material, mapUnit>
}
