import { Map } from "immutable";
import { component } from "../../component/TransformComponentType";
import { gameObject } from "../../gameObject/GameObjectType";

export type state = {
    maxIndex: number,
    buffer: ArrayBuffer,
    positions: Float32Array,
    modelMatrices: Float32Array,
    gameObjectMap: Map<component, gameObject>,
    gameObjectTransformMap: Map<gameObject, component>,
}