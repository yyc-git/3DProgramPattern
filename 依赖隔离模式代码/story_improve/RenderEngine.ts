//scene为抽象类型
//这里用any类型表示抽象类型
type scene = any

export interface RenderEngine {
    createScene(): scene
    ...
}