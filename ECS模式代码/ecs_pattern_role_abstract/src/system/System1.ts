import { state as worldState } from "../world/WorldStateType";
import { component as dataOrientedComponent1 } from "../component/DataOrientedComponent1Type";
import { component as otherComponent1 } from "../component/OtherComponent1Type";
import { gameObject } from "../gameObject/GameObjectType";

export let operateGameObjectAndComponentsFunc1 = (worldState: worldState, gameObject?: gameObject, dataOrientedComponent1?: dataOrientedComponent1, otherComponent1?: otherComponent1) => {
    console.log("操作")

    return worldState
}