/* TypeScript file generated from GLSLConfigType.res by genType. */
/* eslint-disable import/first */


// tslint:disable-next-line:interface-over-type-literal
export type shaderLibItemName = string;

// tslint:disable-next-line:interface-over-type-literal
export type shaderLibItemType = string;

// tslint:disable-next-line:interface-over-type-literal
export type shaderMapDataValue = string[];

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
export type shaderLibItem = { readonly type_: (undefined | shaderLibItemType); readonly name: shaderLibItemName };

// tslint:disable-next-line:interface-over-type-literal
export type shaderName = string;

// tslint:disable-next-line:interface-over-type-literal
export type shader = { readonly name: shaderName; readonly shaderLibs: shaderLibItem[] };

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
    readonly materialShaders: shader[];
    readonly noMaterialShaders: shader[]
};

// tslint:disable-next-line:interface-over-type-literal
export type glsl = { readonly type_: string; readonly name: string };

// tslint:disable-next-line:interface-over-type-literal
export enum bufferEnum {
    Vertex = 0,
    Normal = 1,
    TexCoord = 2,
    Index = 3,
    Instance_normal_matrix = 4,
    Instance_model_matrix = 5
}

// tslint:disable-next-line:interface-over-type-literal
export type attributeName = string;

// tslint:disable-next-line:interface-over-type-literal
export type attributeType = "vec2" | "vec3" | "vec4";

// tslint:disable-next-line:interface-over-type-literal
export type attribute = {
    readonly name: (undefined | attributeName);
    readonly buffer: bufferEnum;
    readonly type_: (undefined | attributeType)
};

// tslint:disable-next-line:interface-over-type-literal
export type uniformName = string;

// tslint:disable-next-line:interface-over-type-literal
export type uniformField =
    "mMatrix"
    | "vMatrix"
    | "pMatrix"
    | "color"
    | "map";

// tslint:disable-next-line:interface-over-type-literal
export type uniformType = "mat4" | "float3" | "float" | "sampler2D";

// tslint:disable-next-line:interface-over-type-literal
export type uniformFrom = "basicMaterial" | "model" | "camera";

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
export type shaderLib = {
    readonly name: string;
    readonly glsls: (undefined | glsl[]);
    readonly variables: (undefined | variables)
};

// tslint:disable-next-line:interface-over-type-literal
export type shaderLibs = shaderLib[];
