import { createState, init, update, render, registerAllPipelines } from "mutltithread_pattern_world/src/WorldForNoWorker"
import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { createGameObject, createTransformComponent, createBasicMaterialComponent, setTransformComponent, setBasicMaterialComponent, setPosition, setColor } from "mutltithread_pattern_world/src/SceneAPI"
import { range } from "commonlib-ts/src/ArrayUtils"

let _createTriangle = (worldState: worldState, color: Array<number>, position: Array<number>): worldState => {
    let triangleGameObjectData = createGameObject(worldState)
    worldState = triangleGameObjectData[0]
    let triangleGameObject = triangleGameObjectData[1]

    let transformComponentData = createTransformComponent(worldState)
    worldState = transformComponentData[0]
    let transformComponent = transformComponentData[1]
    let basicMateiralComponentData = createBasicMaterialComponent(worldState)
    let basicMaterialComponent = basicMateiralComponentData[1]
    worldState = basicMateiralComponentData[0]

    worldState = setTransformComponent(worldState, triangleGameObject, transformComponent)
    worldState = setBasicMaterialComponent(worldState, triangleGameObject, basicMaterialComponent)

    worldState = setPosition(worldState, transformComponent, position)
    worldState = setColor(worldState, basicMaterialComponent, color)

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

let worldState = createState({ transformComponentCount: 8000, basicMaterialComponentCount: 8000 })

worldState = _createScene(worldState, 8000)

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
