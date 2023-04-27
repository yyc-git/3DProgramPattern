import { createState, initBasicMaterialShader, initPBRMaterialShader, render, initCamera } from "./engine/Engine"
import { createScene } from "splice_pattern_utils/src/Client"

let state = createState()

let sceneData = createScene(state)
state = sceneData[0]
let [allBasicMaterials, allPBRMaterials, _] = sceneData[1]

state = initBasicMaterialShader(state, allBasicMaterials)

state = initPBRMaterialShader(state, allPBRMaterials)

state = initCamera(state)

state = render(state)