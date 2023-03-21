export let sendCameraData = (gl: WebGLRenderingContext, programs: WebGLProgram[]) => {
    let viewMatrix = new Float32Array([1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0])
    let pMatrix = new Float32Array([1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0])

    programs.forEach((program) => {
        gl.useProgram(program);

        let u_view = gl.getUniformLocation(program, "u_view");
        let u_perspective = gl.getUniformLocation(program, "u_projection");

        gl.uniformMatrix4fv(u_view, false, viewMatrix);
        gl.uniformMatrix4fv(u_perspective, false, pMatrix);
    })
}