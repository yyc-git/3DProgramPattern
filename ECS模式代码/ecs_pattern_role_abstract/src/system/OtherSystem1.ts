import { state as worldState } from "../world/WorldStateType";
import { component as dataOrientedComponentX } from "../component/DataOrientedComponent1Type";
import { component as otherComponentX } from "../component/OtherComponent1Type";
import { gameObject } from "../gameObject/GameObjectType";

export let action = (worldState: worldState, gameObject?: gameObject, dataOrientedComponentX?: dataOrientedComponentX, otherComponentX?: otherComponentX) => {
    console.log("行为的逻辑...")

    return worldState
}