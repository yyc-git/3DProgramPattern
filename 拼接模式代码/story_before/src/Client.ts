import { createState, createMaterial, initBasicMaterialShader, render, createTransform, setFakeTransformData, initCamera, setMaterialFakeMap } from "./engine/Engine"

let _createScene = (state) => {
    let materialData1 = createMaterial(state)
    state = materialData1[0]
    let material1 = materialData1[1]

    state = setMaterialFakeMap(state, material1)


    let materialData2 = createMaterial(state)
    state = materialData2[0]
    let material2 = materialData2[1]



    let transformData = createTransform(state)
    state = transformData[0]
    let transform = transformData[1]

    state = setFakeTransformData(state, transform)

    return [
        state,
        [
            [material1, material2],
            [transform]
        ]
    ]
}

let state = createState()


let sceneData = _createScene(state)
state = sceneData[0]
let [allMaterials, _] = sceneData[1]

state = initBasicMaterialShader(state, allMaterials)

state = initCamera(state)

state = render(state)