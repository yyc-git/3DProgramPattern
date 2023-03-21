import { component as transform } from "multithread_pattern_ecs/src/component/TransformComponentType"
import { component as material } from "multithread_pattern_ecs/src/component/NoLightMaterialComponentType"
import { state as noLightMaterialComponentManagerState } from "multithread_pattern_ecs/src/manager/noLightMaterial_component/ManagerStateType"
import { state as transformComponentManagerState } from "multithread_pattern_ecs/src/manager/transform_component/ManagerStateType"
import { getColor } from "multithread_pattern_ecs/src/manager/noLightMaterial_component/Manager"
import { getPosition } from "multithread_pattern_ecs/src/manager/transform_component/Manager"
import { Map } from "immutable";
import { getExnFromStrictUndefined } from "commonlib-ts/src/NullableUtils";

export let clear = (gl: WebGLRenderingContext) => {
    gl.clearColor(1, 1, 1, 1)

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT)
}

export let render = (gl: WebGLRenderingContext, verticesBuffer: WebGLBuffer, indicesBuffer: WebGLBuffer, program: WebGLProgram, modelMatrix: Float32Array, color: Array<number>, count: number) => {
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);


    const u_color = gl.getUniformLocation(program, "u_color");
    gl.uniform3fv(u_color, color);

    const a_position = gl.getAttribLocation(program, "a_position");
    gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_position);

    const u_model = gl.getUniformLocation(program, "u_model");
    gl.uniformMatrix4fv(u_model, false, modelMatrix);

    gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_BYTE, 0);
}

let _buildModelMatrix = ([x, y, z]: Array<number>) => {
    return new Float32Array([1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, x, y, z, 1.0])
}

export function getRenderData(material: material, transform: transform, programMap: Map<material, WebGLProgram>,
    noLightMaterialComponentManagerState: noLightMaterialComponentManagerState,
    transformComponentManagerState: transformComponentManagerState
): [
        number,
        WebGLProgram,
        Array<number>,
        Float32Array
    ] {
    let count = 3

    let program = getExnFromStrictUndefined(programMap.get(material))

    let color = getColor(noLightMaterialComponentManagerState, material)

    let modelMatrix: Float32Array = _buildModelMatrix(
        getPosition(transformComponentManagerState, transform)
    )

    return [count, program, color, modelMatrix];
}