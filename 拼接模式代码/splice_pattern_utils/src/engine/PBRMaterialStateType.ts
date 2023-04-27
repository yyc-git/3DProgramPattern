import * as MaterialStateType from "./MaterialType"
import type { Map } from "immutable"

export type material = MaterialStateType.material

type diffuse = [number, number, number]

type diffuseMapUnit = number

export type state = {
    maxMaterialIndex: number,
    hasDiffuseMapMap: Map<material, boolean>,
    diffuses: Map<material, diffuse>,
    diffuseMapUnits: Map<material, diffuseMapUnit>
}
