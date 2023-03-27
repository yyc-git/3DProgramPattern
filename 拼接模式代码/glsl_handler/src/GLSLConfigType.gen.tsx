/* TypeScript file generated from GLSLConfigType.res by genType. */
/* eslint-disable import/first */


// tslint:disable-next-line:interface-over-type-literal
export type shaderMapData = { readonly name: string; readonly value: string[] };

// tslint:disable-next-line:interface-over-type-literal
export type dynamicBranchData = {
  readonly name: string; 
  readonly condition: string; 
  readonly pass: (undefined | string); 
  readonly fail: (undefined | string)
};

// tslint:disable-next-line:interface-over-type-literal
export type shaderLibItem = { readonly type_: (undefined | string); readonly name: string };

// tslint:disable-next-line:interface-over-type-literal
export type material_shader = { readonly name: string; readonly shaderLibs: shaderLibItem[] };

// tslint:disable-next-line:interface-over-type-literal
export type no_material_shader = { readonly name: string; readonly shaderLibs: shaderLibItem[] };

// tslint:disable-next-line:interface-over-type-literal
export type shaders = {
  readonly staticBranchs: shaderMapData[]; 
  readonly dynamicBranchs: dynamicBranchData[]; 
  readonly groups: shaderMapData[]; 
  readonly materialShaders: material_shader[]; 
  readonly noMaterialShaders: no_material_shader[]
};

// tslint:disable-next-line:interface-over-type-literal
export type glsl = { readonly type_: string; readonly name: string };

// tslint:disable-next-line:interface-over-type-literal
export type attribute = {
  readonly name: (undefined | string); 
  readonly buffer: number; 
  readonly type_: (undefined | string)
};

// tslint:disable-next-line:interface-over-type-literal
export type uniform = {
  readonly name: string; 
  readonly field: string; 
  readonly type_: string; 
  readonly from: string
};

// tslint:disable-next-line:interface-over-type-literal
export type variables = { readonly uniforms: (undefined | uniform[]); readonly attributes: (undefined | attribute[]) };

// tslint:disable-next-line:interface-over-type-literal
export type shaderLib = {
  readonly name: string; 
  readonly glsls: (undefined | glsl[]); 
  readonly variables: (undefined | variables)
};

// tslint:disable-next-line:interface-over-type-literal
export type shaderLibs = shaderLib[];
