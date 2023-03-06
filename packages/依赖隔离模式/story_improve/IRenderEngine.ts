//scene为抽象类型，这里用any类型表示
type scene = any;

export interface IRenderEngine {
    createScene(): scene
    ...
}