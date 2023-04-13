import { createState, init, update, render, registerAllPipelines } from "mutltithread_pattern_world/src/WorldForNoWorker"
import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { createScene } from "multithread_pattern_utils/src/Client"

let worldState = createState({ transformComponentCount: 8000, basicMaterialComponentCount: 8000 })

worldState = createScene(worldState, 8000)

worldState = registerAllPipelines(worldState)

let canvas = document.querySelector("#canvas")

let _loop = (worldState: worldState) => {
    update(worldState).then(worldState => {
        render(worldState).then(worldState => {
            console.log("after render")

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
