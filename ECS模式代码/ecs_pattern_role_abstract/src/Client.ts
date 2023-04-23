import * as WorldSceneAPI from "./world/SceneAPI";
import * as World from "./world/World";
import { state as worldState } from "./world/WorldStateType";

let _createScene = (worldState: worldState): worldState => {
    //创建gameObject1
    let gameObject1Data = WorldSceneAPI.createGameObject(worldState)
    worldState = gameObject1Data[0]
    let gameObject1 = gameObject1Data[1]

    //创建组件
    let dataOrientedComponent1Data = WorldSceneAPI.createDataOrientedComponent1(worldState)
    worldState = dataOrientedComponent1Data[0]
    let dataOrientedComponent1 = dataOrientedComponent1Data[1]
    let otherComponent1Data = WorldSceneAPI.createOtherComponent1(worldState)
    let otherComponent1 = otherComponent1Data[1]
    worldState = otherComponent1Data[0]

    //挂载组件
    worldState = WorldSceneAPI.setDataOrientedComponent1(worldState, gameObject1, dataOrientedComponent1)
    worldState = WorldSceneAPI.setOtherComponent1(worldState, gameObject1, otherComponent1)

    //触发gameObject1的行为
    worldState = World.action1(worldState, gameObject1, dataOrientedComponent1, otherComponent1)

    创建更多的GameObjects...

    return worldState
}

let worldState = World.createState({ dataOrientedComponent1Count: xx })

worldState = _createScene(worldState)

worldState = World.init(worldState)

World.loop(worldState)