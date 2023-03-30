import { Map } from "immutable";
import { component } from "../../component/FlyComponentType";
import { gameObject } from "../../gameObject/GameObjectType";

export type state = {
    maxIndex: number,
    buffer: ArrayBuffer,
    maxVelocitys: Float32Array,
    gameObjectMap: Map<component, gameObject>,
    gameObjectFlyMap: Map<gameObject, component>,
}