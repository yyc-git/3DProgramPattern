import { Map } from "immutable"
import * as ShaderUtils from "splice_pattern_utils/src/engine/Shader"

export let initMaterialShader = (state, buildGLSL, shaderIndexMap, allMaterials) => {
    let [newProgramMap, newShaderIndexMap, _, newMaxShaderIndex] = allMaterials.reduce(([programMap, shaderIndexMap, glslMap, maxShaderIndex]: any, material) => {
        let glsl = buildGLSL(state, material)

        let [shaderIndex, newMaxShaderIndex] = ShaderUtils.generateShaderIndex(glslMap, glsl, maxShaderIndex)

        //如果是之前的shaderIndex，则不创建新的WebGLProgram
        if (!programMap.has(shaderIndex)) {
            programMap = programMap.set(shaderIndex, ShaderUtils.createFakeProgram(glsl))
        }

        if (!glslMap.has(shaderIndex)) {
            glslMap = glslMap.set(shaderIndex, glsl)
        }

        // console.log(glsl)
        console.log("shaderIndex:", shaderIndex)

        return [
            programMap,
            ShaderUtils.setShaderIndex(shaderIndexMap, material, shaderIndex),
            glslMap,
            newMaxShaderIndex
        ]
    }, [state.programMap, shaderIndexMap, Map(), state.maxShaderIndex])

    return [newProgramMap, newShaderIndexMap, newMaxShaderIndex]
}