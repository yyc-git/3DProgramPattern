export let sendMatrix4 = (gl, pos: WebGLUniformLocation, value: Float32Array) => gl.uniformMatrix4fv(pos, false, value)

export let sendInt = (gl, pos: WebGLUniformLocation, value: number) => gl.uniform1i(pos, value)

export let sendFloat1 = (gl, pos: WebGLUniformLocation, value: number) => gl.uniform1f(pos, value)

export let sendFloat3 = (gl, pos: WebGLUniformLocation, [x, y, z]: [number, number, number]) => gl.uniform3f(pos, x, y, z)
