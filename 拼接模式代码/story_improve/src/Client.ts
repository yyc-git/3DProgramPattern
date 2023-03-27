import * as shadersJson from "./glsl_config/shaders.json"
import * as shaderLibsJson from "./glsl_config/shader_libs.json"
import { parseGLSLConfig } from "splice_pattern_engine/src/Main"

let _fixJsonForArrayBug = (jsonWithArray) => {
    if (Array.isArray(jsonWithArray)) {
        return jsonWithArray
    }

    return (jsonWithArray as any).default
}

console.log(parseGLSLConfig(shadersJson, _fixJsonForArrayBug(shaderLibsJson)))