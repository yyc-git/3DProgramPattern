import * as BasicMaterial from "splice_pattern_utils/src/engine/BasicMaterial"
import * as Transform from "splice_pattern_utils/src/engine/Transform"
import { parseGLSLConfig } from "../glsl_converter/GLSLConverter"
import { state } from "./MainStateType"
// import { createFakeWebGLRenderingContext } from "splice_pattern_utils/src/engine/FakeGL"
import { getData } from "./glsl/ShaderChunk"
import { Map } from "immutable"
import * as API from "splice_pattern_utils/src/engine/API"
import * as InitBasicMaterialShader from "./InitXxxMaterialShader"
import * as Render from "./Render"
import { shaderName } from "../glsl_handler/GLSLConfigType.gen"

export let createState = (shadersJson: JSON, shaderLibsJson: JSON): state => {
    let [shaders, shaderLibs] = parseGLSLConfig(shadersJson, shaderLibsJson)

    return {
        gl: xxx,
        programMap: Map(),
        sendDataMap: Map(),
        maxShaderIndex: 0,
        shaders,
        shaderLibs,
        shaderChunk: getData(),
        precision: "lowp",

        创建更多字段...
    }
}

// export let createTransform = (state: state): [state, transform] => {
//     console.log("创建Transform")
// }

// // export let setFakeTransformData = API.setFakeTransformData

// export let createMaterial = API.createMaterial

// export let setMaterialFakeColor = API.setMaterialFakeColor

// export let setMaterialFakeMap = API.setMaterialFakeMap

// export let initCamera = API.initCamera

export let initXxxMaterialShader = InitBasicMaterialShader.initXxxMaterialShader

export let render = Render.render