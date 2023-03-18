import { Map } from "immutable";
import { component } from "../../component/DataOrientedComponent1Type";
import { gameObject } from "../../gameObject/GameObjectType";

export type TypeArrayType = Float32Array | Uint8Array | Uint16Array | Uint32Array

export type state = {
    maxIndex: number,
    buffer: ArrayBuffer,
    value1s: TypeArrayType,
    value2s: TypeArrayType,
    更多valueXs...,

    gameObjectMap: Map<component, gameObject>,
    gameObjectDataOrientedComponent1Map: Map<gameObject, component>,
}