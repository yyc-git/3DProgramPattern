import { Map } from "immutable";
import { component } from "../../component/OtherComponent1Type";
import { gameObject } from "../../gameObject/GameObjectType";

export type state = {
    maxUID: number,
    //value1Map是Hash Map，用来保存该种组件所有的value1数据
    value1Map: Map<component, value1 type>,
    更多valueXMap...,

    gameObjectMap: Map<component, gameObject>,
    gameObjectOtherComponent1Map: Map<gameObject, component>,
}