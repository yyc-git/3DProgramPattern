export let createVBOs = (gl: WebGLRenderingContext) => {
    let vertices = new Float32Array([
        0.0, 0.1, 0.0,
        -0.1, 0.0, 0.0,
        0.1, 0.0, 0.0
    ])

    let indices = new Uint8Array([
        0, 1, 2
    ])

    let verticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    let indicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return {
        verticesBuffer,
        indicesBuffer
    }
}