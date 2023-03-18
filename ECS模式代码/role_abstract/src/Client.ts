import { createDataOrientedComponent1, createGameObject, createOtherComponent1, setDataOrientedComponent1, setOtherComponent1 } from "./world/SceneAPI";
import { createState, init, loop, operateGameObjectAndComponentsFunc1 } from "./world/World";
import { state as worldState } from "./world/WorldStateType";

let _createScene = (worldState: worldState): worldState => {
    let gameObject1Data = createGameObject(worldState)
    worldState = gameObject1Data[0]
    let gameObject1 = gameObject1Data[1]

    let dataOrientedComponent1Data = createDataOrientedComponent1(worldState)
    worldState = dataOrientedComponent1Data[0]
    let dataOrientedComponent1 = dataOrientedComponent1Data[1]
    let otherComponent1Data = createOtherComponent1(worldState)
    let otherComponent1 = otherComponent1Data[1]
    worldState = otherComponent1Data[0]

    worldState = setDataOrientedComponent1(worldState, gameObject1, dataOrientedComponent1)
    worldState = setOtherComponent1(worldState, gameObject1, otherComponent1)

    worldState = operateGameObjectAndComponentsFunc1(worldState, gameObject1, dataOrientedComponent1, otherComponent1)


    创建更多的GameObjects...


    return worldState
}

let worldState = createState({ dataOrientedComponent1Count: 10 })

worldState = _createScene(worldState)

worldState = init(worldState)

loop(worldState)