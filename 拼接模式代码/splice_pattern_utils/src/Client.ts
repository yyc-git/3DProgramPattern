import {  createMaterial, createTransform, setFakeTransformData, setMaterialFakeMap } from "./engine/API"

export let createScene = (state) => {
    let materialData1 = createMaterial(state)
    state = materialData1[0]
    let material1 = materialData1[1]

    state = setMaterialFakeMap(state, material1)


    let materialData2 = createMaterial(state)
    state = materialData2[0]
    let material2 = materialData2[1]


    let materialData3 = createMaterial(state)
    state = materialData3[0]
    let material3 = materialData3[1]

    state = setMaterialFakeMap(state, material3)


    let transformData = createTransform(state)
    state = transformData[0]
    let transform = transformData[1]

    state = setFakeTransformData(state, transform)

    return [
        state,
        [
            [material1, material2, material3],
            [transform]
        ]
    ]
}