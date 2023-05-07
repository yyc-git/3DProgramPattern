import { state as worldState } from "mutltithread_pattern_world_abstract/src/WorldStateType"
import * as WorldForMainWorker from "mutltithread_pattern_world_abstract/src/WorldForMainWorker"
import * as SceneAPI from "mutltithread_pattern_world_abstract/src/SceneAPI"

let _createScene = (worldState: worldState): worldState => {
    console.log("使用SceneAPI创建场景", SceneAPI)

    return worldState
}

let isUseWorker = true or false

let dataOrientedComponent1Count = xxx

globalThis.dataOrientedComponent1Count = dataOrientedComponent1Count

globalThis.maxRenderGameObjectCount = xxx


let worldState = WorldForMainWorker.createState({ dataOrientedComponent1Count })

worldState = _createScene(worldState)

if (isUseWorker) {
    worldState = WorldForMainWorker.registerWorkerAllPipelines(worldState)
}
else {
    console.log("registerNoWorkerAllPipelines...")
}



let canvas = 获得canvas Dom

let _loop = (worldState: worldState) => {
    WorldForMainWorker.update(worldState).then(worldState => {
        let handlePromise

        if (isUseWorker) {
            handlePromise = WorldForMainWorker.sync(worldState)
        }
        else {
            handlePromise = WorldForMainWorker.render(worldState)
        }

        handlePromise.then(worldState => {
            requestAnimationFrame(
                (time) => {
                    _loop(worldState)
                }
            )
        })
    })
}

WorldForMainWorker.init(worldState, canvas).then(worldState => {
    _loop(worldState)
})
