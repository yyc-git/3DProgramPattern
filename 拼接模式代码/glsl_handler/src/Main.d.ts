import { shaderLibs, shaders } from "./GLSLConfigType.gen";

// export function load(shadersJsonPath: string, shaderLibsJsonPath: string): Promise<[shaders, shaderLibs]>

export function parse(shadersJson: JSON, shaderLibsJson: JSON): [shaders, shaderLibs]