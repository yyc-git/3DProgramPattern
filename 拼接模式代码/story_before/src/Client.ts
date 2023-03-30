import { createState, initBasicMaterialShader, render, initCamera } from "./engine/Main"
import { createScene } from "splice_pattern_utils/src/Client"

let state = createState()

let sceneData = createScene(state)
state = sceneData[0]
let [allMaterials, _] = sceneData[1]

state = initBasicMaterialShader(state, allMaterials)

state = initCamera(state)

state = render(state)