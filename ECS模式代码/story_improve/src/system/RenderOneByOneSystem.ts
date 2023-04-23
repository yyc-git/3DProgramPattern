import * as GameObjectManager from "../manager/gameObject/Manager";
import * as InstanceComponentManager from "../manager/instance_component/Manager";
import { state as worldState } from "../world/WorldStateType";

export let render = (worldState: worldState): void => {
    let superHeroGameObjects = GameObjectManager.getAllGameObjects(worldState.gameObjectManagerState).filter(gameObject => {
        return !InstanceComponentManager.hasComponent(worldState.instanceComponentManagerState, gameObject)
    })

    superHeroGameObjects.forEach(gameObjectState => {
        console.log("OneByOne渲染 SuperHero...")
    })
}