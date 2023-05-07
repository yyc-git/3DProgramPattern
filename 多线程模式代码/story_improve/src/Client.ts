import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import * as WorldForMainWorker from "mutltithread_pattern_world/src/WorldForMainWorker"
import * as ClientUtils from "multithread_pattern_utils/src/Client"

let isUseWorker = true

let transformComponentCount = 8000
let basicMaterialComponentCount = 8000

globalThis.transformComponentCount = transformComponentCount
globalThis.basicMaterialComponentCount = basicMaterialComponentCount

globalThis.maxRenderGameObjectCount = 8000


let worldState = WorldForMainWorker.createState({ transformComponentCount, basicMaterialComponentCount })

worldState = ClientUtils.createScene(worldState, 8000)

if (isUseWorker) {
    worldState = WorldForMainWorker.registerWorkerAllPipelines(worldState)
}
else {
    worldState = WorldForMainWorker.registerNoWorkerAllPipelines(worldState)
}



let canvas = document.querySelector("#canvas")



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
            console.log("after sync")

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
