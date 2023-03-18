import { getAllGameObjects } from "../manager/gameObject/Manager";
import { hasComponent as hasInstanceComponent } from "../manager/instance_component/Manager";
import { state as worldState } from "../world/WorldStateType";

export let render = (worldState: worldState): void => {
    let superHeroGameObjects = getAllGameObjects(worldState.gameObjectManagerState).filter(gameObject => {
        return !hasInstanceComponent(worldState.instanceComponentManagerState, gameObject)
    })

    superHeroGameObjects.forEach(gameObjectState => {
        console.log("OneByOne渲染 SuperHero...")
    })
}