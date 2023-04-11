import { Map } from "immutable";
import { component } from "../../component/BasicMaterialComponentType";
import { gameObject } from "../../gameObject/GameObjectType";

export type state = {
    maxIndex: number,
    buffer: ArrayBuffer,
    colors: Float32Array,
    gameObjectMap: Map<component, gameObject>,
    gameObjectBasicMaterialMap: Map<gameObject, component>,
}