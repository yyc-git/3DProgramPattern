import { state } from "./EngineStateType"
import { material } from "splice_pattern_utils/src/engine/PBRMaterialStateType"
import { hasDiffuseMap } from "splice_pattern_utils/src/engine/PBRMaterial"
import { initMaterialShader } from "./InitMaterialShaderUtils"

let _buildDefaultVSGLSL = () => {
  return `
precision lowp float;
precision lowp int;

#ifdef INSTANCE
attribute vec4 a_mVec4_0;
attribute vec4 a_mVec4_1;
attribute vec4 a_mVec4_2;
attribute vec4 a_mVec4_3;
#endif

#ifdef NO_INSTANCE
uniform mat4 u_mMatrix;
#endif

attribute vec3 a_position;

#ifdef DIFFUSE_MAP
attribute vec2 a_texCoord;
varying vec2 v_diffuseMapCoord0;
#endif

uniform mat4 u_vMatrix;
uniform mat4 u_pMatrix;

mat2 transpose(mat2 m) {
  return mat2(m[0][0], m[1][0],   // new col 0
    m[0][1], m[1][1]    // new col 1
  );
}

void main(void){
#ifdef INSTANCE
  mat4 mMatrix = mat4(a_mVec4_0, a_mVec4_1, a_mVec4_2, a_mVec4_3);
#endif

#ifdef NO_INSTANCE
  mat4 mMatrix = u_mMatrix;
#endif

  gl_Position = u_pMatrix * u_vMatrix * mMatrix * vec4(a_position, 1.0);

#ifdef DIFFUSE_MAP
  v_diffuseMapCoord0 = a_texCoord;
#endif
}
    `
}

let _buildDefaultFSGLSL = () => {
  return `
precision lowp float;
precision lowp int;

#ifdef DIFFUSE_MAP
varying vec2 v_diffuseMapCoord0;
uniform sampler2D u_diffuseMapSampler;
#endif

uniform vec3 u_diffuse;

void main(void){
#ifdef DIFFUSE_MAP
  vec4 texelColor = texture2D(u_diffuseMapSampler, v_diffuseMapCoord0);

  vec4 totalColor = vec4(texelColor.rgb * u_diffuse, texelColor.a);
#endif

#ifdef NO_DIFFUSE_MAP
  vec4 totalColor = vec4(u_diffuse, 1.0);
#endif

  gl_FragColor = vec4(totalColor.rgb, totalColor.a);
}
    `
}

let _addDefineWithValue = (glsl: string, name: string, value: string): string => {
  return "#define " + name + " " + value + "\n" + glsl
}

let _addDefine = (glsl: string, name: string): string => {
  return "#define " + name + "\n" + glsl
}

let _buildGLSL = (state: state, material: material): [string, string] => {
  let vsGLSL = _buildDefaultVSGLSL()
  let fsGLSL = _buildDefaultFSGLSL()

  if (state.isSupportInstance) {
    vsGLSL = _addDefine(vsGLSL, "INSTANCE")
  }
  else {
    vsGLSL = _addDefine(vsGLSL, "NO_INSTANCE")
  }

  if (hasDiffuseMap(state.pbrMaterialState, material)) {
    vsGLSL = _addDefine(vsGLSL, "DIFFUSE_MAP")
    fsGLSL = _addDefine(fsGLSL, "DIFFUSE_MAP")
  }
  else {
    vsGLSL = _addDefine(vsGLSL, "NO_DIFFUSE_MAP")
    fsGLSL = _addDefine(fsGLSL, "NO_DIFFUSE_MAP")
  }

  //这里为了简化代码，我们只是在FS GLSL中加入了“定义最大方向光个数”的代码来表示该GLSL支持方向光
  fsGLSL = _addDefineWithValue(fsGLSL, "MAX_DIRECTION_LIGHT_COUNT", String(state.maxDirectionLightCount))

  return [vsGLSL, fsGLSL]
}

export let initPBRMaterialShader =
  (state: state, allMaterials: Array<material>): state => {
    let [newProgramMap, newShaderIndexMap, newMaxShaderIndex] = initMaterialShader(state, _buildGLSL, state.pbrMaterialShaderIndexMap, allMaterials)

    return {
      ...state,
      programMap: newProgramMap,
      maxShaderIndex: newMaxShaderIndex,
      pbrMaterialShaderIndexMap: newShaderIndexMap
    }
  }