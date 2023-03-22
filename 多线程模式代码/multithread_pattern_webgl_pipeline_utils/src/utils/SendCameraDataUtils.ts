export let sendCameraData = (gl: WebGLRenderingContext, viewMatrix: Float32Array, pMatrix: Float32Array, programs: WebGLProgram[]) => {
    programs.forEach((program) => {
        gl.useProgram(program);

        let u_view = gl.getUniformLocation(program, "u_view");
        let u_perspective = gl.getUniformLocation(program, "u_projection");

        gl.uniformMatrix4fv(u_view, false, viewMatrix);
        gl.uniformMatrix4fv(u_perspective, false, pMatrix);
    })
}