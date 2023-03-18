import { Map } from "immutable";
import { component } from "../../component/VelocityComponentType";
import { gameObject } from "../../gameObject/GameObjectType";

export type state = {
    maxIndex: number,
    buffer: ArrayBuffer,
    velocitys: Float32Array,
    gameObjectMap: Map<component, gameObject>,
    gameObjectVelocityMap: Map<gameObject, component>,
}