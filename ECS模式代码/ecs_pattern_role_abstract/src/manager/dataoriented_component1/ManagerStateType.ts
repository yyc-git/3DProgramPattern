import { Map } from "immutable";
import { component } from "../../component/DataOrientedComponent1Type";
import { gameObject } from "../../gameObject/GameObjectType";

export type TypeArrayType = Float32Array | Uint8Array | Uint16Array | Uint32Array

export type state = {
    maxIndex: number,
    //buffer保存了该种组件所有的value1、value2、...、valueX数据
    buffer: ArrayBuffer,
    //该种组件所有的value1数据的视图
    value1s: TypeArrayType,
    //该种组件所有的value2数据的视图
    value2s: TypeArrayType,
    更多valueXs...,

    gameObjectMap: Map<component, gameObject>,
    gameObjectDataOrientedComponent1Map: Map<gameObject, component>,
}