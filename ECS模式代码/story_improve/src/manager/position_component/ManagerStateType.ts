import { Map } from "immutable";
import { component } from "../../component/PositionComponentType";
import { gameObject } from "../../gameObject/GameObjectType";

export type state = {
    maxIndex: number,
    buffer: ArrayBuffer,
    positions: Float32Array,
    gameObjectMap: Map<component, gameObject>,
    gameObjectPositionMap: Map<gameObject, component>,
}