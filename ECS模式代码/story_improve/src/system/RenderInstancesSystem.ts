import * as GameObjectManager from "../manager/gameObject/Manager";
import * as InstanceComponentManager from "../manager/instance_component/Manager";
import { state as worldState } from "../world/WorldStateType";

export let render = (worldState: worldState): void => {
    let normalHeroGameObejcts = GameObjectManager.getAllGameObjects(worldState.gameObjectManagerState).filter(gameObject => {
        return InstanceComponentManager.hasComponent(worldState.instanceComponentManagerState, gameObject)
    })

    console.log("批量Instance渲染 NormalHeroes...")
}