import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import { Fragment, Vertex } from "../shader/basic.glsl"

// export let createProgram = (gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string) => {
export let createProgram = (gl: WebGLRenderingContext) => {
	//glsl
	let vertexShaderSource = Vertex
	let fragmentShaderSource = Fragment

	const vertexShader = getExnFromStrictNull(gl.createShader(gl.VERTEX_SHADER))
	const fragmentShader = getExnFromStrictNull(gl.createShader(gl.FRAGMENT_SHADER))

	gl.shaderSource(vertexShader, vertexShaderSource)
	gl.shaderSource(fragmentShader, fragmentShaderSource)

	gl.compileShader(vertexShader)

	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		let info = gl.getShaderInfoLog(vertexShader)

		if (info === null) info = ""
		throw new Error(info)
	}

	gl.compileShader(fragmentShader)
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		let info = gl.getShaderInfoLog(fragmentShader)

		if (info === null) info = ""
		throw new Error(info)
	}

	const program = getExnFromStrictNull(gl.createProgram())
	gl.attachShader(program, vertexShader)
	gl.attachShader(program, fragmentShader)
	gl.linkProgram(program)

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		let info = gl.getProgramInfoLog(program)

		if (info === null) info = ""
		throw new Error(info)
	}

	return program
}