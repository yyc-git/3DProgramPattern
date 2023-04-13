import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { createState, init, update, render, sync, registerNoWorkerAllPipelines, registerWorkerAllPipelines } from "mutltithread_pattern_world/src/WorldForMainWorker"
import { createScene } from "multithread_pattern_utils/src/Client"

let isUseWorker = true

let transformComponentCount = 8000
let basicMaterialComponentCount = 8000

globalThis.transformComponentCount = transformComponentCount
globalThis.basicMaterialComponentCount = basicMaterialComponentCount

globalThis.maxRenderGameObjectCount = 8000


let worldState = createState({ transformComponentCount, basicMaterialComponentCount })

worldState = createScene(worldState, 8000)

if (isUseWorker) {
    worldState = registerWorkerAllPipelines(worldState)
}
else {
    worldState = registerNoWorkerAllPipelines(worldState)
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
