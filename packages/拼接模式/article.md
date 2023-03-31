<!-- # 着色器语言GLSL太长了 -->

<!-- # 越来越复杂的GLSL代码 -->
# 复杂的Shader
<!-- # 如何管理GLSL？ -->



## 需求


实现一个材质系统，默认支持方向光，并且能选择性地支持贴图、Instance批量渲染


## 实现思路

TODO tu

如上图所示，一个材质对应一个Shader；一个Shader对应一套GLSL，即顶点着色器的GLSL(VS GLSL)和片元着色器的GLSL(FS GLSL)

我们要为选择性支持的每种情况都写一个Shader，也就是4个Shader，分别为：
[支持方向光，支持贴图，支持Instance]
[支持方向光，支持贴图，不支持Instance]
[支持方向光，不支持贴图，支持Instance]
[支持方向光，不支持贴图，支持Instance]


当我们每支持一种新的功能的时候，Shader的个数就要翻倍。手工去写这每一个Shader是不可能的

<!-- 
Map
instance
Direction Light:define Count


实现一个材质系统，我们希望它能够支持各种效果.你会发现随着支持的效果越来越多,需要写的Shader的数量会急剧上升,比如:
　　*.一开始我们希望我们的材质系统能够支持普通光照,我们为这种最简单的效果写一个Shader
　　*.然后我们希望这个材质还可以支持贴图,我们为它再写一个Shader,现在有两个Shader了--[支持普通光照,不支持贴图]和[支持普通光照,支持贴图]
　　*.然后我们希望为它加上骨骼动画,我们需要为已有的Shader各写一个带骨骼动画的版本,这样Shader的个数就变成4个了,分别是:
		[支持普通光照,不支持贴图,不支持骨骼动画]
		[支持普通光照,支持贴图,支持骨骼动画]
		[支持普通光照,支持贴图,不支持骨骼动画]
		[支持普通光照,不支持贴图,支持骨骼动画] -->

<!-- 使用预定义的宏可以比较好的解决这个问题,我们可以写一个长长的容纳各种功能的Shader文件,然后在里面用大量#ifdef/#else/#endif来将各个功能分隔开来,然后在使用Shader时,我们通过指定不同的预定宏的组合来编译这个Shader文件,以得到一个功能被正确裁剪的Shader.既然我们无法在Shader内部里完成动态分支,我们只能让编译器帮我们把各个分支组合编译成一个个静态的Shader了. -->

可以通过使用预定义的宏来解决这个问题。我们只需要写一个很大的能支持各种功能的Shader，通过用大量#ifdef 功能名/#else/#endif来将各个功能分开处理；然后在初始化时，判断材质是否支持某个功能，支持的话则加入"#define 功能名"来开启该功能。这样的话就可以将其分别编译为4个Shader了





## 给出UML

TODO tu

Main是引擎的门户，负责暴露API给Client

InitBasicMaterialShader负责初始化基础材质的Shader，判断材质是否支持功能，支持的话就在默认的GLSL中加入Define变量，然后创建对应的Shader

Render负责渲染，遍历所有的GameObjects，发送它们的顶点数据和Uniform数据



## 给出代码

Client相关代码:
```ts
let state = createState()

let sceneData = createScene(state)
state = sceneData[0]
let [allMaterials, _] = sceneData[1]

state = initBasicMaterialShader(state, allMaterials)

state = initCamera(state)

state = render(state)
```

我们首先创建了引擎的state；
然后创建了场景，主要包括3个材质material1、material2、material3，其中material1、material3都有贴图，material2没有贴图；
然后初始化所有材质的shader；
接着初始化相机，设置相机的假数据；
最后渲染场景

这里值得说明的是因为我们使用ECS模式，所以在场景中创建的所有的GameObject、组件（如BasicMaterial组件、Transform组件）都只是一个number而已

我们看下Main中的createState代码：
```ts
export let createState = (): state => {
    return {
        gl: createFakeWebGLRenderingContext(),
        programMap: Map(),
        maxShaderIndex: 0,
        shaderIndexMap: Map(),
        vMatrix: null,
        pMatrix: null,
        isSupportHardwareInstance: true,
        isSupportBatchInstance: false,
        maxDirectionLightCount: 4,

        ...
    }
}
```

我们构造了假的gl（WebGLRenderContext)；通过设置配置字段isSupportHardwareInstance, isSupportBatchInstance开启了Hardware Instance；设置最大的方向光个数为4个



我们看下InitBasicMaterialShader中的initBasicMaterialShader代码：
```ts
export let initBasicMaterialShader = (state: state, allMaterials: Array<material>): state => {
    let [programMap, shaderIndexMap, _allGLSLs, maxShaderIndex] = allMaterials.reduce(([programMap, shaderIndexMap, glslMap, maxShaderIndex]: any, material) => {
        let glsl = _buildGLSL(state, material)

        let [shaderIndex, newMaxShaderIndex] = generateShaderIndex(glslMap, glsl, maxShaderIndex)

        let program = createFakeProgram(glsl)

        if (!glslMap.has(shaderIndex)) {
            glslMap = glslMap.set(shaderIndex, glsl)
        }

        console.log("glsl:", glsl)
        console.log("shaderIndex:", shaderIndex)

        return [
            programMap.set(shaderIndex, program),
            setShaderIndex(shaderIndexMap, material, shaderIndex),
            glslMap,
            newMaxShaderIndex
        ]
    }, [state.programMap, state.shaderIndexMap, Map(), state.maxShaderIndex])

    return {
        ...state,
        programMap, maxShaderIndex,
        shaderIndexMap: shaderIndexMap
    }
}
```

该函数得到了材质对应的Program，保存在programMap中

这里提出了shaderIndex的概念，它是shader的索引。因为一个shaderIndex对应一个Shader，而一个Shader又对应一套GLSL(VS GLSL和FS GLSL)，所以一个shaderIndex对应一套GLSL

Material、ShaderIndex、Program三者的对应关系如下图所示：
TODO tu

_buildGLSL函数构造了一个Material对应的一套GLSL，它的相关代码如下：
```ts
let _buildDefaultVSGLSL = () => {
    return `
precision lowp float;
precision lowp int;

#ifdef INSTANCE
attribute vec4 a_mVec4_0;
attribute vec4 a_mVec4_1;
attribute vec4 a_mVec4_2;
attribute vec4 a_mVec4_3;
#endif

attribute vec3 a_position;


#ifdef MAP
attribute vec2 a_texCoord;
varying vec2 v_mapCoord0;
#endif


#ifdef BATCH_INSTANCE
uniform mat4 u_mMatrix;
#endif

#ifdef NO_INSTANCE
uniform mat4 u_mMatrix;
#endif

uniform mat4 u_vMatrix;
uniform mat4 u_pMatrix;

mat2 transpose(mat2 m) {
  return mat2(m[0][0], m[1][0],   // new col 0
    m[0][1], m[1][1]    // new col 1
  );
}

void main(void){
#ifdef INSTANCE
  mat4 mMatrix = mat4(a_mVec4_0, a_mVec4_1, a_mVec4_2, a_mVec4_3);
#endif

#ifdef BATCH_INSTANCE
  mat4 mMatrix = u_mMatrix;
#endif

#ifdef NO_INSTANCE
  mat4 mMatrix = u_mMatrix;
#endif

  gl_Position = u_pMatrix * u_vMatrix * mMatrix * vec4(a_position, 1.0);

#ifdef MAP
  v_mapCoord0 = a_texCoord;
#endif
}
    `
}

let _buildDefaultFSGLSL = () => {
    return `
precision lowp float;
precision lowp int;

#ifdef MAP
varying vec2 v_mapCoord0;
uniform sampler2D u_mapSampler;
#endif

uniform vec3 u_color;

void main(void){
#ifdef MAP
  vec4 texelColor = texture2D(u_mapSampler, v_mapCoord0);

  vec4 totalColor = vec4(texelColor.rgb * u_color, texelColor.a);
#endif

#ifdef NO_MAP
  vec4 totalColor = vec4(u_color, 1.0);
#endif

  gl_FragColor = vec4(totalColor.rgb, totalColor.a);
}
    `
}

let _addDefineWithValue = (glsl: string, name: string, value: string): string => {
    return "#define " + name + " " + value + "\n" + glsl
}

let _addDefine = (glsl: string, name: string): string => {
    return "#define " + name + "\n" + glsl
}

let _buildGLSL = (state: state, material: material): [string, string] => {
    let vsGLSL = _buildDefaultVSGLSL()
    let fsGLSL = _buildDefaultFSGLSL()

    if (state.isSupportHardwareInstance) {
        vsGLSL = _addDefine(vsGLSL, "INSTANCE")
    }
    else if (state.isSupportBatchInstance) {
        vsGLSL = _addDefine(vsGLSL, "BATCH_INSTANCE")
    }
    else {
        vsGLSL = _addDefine(vsGLSL, "NO_INSTANCE")
    }

    if (hasBasicMap(state.basicMaterialState, material)) {
        vsGLSL = _addDefine(vsGLSL, "MAP")
        fsGLSL = _addDefine(fsGLSL, "MAP")
    }
    else {
        vsGLSL = _addDefine(vsGLSL, "NO_MAP")
        fsGLSL = _addDefine(fsGLSL, "NO_MAP")
    }

    fsGLSL = _addDefineWithValue(fsGLSL, "MAX_DIRECTION_LIGHT_COUNT", String(state.maxDirectionLightCount))

    return [vsGLSL, fsGLSL]
}
```

该函数首先判断材质是否有贴图以及判断对Instance的支持情况，在默认的GLSL中加入对应的Define变量；
然后需要继续加入支持方向光的代码，为了简化代码，我们只是在FS GLSL中加入了最大方向光个数的define变量；
最后返回修改后的一套GLSL

值得说明的是：这套GLSL是简化后的代码，只给出了一些重点片段代码


我们继续回到initBasicMaterialShader函数，它通过generateShaderIndex来生成shaderIndex：
```ts
        let [shaderIndex, newMaxShaderIndex] = generateShaderIndex(glslMap, glsl, maxShaderIndex)
```

我们看下Shader中的generateShaderIndex代码：
```ts
type glslMap = Map<shaderIndex, glsl>

type glsl = [string, string]

export let generateShaderIndex = (glslMap: glslMap, glsl: glsl, maxShaderIndex: shaderIndex): [shaderIndex, shaderIndex] => {
    let result = glslMap.findEntry((value) => {
        return value[0] == glsl[0] && value[1] == glsl[1]
    })

    if (result === undefined) {
        return [maxShaderIndex, maxShaderIndex + 1]
    }

    return [getExnFromStrictUndefined(result[0]), maxShaderIndex]
}
```

该函数通过比较新的GLSL是否与之前的GLSL相同，如果相同，则返回之前的GLSL对应的shaderIndex；否则返回新的shaderIndex

这样做的目的是使得支持同样功能的材质共享同一个Shader

我们继续来看Client调用的下一个函数：位于Render中的render代码：
```ts
export let render = (state: state): state => {
    let gl = state.gl
    let programMap = state.programMap

    _getAllFakeGameObjects().forEach(gameObject => {
        let material = _getFakeMaterial(state, gameObject)
        let transform = _getFakeTransform(state, gameObject)

        let shaderIndex = getShaderIndex(state.shaderIndexMap, material)

        let program = getExnFromStrictNull(programMap.get(shaderIndex))


        gl.useProgram(program)

        _sendAttributeData(state, shaderIndex, gl, program)
        _sendUniformData(state, transform, material, gl, program)

        console.log("其它渲染逻辑...")
    })

    return state
}
```

该函数遍历所有的GameObject，渲染每个GameObject

在遍历中，首先获得每个gameObject的组件以及shaderIndex、program；
然后发送顶点数据和Uniform数据；
最后执行其它的渲染逻辑


我们看下_sendAttributeData代码：
```ts
let _sendAttributeData = (state: state, shaderIndex: shaderIndex, gl: WebGLRenderingContext, program: WebGLProgram) => {
    let pos = gl.getAttribLocation(program, "a_position")
    if (pos !== -1) {
        gl.bindBuffer(gl.ARRAY_BUFFER, _getFakeArrayBuffer(state, shaderIndex))
        gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(pos)
    }
    pos = gl.getAttribLocation(program, "a_texCoord")
    if (pos !== -1) {
        gl.bindBuffer(gl.ARRAY_BUFFER, 2)
        gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(pos)
    }


    if (state.isSupportHardwareInstance) {
        console.log("发送instance相关的顶点数据1...")
        console.log("发送instance相关的顶点数据2...")
        console.log("发送instance相关的顶点数据3...")
        console.log("发送instance相关的顶点数据4...")
    }


    if (_hasElementArrayBuffer(state, shaderIndex)) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _getFakeElementArrayBuffer(state, shaderIndex))
    }
}
```

该函数通过分支判断来处理各种情况，获得并发送了VBO数据


我们看下_sendUniformData代码：
```ts
let _sendUniformData = (state: state, transform, material, gl: WebGLRenderingContext, program: WebGLProgram) => {
    let pos = getExnFromStrictNull(gl.getUniformLocation(program, "u_vMatrix"))
    sendMatrix4(gl, pos, state.vMatrix)
    pos = getExnFromStrictNull(gl.getUniformLocation(program, "u_pMatrix"))
    sendMatrix4(gl, pos, state.pMatrix)


    pos = getExnFromStrictNull(gl.getUniformLocation(program, "u_color"))
    sendFloat3(gl, pos, getColor(state.basicMaterialState, material))

    if (hasBasicMap(state.basicMaterialState, material)) {
        pos = getExnFromStrictNull(gl.getUniformLocation(program, "u_mapSampler"))
        sendInt(gl, pos, getMapUnit(state.basicMaterialState, material))
    }


    if (state.isSupportBatchInstance || !(state.isSupportHardwareInstance || state.isSupportBatchInstance)) {
        pos = getExnFromStrictNull(gl.getUniformLocation(program, "u_mMatrix"))
        sendMatrix4(gl, pos, getModelMatrix(state.transformState, transform))
    }
}
```


该函数通过判断来处理各种情况，获得并发送了VBO数据

<!-- 该函数从BasicMaterial、Transform组件中获得对应的数据并发送

该函数通过分支判断来处理各种情况，获得并发送了VBO数据 -->

<!-- state = initCamera(state)

state = render(state) -->








<!-- program- shaderIndex

_buildGLSL->_addDefineWithValue
这里为了简化代码，我们通过“在FS GLSL中定义最大的方向光个数”来表示 “支持方向光”

GLSL并不完整

TODO generateShaderIndex -->



TODO 运行代码

## 提出问题


# [解决问题的方案，分析存在的问题]?


## 概述解决方案？
## 给出UML？
## 给出代码？
## 结合UML图，描述如何具体地解决问题？


## 请分析存在的问题?
## 提出改进方向？


# [给出可能的改进方案，分析存在的问题]?



## 概述解决方案？
## 给出UML？
## 给出代码？
## 结合UML图，描述如何具体地解决问题？


## 请分析存在的问题?
## 提出改进方向？


# [给出使用模式的改进方案]

## 概述解决方案
## 遵循哪些设计原则
## 给出UML？
## 给出代码？
## 结合UML图，描述如何具体地解决问题？



# 设计意图

阐明模式的设计目标

# 定义

## 一句话定义？
## 描述定义？
## 通用UML？
## 分析角色？
## 角色之间的关系？
## 角色的抽象代码？
## 遵循的设计原则在UML中的体现？




# 应用

## 优点

## 缺点

## 使用场景


## 实现该场景需要修改模式的哪些角色？
## 使用模式有什么好处？

## 注意事项


# 扩展


# 结合其它模式

## 结合哪些模式？
## 使用场景是什么？
## UML如何变化？
## 代码如何变化？




# 最佳实践

<!-- ## 结合具体项目实践经验，如何应用模式来改进项目？ -->
## 哪些场景不需要使用模式？
## 哪些场景需要使用模式？
## 给出具体的实践案例？



# 更多资料推荐
