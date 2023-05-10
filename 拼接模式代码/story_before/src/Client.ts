import * as Engine from "./engine/Engine"
import * as  ClientUtils from "splice_pattern_utils/src/Client"

let state = Engine.createState()

let sceneData = ClientUtils.createScene(state)
state = sceneData[0]
let [allBasicMaterials, allPBRMaterials, _] = sceneData[1]

state = Engine.initBasicMaterialShader(state, allBasicMaterials)

state = Engine.initPBRMaterialShader(state, allPBRMaterials)

state = Engine.initCamera(state)

state = Engine.render(state)