import { Map } from "immutable";
import { component } from "../../component/OtherComponent1Type";
import { gameObject } from "../../gameObject/GameObjectType";

export type state = {
    maxUID: number,
    value1Map: Map<component, value1 type>,
    更多valueXMap...,

    gameObjectMap: Map<component, gameObject>,
    gameObjectOtherComponent1Map: Map<gameObject, component>,
}