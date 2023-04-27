import * as MaterialStateType from "./MaterialType"
import type { Map } from "immutable"

export type material = MaterialStateType.material

type color = [number, number, number]

type mapUnit = number

export type state = {
    maxMaterialIndex:number,
    hasBasicMapMap: Map<material, boolean>,
    colors: Map<material, color>,
    mapUnits: Map<material, mapUnit>
}
