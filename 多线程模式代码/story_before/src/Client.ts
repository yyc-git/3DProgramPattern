import * as WorldForNoWorker from "mutltithread_pattern_world/src/WorldForNoWorker"
import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import * as ClientUtils from "multithread_pattern_utils/src/Client"

let worldState = WorldForNoWorker.createState({ transformComponentCount: 8000, basicMaterialComponentCount: 8000 })

worldState = ClientUtils.createScene(worldState, 8000)

worldState = WorldForNoWorker.registerAllPipelines(worldState)

let canvas = document.querySelector("#canvas")

let _loop = (worldState: worldState) => {
    WorldForNoWorker.update(worldState).then(worldState => {
        WorldForNoWorker.render(worldState).then(worldState => {
            console.log("after render")

            requestAnimationFrame(
                (time) => {
                    _loop(worldState)
                }
            )
        })
    })
}

WorldForNoWorker.init(worldState, canvas).then(worldState => {
    _loop(worldState)
})
