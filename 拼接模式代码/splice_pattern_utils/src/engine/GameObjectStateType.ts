import type { Map } from "immutable"
import { material, materialType } from "./MaterialType"
import { transform } from "./TransformStateType"

type id = number

export type gameObject = id

export type state = {
    maxUID: number,
    gameObjectMaterialMap: Map<gameObject, [material, materialType]>
    gameObjectTransformMap: Map<gameObject, transform>
}
