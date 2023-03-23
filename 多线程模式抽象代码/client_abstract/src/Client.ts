import { state as worldState } from "mutltithread_pattern_world_abstract/src/WorldStateType"
import { createState, init, update, render, sync, registerWorkerAllPipelines } from "mutltithread_pattern_world_abstract/src/WorldForMainWorker"
import * as SceneAPI from "mutltithread_pattern_world_abstract/src/SceneAPI"

let _createScene = (worldState: worldState): worldState => {
    console.log("使用SceneAPI创建场景", SceneAPI)

    return worldState
}

let isUseWorker = true

let dataOrientedComponent1Count = xxx

globalThis.dataOrientedComponent1Count = dataOrientedComponent1Count

globalThis.maxRenderGameObjectCount = xxx


let worldState = createState({ dataOrientedComponent1Count })

worldState = _createScene(worldState)

if (isUseWorker) {
    worldState = registerWorkerAllPipelines(worldState)
}
else {
    console.log("WorldForMainWorker.registerNoWorkerAllPipelines")
}



let canvas = document.querySelector("#canvas")



let _loop = (worldState: worldState) => {
    update(worldState).then(worldState => {
        let handlePromise

        if (isUseWorker) {
            handlePromise = sync(worldState)
        }
        else {
            handlePromise = render(worldState)
        }

        handlePromise.then(worldState => {
            console.log("after sync")

            requestAnimationFrame(
                (time) => {
                    _loop(worldState)
                }
            )
        })
    })
}

init(worldState, canvas).then(worldState => {
    _loop(worldState)
})
