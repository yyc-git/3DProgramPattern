import { state } from "./EngineStateType"
import { material } from "splice_pattern_utils/src/engine/BasicMaterialStateType"
import { hasBasicMap } from "splice_pattern_utils/src/engine/BasicMaterial"
import * as InitMaterialShaderUtils from "./InitMaterialShaderUtils"


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

#ifdef MAP
attribute vec2 a_texCoord;
varying vec2 v_mapCoord0;
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

#ifdef MAP
  v_mapCoord0 = a_texCoord;
#endif
}
    `
}

let _buildDefaultFSGLSL = () => {
  return `
precision lowp float;
precision lowp int;

#ifdef MAP
varying vec2 v_mapCoord0;
uniform sampler2D u_mapSampler;
#endif

uniform vec3 u_color;

void main(void){
#ifdef MAP
  vec4 texelColor = texture2D(u_mapSampler, v_mapCoord0);

  vec4 totalColor = vec4(texelColor.rgb * u_color, texelColor.a);
#endif

#ifdef NO_MAP
  vec4 totalColor = vec4(u_color, 1.0);
#endif

  gl_FragColor = vec4(totalColor.rgb, totalColor.a);
}
    `
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

  if (hasBasicMap(state.basicMaterialState, material)) {
    vsGLSL = _addDefine(vsGLSL, "MAP")
    fsGLSL = _addDefine(fsGLSL, "MAP")
  }
  else {
    vsGLSL = _addDefine(vsGLSL, "NO_MAP")
    fsGLSL = _addDefine(fsGLSL, "NO_MAP")
  }

  return [vsGLSL, fsGLSL]
}

export let initBasicMaterialShader =
  (state: state, allMaterials: Array<material>): state => {
    let [newProgramMap, newShaderIndexMap, newMaxShaderIndex] = InitMaterialShaderUtils.initMaterialShader(state, _buildGLSL, state.basicMaterialShaderIndexMap, allMaterials)

    return {
      ...state,
      programMap: newProgramMap,
      maxShaderIndex: newMaxShaderIndex,
      basicMaterialShaderIndexMap: newShaderIndexMap
    }
  }