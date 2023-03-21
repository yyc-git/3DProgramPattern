export const Vertex = `
	attribute vec3 a_position;
	uniform mat4 u_projection;
	uniform mat4 u_view;
	uniform mat4 u_model;
	void main() {
		gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);
	}
`;
export const Fragment = `
	precision mediump float;

	uniform vec3 u_color;

	void main() {
		gl_FragColor = vec4(u_color, 1.0);
	}
`;