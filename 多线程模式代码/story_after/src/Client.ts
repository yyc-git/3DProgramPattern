import { registerPipeline } from "pipeline_manager"
import { getPipeline as getRootPipeline } from "multithread_pattern_root_pipeline/src/Main"
import { getPipeline as getMainWorkerPipeline } from "worker_pipeline/src/main/Main"
import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { createState, init, update, render, runPipeline, setPipeManagerState, unsafeGetPipeManagerState } from "mutltithread_pattern_world/src/World"
import { createGameObject, createTransformComponent, createNoLightMaterialComponent, setTransformComponent, setNoLightMaterialComponent, setPosition, setColor } from "mutltithread_pattern_world/src/SceneAPI"
import { range } from "commonlib-ts/src/ArrayUtils"

let _registerAllPipelines = (worldState: worldState) => {
    let pipelineManagerState = registerPipeline(
        unsafeGetPipeManagerState(worldState),
        getRootPipeline(),
        []
    )
    pipelineManagerState = registerPipeline(
        pipelineManagerState,
        getMainWorkerPipeline(),
        [
            {
                pipelineName: "init",
                insertElementName: "init_root",
                insertAction: "after"
            },
            {
                pipelineName: "update",
                insertElementName: "update_root",
                insertAction: "after"
            },
            {
                pipelineName: "render",
                insertElementName: "render_root",
                insertAction: "after"
            }
        ]
    )

    worldState = setPipeManagerState(worldState, pipelineManagerState)

    return worldState
}


let _createTriangle = (worldState: worldState, color: Array<number>, position: Array<number>): worldState => {
    let triangleGameObjectData = createGameObject(worldState)
    worldState = triangleGameObjectData[0]
    let triangleGameObject = triangleGameObjectData[1]

    let transformComponentData = createTransformComponent(worldState)
    worldState = transformComponentData[0]
    let transformComponent = transformComponentData[1]
    let noLightMateiralComponentData = createNoLightMaterialComponent(worldState)
    let noLightMaterialComponent = noLightMateiralComponentData[1]
    worldState = noLightMateiralComponentData[0]

    worldState = setTransformComponent(worldState, triangleGameObject, transformComponent)
    worldState = setNoLightMaterialComponent(worldState, triangleGameObject, noLightMaterialComponent)

    worldState = setPosition(worldState, transformComponent, position)
    worldState = setColor(worldState, noLightMaterialComponent, color)

    return worldState
}

let _createScene = (worldState: worldState, count: number): worldState => {
    return range(0, count - 1).reduce(worldState => {
        return _createTriangle(worldState, [
            Math.random(), Math.random(), Math.random()
        ], [
            Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1
        ])
    }, worldState)
}

let transformComponentCount = 8000
let noLightMaterialComponentCount = 8000

globalThis.transformComponentCount = transformComponentCount
globalThis.noLightMaterialComponentCount = noLightMaterialComponentCount


let worldState = createState({ transformComponentCount, noLightMaterialComponentCount })

worldState = _createScene(worldState, 8000)

worldState = _registerAllPipelines(worldState)



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
