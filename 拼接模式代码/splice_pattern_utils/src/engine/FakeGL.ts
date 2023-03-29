export let createFakeWebGLRenderingContext = (): WebGLRenderingContext => {
    return {
        getAttribLocation: (program, name) => 0,
        getUniformLocation: (program, name) => 0,
        useProgram: () => {
            console.log("useProgram")
        },
        bindBuffer: () => {
            console.log("bindBuffer")
        },
        vertexAttribPointer: () => {
            console.log("vertexAttribPointer")
        },
        enableVertexAttribArray: () => {
            console.log("enableVertexAttribArray")
        },
        uniformMatrix4fv: () => {
            console.log("uniformMatrix4fv")
        },
        uniform1i: () => {
            console.log("uniform1i")
        },
        uniform1f: () => {
            console.log("uniform1f")
        },
        uniform3f: () => {
            console.log("uniform3f")
        },
    } as any as WebGLRenderingContext
}
