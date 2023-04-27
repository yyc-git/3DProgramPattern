import {
    createBasicMaterial, createTransform, setFakeTransformData, setBasicMaterialFakeMap, createPBRMaterial,
    addMaterial, addTransform, createGameObject
} from "./engine/API"
import { materialType } from "./engine/MaterialType"

export let createScene = (state) => {
    let gameObjectData1 = createGameObject(state)
    state = gameObjectData1[0]
    let gameObject1 = gameObjectData1[1]

    let basicMaterialData1 = createBasicMaterial(state)
    state = basicMaterialData1[0]
    let basicMaterial1 = basicMaterialData1[1]

    state = setBasicMaterialFakeMap(state, basicMaterial1)


    let transformData1 = createTransform(state)
    state = transformData1[0]
    let transform1 = transformData1[1]

    state = setFakeTransformData(state, transform1)


    state = addMaterial(state, gameObject1, basicMaterial1, materialType.Basic)
    state = addTransform(state, gameObject1, transform1)



    let gameObjectData2 = createGameObject(state)
    state = gameObjectData2[0]
    let gameObject2 = gameObjectData2[1]


    let pbrMaterialData1 = createPBRMaterial(state)
    state = pbrMaterialData1[0]
    let pbrMaterial1 = pbrMaterialData1[1]


    let transformData2 = createTransform(state)
    state = transformData2[0]
    let transform2 = transformData2[1]

    state = setFakeTransformData(state, transform2)


    state = addMaterial(state, gameObject2, pbrMaterial1, materialType.PBR)
    state = addTransform(state, gameObject2, transform2)




    let gameObjectData3 = createGameObject(state)
    state = gameObjectData3[0]
    let gameObject3 = gameObjectData3[1]


    let basicMaterialData2 = createBasicMaterial(state)
    state = basicMaterialData2[0]
    let basicMaterial2 = basicMaterialData2[1]

    state = setBasicMaterialFakeMap(state, basicMaterial2)


    let transformData3 = createTransform(state)
    state = transformData3[0]
    let transform3 = transformData3[1]

    state = setFakeTransformData(state, transform3)



    state = addMaterial(state, gameObject3, basicMaterial2, materialType.Basic)
    state = addTransform(state, gameObject3, transform3)


    return [
        state,
        [
            [
                basicMaterial1, basicMaterial2
            ],
            [pbrMaterial1],
            [transform1, transform2]
        ]
    ]
}