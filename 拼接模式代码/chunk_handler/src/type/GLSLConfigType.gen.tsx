/* TypeScript file generated from GLSLConfigType.res by genType. */
/* eslint-disable import/first */


// tslint:disable-next-line:interface-over-type-literal
export type shaderChunkName = string;

// tslint:disable-next-line:interface-over-type-literal
export type shaderChunkItemName = string;

// tslint:disable-next-line:interface-over-type-literal
export type shaderChunkItemType = string;

// tslint:disable-next-line:interface-over-type-literal
export type shaderMapDataValue = shaderChunkName[];

// tslint:disable-next-line:interface-over-type-literal
export type shaderMapDataName = string;

// tslint:disable-next-line:interface-over-type-literal
export type shaderMapData = { readonly name: shaderMapDataName; readonly value: shaderMapDataValue };

// tslint:disable-next-line:interface-over-type-literal
export type condition = string;

// tslint:disable-next-line:interface-over-type-literal
export type dynamicBranchData = {
  readonly name: string; 
  readonly condition: condition; 
  readonly pass: (undefined | string); 
  readonly fail: (undefined | string)
};

// tslint:disable-next-line:interface-over-type-literal
export type shaderChunkItem = { readonly type_: (undefined | shaderChunkItemType); readonly name: shaderChunkItemName };

// tslint:disable-next-line:interface-over-type-literal
export type shaderName = string;

// tslint:disable-next-line:interface-over-type-literal
export type shader = { readonly name: shaderName; readonly shaderChunks: shaderChunkItem[] };

// tslint:disable-next-line:interface-over-type-literal
export type staticBranchs = shaderMapData[];

// tslint:disable-next-line:interface-over-type-literal
export type dynamicBranchs = dynamicBranchData[];

// tslint:disable-next-line:interface-over-type-literal
export type groups = shaderMapData[];

// tslint:disable-next-line:interface-over-type-literal
export type shaders = {
  readonly staticBranchs: staticBranchs; 
  readonly dynamicBranchs: dynamicBranchs; 
  readonly groups: groups; 
  readonly shaders: shader[]
};

// tslint:disable-next-line:interface-over-type-literal
export type glslName = string;

// tslint:disable-next-line:interface-over-type-literal
export type glslType = "vs" | "vs_function" | "fs" | "fs_function";

// tslint:disable-next-line:interface-over-type-literal
export type glsl = { readonly type_: glslType; readonly name: glslName };

// tslint:disable-next-line:interface-over-type-literal
export type attributeName = string;

// tslint:disable-next-line:interface-over-type-literal
export type attributeType = string;

// tslint:disable-next-line:interface-over-type-literal
export type attributeBuffer = number;

// tslint:disable-next-line:interface-over-type-literal
export type attribute = {
  readonly name: (undefined | attributeName); 
  readonly buffer: attributeBuffer; 
  readonly type_: (undefined | attributeType)
};

// tslint:disable-next-line:interface-over-type-literal
export type uniformName = string;

// tslint:disable-next-line:interface-over-type-literal
export type uniformField = string;

// tslint:disable-next-line:interface-over-type-literal
export type uniformType = string;

// tslint:disable-next-line:interface-over-type-literal
export type uniformFrom = string;

// tslint:disable-next-line:interface-over-type-literal
export type uniform = {
  readonly name: uniformName; 
  readonly field: uniformField; 
  readonly type_: uniformType; 
  readonly from: uniformFrom
};

// tslint:disable-next-line:interface-over-type-literal
export type variables = { readonly uniforms: (undefined | uniform[]); readonly attributes: (undefined | attribute[]) };

// tslint:disable-next-line:interface-over-type-literal
export type shaderChunk = {
  readonly name: shaderChunkName; 
  readonly glsls: (undefined | glsl[]); 
  readonly variables: (undefined | variables)
};

// tslint:disable-next-line:interface-over-type-literal
export type shaderChunks = shaderChunk[];
