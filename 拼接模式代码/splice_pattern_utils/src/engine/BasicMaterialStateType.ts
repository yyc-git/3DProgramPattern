import type { Map } from "immutable"
import { shaderIndex } from "./ShaderType"

export type material = number

type color = [number, number, number]

type mapUnit = number

export type state = {
    maxMaterialIndex:number,
    shaderIndexMap: Map<material, shaderIndex>
    hasBasicMapMap: Map<material, boolean>,
    colors: Map<material, color>,
    mapUnits: Map<material, mapUnit>
}
