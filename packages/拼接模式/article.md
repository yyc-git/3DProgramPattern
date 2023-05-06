[TOC]

<!-- # 复杂的Shader -->
# [引入故事，提出问题]


## 需求


我们需要实现一个材质系统，包括两种材质：基础材质、PBR材质，它们都默认支持方向光，并且能选择性地支持贴图、Instance(一种批量渲染的技术)
只是它们支持的贴图不一样，其中基础材质的贴图是普通贴图，PBR材质的贴图是diffuse贴图


## 实现思路

这两种材质支持的功能一共有8种情况，具体如下：
对于基础材质而言：
[支持方向光，支持普通贴图，支持Instance]
[支持方向光，支持普通贴图，不支持Instance]
[支持方向光，不支持普通贴图，支持Instance]
[支持方向光，不支持普通贴图，不支持Instance]
对于PBR材质而言：
[支持方向光，支持diffuse贴图，支持Instance]
[支持方向光，支持diffuse贴图，不支持Instance]
[支持方向光，不支持diffuse贴图，支持Instance]
[支持方向光，不支持diffuse贴图，不支持Instance]


材质与GLSL的对应关系如下图所示：
![image](https://img2023.cnblogs.com/blog/419321/202304/419321-20230403160805774-559164177.png)

一个材质使用一个Shader，一个Shader有一套GLSL，即一个VS GLSL（顶点着色器的GLSL）和一个FS GLSL（片元着色器的GLSL）


我们需要为每一种情况都写一套GLSL，共需写8套GLSL
因为每套GLSL都对应一个Shader，所以最多有8个Shader
<!-- 

一种实现的方案是为选择性支持的每个功能都写一套GLSL，也就是一共写4套GLSL，它们支持的功能分别是：
[支持方向光，支持贴图，支持Instance]
[支持方向光，支持贴图，不支持Instance]
[支持方向光，不支持贴图，支持Instance]
[支持方向光，不支持贴图，不支持Instance] -->


这个方案的问题是材质每支持一种新的功能，GLSL的套数就要翻倍；每增加一种材质，也需要增加GLSL的套数
因为每套GLSL都需要完全从0写，所以会有巨大的实现成本



可以通过“使用预定义的宏”来解决这个问题，具体的方案如下：
我们只需要为每种材质写一套默认的能支持各种功能的GLSL，在其中用大量“#ifdef 功能名/#else/#endif”将各个功能分开处理；
然后在初始化时，判断材质是否支持某个功能，支持的话则在默认的GLSL的基础上加入"#define 功能名"来开启该功能，成为一套新的支持该功能的GLSL。这样的话就可以在默认的GLSL基础上创建出支持各种情况的8套GLSL了
<!-- 然后使用修改后的GLSL创建Shader。这样的话就可以创建出支持各种情况的4个Shader了 -->
<!-- 这样的话就可以将这套GLSL分别编译为4个Shader了 -->

现在要实现8套GLSL，不需要从0实现，而只需在默认的GLSL基础上加入不同的"#define 功能名"即可，大大减少了实现成本





## 给出UML

**领域模型**
![image](https://img2023.cnblogs.com/blog/419321/202305/419321-20230501112227779-1001841548.png)


总体来看，分为用户、GLSL、引擎这三个部分


我们看下用户这个部分：

Client是用户



我们看下GLSL这个部分：


BasicMaterialShaderGLSL（Default）是默认的通过预定义宏来支持基础材质的各种情况的一套GLSL

BasicMaterialShaderGLSL（Add Define）是在BasicMaterialShaderGLSL（Default）基础上加入Define变量，来支持基础材质的某些功能的一套GLSL
最多可有4套BasicMaterialShaderGLSL（Add Define），分别对应基础材质的4种情况


PBRMaterialShaderGLSL（Default）是默认的通过预定义宏来支持PBR材质的各种情况的一套GLSL

PBRMaterialShaderGLSL（Add Define）是在PBRMaterialShaderGLSL（Default）基础上加入Define变量，来支持PBR材质的某些功能的一套GLSL
最多可有4套PBRMaterialShaderGLSL（Add Define），分别对应PBR材质的4种情况




我们看下引擎这个部分：

Engine是引擎的门户，负责提供API给Client
Engine有一个EngineState，用来保存引擎的所有数据；

InitBasicMaterialShader负责初始化所有基础材质的Shader，判断基础材质是否支持功能，支持的话就将BasicMaterialShaderGLSL（Default）修改为BasicMaterialShaderGLSL（Add Define），然后创建对应的Shader

InitPBRMaterialShader跟InitBasicMaterialShader类似，不同的地方是初始化的对象由基础材质变为PBR材质

Render负责渲染，会遍历所有的GameObjects，获得并发送它们的顶点数据和Uniform数据


<!-- 值得注意的是：
这里的材质只有基础材质，这是为了简化案例，实际上可能还会有其它材质，如PBR材质，那么就需要在图中增加对应的一个InitPBRMaterialShader和一个默认的PBRMaterialShaderGLSL（Default）、一个修改后的PBRMaterialShaderGLSL（Add Define）
其中InitPBRMaterialSahder负责初始化PBR材质的Shader，将PBRMaterialShaderGLSL（Default）修改为PBRMaterialShaderGLSL（Add Define） -->



## 给出代码

首先，我们看下Client的代码
然后，我们看下创建EngineState的代码
然后，我们看下创建场景的代码
然后，我们看下初始化所有基础材质的shader的代码
然后，我们看下初始化所有PBR材质的shader的代码
然后，我们看下渲染场景的代码
最后，我们运行代码

### Client的代码


Client
```ts
let state = createState()

let sceneData = createScene(state)
state = sceneData[0]
let [allBasicMaterials, allPBRMaterials, _] = sceneData[1]

state = initBasicMaterialShader(state, allBasicMaterials)

state = initPBRMaterialShader(state, allPBRMaterials)

state = initCamera(state)

state = render(state)
```

Client首先创建了引擎的EngineState；
然后创建了场景；
然后初始化所有基础材质的shader；
然后初始化所有PBR材质的shader；
接着初始化相机，设置与相机相关的假的视图矩阵和透视矩阵；
最后渲染场景

### 创建EngineState的代码

Engine
```ts
export let createState = (): state => {
    return {
        ...
        isSupportInstance: true,
        ...
    }
}
```

createState函数创建并返回了EngineState
在创建的EngineState中：
<!-- 我们构造了假的WebGL上下文-gl； -->
通过设置配置字段isSupportInstance为true，开启了Instance；
<!-- 设置最大的方向光个数为4个，这个配置字段与支持方向光的GLSL有关 -->


### 创建场景的代码

splice_pattern_utils/Client
```ts
export let createScene = (state) => {
    创建gameObject1

    创建基础材质basicMaterial1
    设置basicMaterial1的贴图

    创建transform1
    设置transform1的数据

    挂载basicMaterial1、transform1到gameObject1


    创建gameObject2

    创建PBR材质pbrMaterial1

    创建transform2
    设置transform2的数据

    挂载pbrMaterial1、transform2到gameObject2


    创建gameObject3

    创建基础材质basicMaterial2
    设置basicMaterial2的贴图

    创建transform3
    设置transform3的数据

    挂载basicMaterial2、transform3到gameObject3

    返回state和创建的所有组件
}
```

createScene函数创建了场景，场景包括3个gameObject，2个基础材质组件basicMaterial1、basicMaterial2、1个PBR材质组件pbrMaterial1、3个transform组件
其中basicMaterial1、basicMaterial2有贴图，pbrMaterial1没有贴图；
gameObject1、gameObject3挂载了基础材质组件，gameObject2挂载了PBR材质组件


值得说明的是：
我们这里使用ECS模式的思路，在场景中创建的所有的GameObject和组件都只是一个number类型的值而已


### 初始化所有基础材质的shader的代码

InitBasicMaterialShader
```ts
export let initBasicMaterialShader =
  (state: state, allMaterials: Array<material>): state => {
    let [newProgramMap, newShaderIndexMap, newMaxShaderIndex] = initMaterialShader(state, _buildGLSL, state.basicMaterialShaderIndexMap, allMaterials)

    return {
      ...state,
      programMap: newProgramMap,
      maxShaderIndex: newMaxShaderIndex,
      basicMaterialShaderIndexMap: newShaderIndexMap
    }
  }
```
InitMaterialShaderUtils
```ts
export let initMaterialShader = (state, buildGLSL, shaderIndexMap, allMaterials) => {
    let [newProgramMap, newShaderIndexMap, _, newMaxShaderIndex] = allMaterials.reduce(([programMap, shaderIndexMap, glslMap, maxShaderIndex]: any, material) => {
        let glsl = buildGLSL(state, material)

        let [shaderIndex, newMaxShaderIndex] = generateShaderIndex(glslMap, glsl, maxShaderIndex)

        if (!programMap.has(shaderIndex)) {
            programMap = programMap.set(shaderIndex, createFakeProgram(glsl))
        }

        if (!glslMap.has(shaderIndex)) {
            glslMap = glslMap.set(shaderIndex, glsl)
        }

        console.log("shaderIndex:", shaderIndex)

        return [
            programMap,
            setShaderIndex(shaderIndexMap, material, shaderIndex),
            glslMap,
            newMaxShaderIndex
        ]
    }, [state.programMap, shaderIndexMap, Map(), state.maxShaderIndex])

    return [newProgramMap, newShaderIndexMap, newMaxShaderIndex]
}
```

initBasicMaterialShader函数初始化所有基础材质的shader，它调用InitMaterialShaderUtils的initMaterialShader函数来遍历了所有的基础材质，创建了基础材质使用的shaderIndex和program，将其分别保存在EngineState的basicMaterialShaderIndexMap、programMap中


这里新提出了shaderIndex的概念，它是shader的索引，一个shaderIndex对应一个Shader
<!-- 它们的对应关系为：因为一个shaderIndex对应一个Shader，一个Shader对应一套GLSL(VS GLSL和FS GLSL)，所以一个shaderIndex对应一套GLSL -->

Material、ShaderIndex、Program、GLSL对应关系如下图所示：
![image](https://img2023.cnblogs.com/blog/419321/202305/419321-20230501123700400-921756639.png)

在后面渲染时，我们会首先通过Material拿到ShaderIndex，然后通过ShaderIndex再拿到Program，最后use Program

initBasicMaterialShader函数调用了_buildGLSL函数来构造BasicMaterialShaderGLSL（Add Define），它的实现代码如下：
```ts
let _buildDefaultVSGLSL = () => {
    return `
...
#ifdef INSTANCE
...
#endif

#ifdef NO_INSTANCE
...
#endif

attribute vec3 a_position;

#ifdef MAP
...
#endif

uniform mat4 u_vMatrix;
uniform mat4 u_pMatrix;

...
void main(void){
#ifdef INSTANCE
  mat4 mMatrix = ...
#endif

#ifdef NO_INSTANCE
  mat4 mMatrix = ...
#endif

  gl_Position = u_pMatrix * u_vMatrix * mMatrix * vec4(a_position, 1.0);

#ifdef MAP
  ...
#endif
}
    `
}

let _buildDefaultFSGLSL = () => {
    return `
...
#ifdef MAP
...
#endif

...

void main(void){
#ifdef MAP
  vec4 totalColor = ...
#endif

#ifdef NO_MAP
  vec4 totalColor = ...
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

    if (state.isSupportInstance) {
        vsGLSL = _addDefine(vsGLSL, "INSTANCE")
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

    ...

    return [vsGLSL, fsGLSL]
}
```

_buildGLSL函数首先判断对Instance的支持情况以及判断材质是否有贴图，在BasicMaterialShaderGLSL（Default）的基础上加入对应的Define变量；
<!-- 然后继续加入支持方向光的GLSL代码，这里为了简化代码，我们只是在FS GLSL中加入了“定义最大方向光个数”的代码； -->
最后返回修改后的一套GLSL，即返回BasicMaterialShaderGLSL（Add Define）

<!-- 值得说明的是：
这套GLSL是简化后的代码，仅用于案例展示，不能
只给出了一些用于案例展示的代码 -->


我们继续回到initMaterialShader函数，它在调用传进来的buildGLSL函数（也就是InitBasicMaterialShader的_buildGLSL函数）后，调用了generateShaderIndex函数来生成shaderIndex，相关代码如下：
InitMaterialShaderUtils
```ts
export let initMaterialShader = (state, buildGLSL, shaderIndexMap, allMaterials) => {
        ...
        let glsl = buildGLSL(state, material)

        let [shaderIndex, newMaxShaderIndex] = generateShaderIndex(glslMap, glsl, maxShaderIndex)
        ...
}
```

我们看下generateShaderIndex函数的代码：
Shader
```ts
type vsGLSL = string
type fsGLSL = string

type glsl = [vsGLSL, fsGLSL]

type glslMap = Map<shaderIndex, glsl>

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

generateShaderIndex函数比较新的GLSL是否与之前的GLSL相同，如果不相同，则返回新的shaderIndex；否则返回之前的GLSL对应的shaderIndex

这样做的目的是为了优化，使得支持同样功能的材质共享同一个ShaderIndex，从而共享同一个Program


### 初始化所有PBR材质的shader的代码

InitPBRMaterialShader的initPBRMaterialShader函数实现了初始化所有PBR材质的shader，它与InitPBRMaterialShader的initBasicMaterialShader函数类似，不同的地方主要如下：
传入的allMaterials是所有的PBR材质组件而不是所有的基础材质组件；
传入InitMaterialShaderUtils.initMaterialShader函数的buildGLSL函数不一样，该函数是修改PBRMaterialShaderGLSL（Default）而不是修改BasicMaterialShaderGLSL（Default）；
生成的shaderIndex改为保存到EngineState的pbrMaterialShaderIndexMap中

### 渲染场景的代码

Render
```ts
export let render = (state: state): state => {
    let gl = state.gl
    let programMap = state.programMap

    getAllGameObjects(state.gameObjectState).forEach(gameObject => {
        let [material, materialType_] = getMaterial(state.gameObjectState, gameObject)
        let transform = getTransform(state.gameObjectState, gameObject)

        //不同的材质从不同的shaderIndexMap中取得shaderIndex
        let shaderIndex = null
        switch (materialType_) {
            case materialType.Basic:
                shaderIndex = getShaderIndex(state.basicMaterialShaderIndexMap, material)
                break
            case materialType.PBR:
                shaderIndex = getShaderIndex(state.pbrMaterialShaderIndexMap, material)
                break
        }

        let program = getExnFromStrictUndefined(programMap.get(shaderIndex))

        gl.useProgram(program)

        _sendAttributeData(state, shaderIndex, gl, program)
        _sendUniformData(state, transform, [material, materialType_], gl, program)

        console.log("其它渲染逻辑...")
    })

    return state
}
```

render函数遍历所有的GameObject，渲染每个GameObject

在每次的遍历中，首先获得每个gameObject的组件以及shaderIndex、program；
然后发送顶点数据和Uniform数据；
最后执行其它的渲染逻辑


我们看下发送顶点数据的代码：
Render
```ts
let _sendAttributeData = (state: state, shaderIndex: shaderIndex, gl: WebGLRenderingContext, program: WebGLProgram) => {
    let pos = gl.getAttribLocation(program, "a_position")
    if (pos !== -1) {
        获得并发送Position的VBO
    }
    pos = gl.getAttribLocation(program, "a_texCoord")
    if (pos !== -1) {
        获得并发送TexCoord的VBO
    }

    if (state.isSupportInstance) {
        获得并发送instance相关的VBO
    }

    if (_hasElementArrayBuffer(state, shaderIndex)) {
         绑定ElementArrayBuffer
    }
}
```

_sendAttributeData函数判断了对功能的支持情况，获得并发送了对应的VBO数据


我们看下发送Uniform数据的代码：
Render
```ts
let _sendUniformData = (state: state, transform, [material, materialType_], gl: WebGLRenderingContext, program: WebGLProgram) => {
    获得并发送相机数据

    switch (materialType_) {
        case materialType.Basic:
            获得并发送基础材质的color数据

            if (hasBasicMap(state.basicMaterialState, material)) {
                获得并发送基础材质的普通贴图数据
            }
            break
        case materialType.PBR:
            获得并发送PBR材质的diffuse数据

            if (hasDiffuseMap(state.pbrMaterialState, material)) {
                获得并发送PBR材质的diffuse贴图数据
            }
            break
        default:
            throw new Error()
    }

    if (!state.isSupportInstance) {
        获得并发送模型的数据（如模型矩阵）
    }
}
```

_sendUniformData函数首先获得并发送了相机数据；
然后在判断材质的种类后，根据材质对功能的支持情况，获得并发送了该类材质的数据；
最后判断对Instance的支持情况，如果不支持的话则获得并发送模型矩阵的数据


### 运行代码

下面，我们运行代码，浏览器控制台打印的log如下：
```js
//初始化，打印shaderIndex
shaderIndex: 0
shaderIndex: 0
shaderIndex: 1
//开始渲染第一个gameObject
useProgram
//发送Positiond的VBO
bindBuffer
vertexAttribPointer
enableVertexAttribArray
//发送TexCoord的VBO
bindBuffer
vertexAttribPointer
enableVertexAttribArray
//发送instance相关的VBO
发送instance相关的顶点数据1...
发送instance相关的顶点数据2...
发送instance相关的顶点数据3...
发送instance相关的顶点数据4...
//绑定ElementArrayBuffer
bindBuffer
//发送相机数据
uniformMatrix4fv
uniformMatrix4fv
//发送基础材质的color
uniform3f
//发送基础材质的普通贴图数据
uniform1i
其它渲染逻辑...
//开始渲染第二个gameObject
...
//发送PBR材质的diffuse
uniform3f
//发送PBR材质的diffuse贴图数据
uniform1i
其它渲染逻辑...
//开始渲染第三个gameObject，打印的输出跟“渲染第一个gameObject”打印的输出一样
...
```

这里首先进行初始化Shader，打印生成的shaderIndex
首先打印了生成的所有基础材质（basicMaterial1、basicMaterial2）的shaderIndex，它们都是0，说明这两个材质正确地共享了同一个shader（因为它们都是基础材质的[支持方向光，支持普通贴图，支持Instance]的情况）
然后打印了生成的所有PBR材质（pbrMaterial1）的shaderIndex，它是1，说明这个PBR材质与另外两个基础材质的shader不一样（因为它是PBR材质的[支持方向光，不支持diffuse贴图，支持Instance]的情况）

然后渲染所有的gameObject，因为共有3个gameObject，所以渲染了3次

<!-- 该次渲染发送的是material1的相关数据，而material1的GLSL是有贴图+支持Instance的 -->

第一次渲染的是gameObject1，它挂载了basicMaterial1组件，这次渲染分别进行了下面的操作：
首先use program；
然后发送了a_position、a_texCoord的VBO；
然后发送了instance相关的VBO；
然后绑定了Element Array Buffer;
然后发送了一次相机的视图矩阵u_vMatrix和透视矩阵u_pMatrix数据；
然后发送了一次basicMaterial1的color数据
然后发送了一次basicMaterial1的普通贴图数据；
最后执行其它渲染逻辑

第二次渲染的是gameObject2，它挂载了pbrMaterial1组件，这次渲染与第一次渲染不同的地方是发送的材质数据不同


第三次渲染的是gameObject3，它挂载了basicMaterial3组件，这次渲染打印的输出与第一次渲染打印的输出一样




## 提出问题

- GLSL在引擎端写死了，用户不能自定义GLSL

- 在每次渲染的发送顶点数据和Uniform数据时，要进行分支判断，这样即增加了代码的维护成本（GLSL每增加一个#ifdef分支，渲染时也要对应增加该分支的判断），也降低了性能（因为有各种分支跳转，所以降低了CPU的缓存命中）


# [给出使用模式的改进方案]

## 概述解决方案

- 将支持各种功能的默认GLSL分解为多个小块
- 用户实现GLSL的JSON配置文件，指定如何拼接小块的GLSL，以及指定在渲染时需要发送的顶点数据和Uniform数据的配置数据


## 给出UML？

**领域模型**
![image](https://img2023.cnblogs.com/blog/419321/202305/419321-20230501112230042-1888695031.png)

总体来看，分为用户、数据、ChunkConverter、ChunkHandler、引擎这五个部分

我们看下用户这个部分：

Client是用户

我们看下数据和ChunkConverter这两个部分：

Target GLSL是支持某些功能的一套GLSL，相当于之前的BasicMaterialShaderGLSL（Add Define）或者PBRMaterialShaderGLSL（Add Define），两者的区别是Target GLSL没有预定义的宏，它只有支持的功能的GLSL，没有分支
一套Target GLSL包括了一个VS GLSL和一个FS GLSL
这里最多可有8套Target GLSL，分别对应基础材质的4种情况和PBR材质的4种情况


Send Config是如何获得和发送顶点数据和Uniform数据的配置数据
具体来说，每个Send Config包括了多个getData函数和多个sendData函数，前者获得对应的顶点数据或者Uniform数据，后者发送它们
因为一个Send Config对应一套Target GLSL，所以最多有8个Send Config





GLSL Config是的GLSL的JSON配置文件，用来指定如何拼接Target GLSL，并包括了Send Config
它的内容由用户给出，它的格式（也就是类型）由ChunkHandler定义


GLSL Chunk是一小块的GLSL，有多个GLSL Chunk，它们由引擎给出
一个GLSL Chunk可以是VS GLSL中一小块GLSL文件（如common_vertex.glsl），也可以是FS GLSL中一小块GLSL文件（common_fragment.glsl）


ChunkConverter负责转换GLSL Chunk
因为GLSL Chunk是自定义文件，有一些自定义的语法，不能直接使用，所以引擎需要调用gulp任务来对其预处理。
在gulp任务中，调用了ChunkConverter来处理所有的GLSL Chunk，并将其合并为一个Merged GLSL Chunk，成为一个Typescript或者Rescript文件
<!-- 这样做的原因是GLSL Chunk是自定义的文件，不能直接被Typescript或者Rescript调用，所以需要将其转换为可被调用文件；另外，需要将其集中在一个文件中，方便管理 -->




我们看下ChunkHandler和引擎这两个部分：

ChunkHandler负责拼接Target GLSL和获得Send Config


Engine、Render跟之前一样
<!-- Engine是引擎的门户，负责提供API给Client -->
<!-- Engine有一个EngineState，用来保存引擎的所有数据； -->

InitMaterialShader负责初始化所有材质的Shader，它有两个函数：initBasicMaterialShader、initPBRMaterialShader，分别负责初始化所有基础材质的Shader和初始化所有PBR材质的Shader
这两个函数遍历了所有的基础材质或者PBR材质，在每次遍历中的步骤一样，具体步骤如下：
通过调用ChunkHandler的buildGLSL函数，按照GLSL Config的配置数据将Merged GLSL Chunk中对应的GLSL Chunk拼接为一个Target GLSL，然后使用它创建材质使用的shaderIndex和program；
通过调用ChunkHandler的getSendConfig函数，从GLSL Config中获得Send Config

在遍历结束后，将创建和获得的结果保存到EngineState中


<!-- Render跟之前一样，负责渲染 -->


<!-- 值得注意的是：
之前的InitBasicMaterialShader变成了InitMaterialShader，能够初始化各种材质而不只是基础材质了
这是因为GLSL Config包括了各种材质Shader的GLSL的配置数据，所以InitMaterialShader通过它就可以拼接出对应各种材质Shader的Target GLSL -->



## 结合UML图，描述如何具体地解决问题？


- 现在用户可以通过GLSL Config来自定义GLSL
<!-- 不过自定义的GLSL的内容只能来自引擎端定义的GLSL Chunk
如果用户希望增加自定义的GLSL Chunk，那么引擎可以暴露相关的API给用户 -->
- 现在每次渲染时不需要进行分支判断，而是直接遍历Send Config，通过它的getData、sendData函数来获得和发送数据

<!-- TODO support light material/no material shader -->

## 给出代码

首先，我们看下GLSL Config的代码
然后，我们看下Client的代码
然后，我们看下创建EngineState的代码
然后，我们看下GLSL Chunk和Merged GLSL Chunk的代码
然后，我们看下初始化所有基础材质的shader的代码
然后，我们看下初始化所有PBR材质的shader的代码
然后，我们看下渲染场景的代码
最后，我们运行代码


### GLSL Config的代码

GLSL Config包括两个JSON文件：shaders.json和shader_chunks.json，它们的格式定义在ChunkHandler的GLSLConfigType.res中，它们的内容由用户给出

其中shaders.json文件定义了所有种类的Shader的GLSL配置数据，
shader_chunks.json文件是定义了所有的GLSL Chunk的配置数据

shader_chunks.json是一个数组，其中的每个元素定义了一套GLSL Chunk的配置数据，它最多关联两个GLSL Chunk（分别属于VS GLSL、FS GLSL），并包括了这套GLSL Chunk中顶点、Uniform数据的Send Config


这两个文件的关系是“总-分”的关系，具体如下：
因为每种Shader的GLSL由多个GLSL Chunk组合拼接而成，所以shaders.json是“总”，shader_chunks.json是“分”


下面我们来看下这两个文件的主要代码：

shaders.json的主要代码如下：
```ts
{
  "static_branchs": [
    {
      "name": "modelMatrix_instance",
      "value": [
        "modelMatrix_noInstance",
        "modelMatrix_instance"
      ]
    }
  ],
  "dynamic_branchs": [
    {
      "name": "basic_map",
      "condition": "basic_has_map",
      "pass": "basic_map",
      "fail": "no_basic_map"
    },
    {
      "name": "diffuse_map",
      "condition": "diffuse_has_map",
      "pass": "diffuse_map",
      "fail": "no_diffuse_map"
    }
  ],
  "groups": [
    {
      "name": "top",
      "value": [
        "common",
        ...
      ]
    },
    ...
  ],
  "shaders": [
    {
      "name": "render_basic",
      "shader_chunks": [
        {
          "type": "group",
          "name": "top"
        },
        ...
        {
          "type": "dynamic_branch",
          "name": "basic_map"
        },
        {
          "type": "static_branch",
          "name": "modelMatrix_instance"
        },
        {
          "name": "basic_end"
        },
        ...
      ]
    },
    {
      "name": "render_pbr",
      "shader_chunks": [
        {
          "type": "group",
          "name": "top"
        },
        ...
        {
          "type": "dynamic_branch",
          "name": "diffuse_map"
        },
        {
          "type": "static_branch",
          "name": "modelMatrix_instance"
        },
        ...
      ]
    }
  ]
}
```


下面介绍各个一级字段：

static_branchs字段定义了所有在运行时不会变化的分支判断的配置数据。比如是否支持Instance就属于这类判断，因为它跟引擎是否支持Instance有关，不会在运行时变化
static_branchs字段中的value字段包括了各个分支对应的GLSL Chunk，它们跟shader_chunks.json的数组元素的name关联


dynamic_branchs字段定义了所有在运行时会变化的分支判断的配置数据。比如基础材质和PBR材质是否支持贴图就属于这类判断，因为可能在运行时设置或者移除材质的贴图
dynamic_branchs字段中的condition、pass、fail字段的值分别为条件判断、成功、失败对应的GLSL Chunk，它们跟shader_chunks.json的数组元素的name关联



groups字段定义了多组GLSL Chunk，每组的value字段包括了多个GLSL Chunk，它们跟shader_chunks.json的数组元素的name关联



shaders字段定义了所有种类的Shader的GLSL配置数据

因为一种Shader对应一种材质，目前只有两种材质，所以shaders字段在这里具体定义了两种Shader的GLSL配置数据，分别是name为render_basic和name为render_pbr的配置数据，它们分别对应基础材质和PBR材质

值得说明的是：
实际上也存在没有材质的Shader，如后处理（如绘制轮廓）的Shader、天空盒的Shader等，这些种类的Shader也定义在shaders字段，只是没有对应材质而已。这种Shader我们会在后面的扩展中讨论

每种Shader的GLSL由多个GLSL Chunk组合拼接而成，它们定义在shader_chunks字段中
<!-- groups字段定义了多组GLSL Chunk，每组的value字段包括了多个GLSL Chunk，它们跟shader_chunks.json的name关联 -->
<!-- 此处定义了一个名为render_basic的Shader，它包括的所有的代码块定义在shader_chunks字段中。  -->
在shader_chunks字段中，如果type为static_branch，那么就通过name关联到static_branchs字段；
如果type为dynamic_branch，那么就通过name关联到dynamic_branchs字段；
如果type为group，那么就通过name关联到groups字段；
如果没有定义type，那么就通过name关联到shader_chunks.json的数组元素的name




这些一级字段的关系如下：
shaders字段是主字段，其它的一级字段都只是shaders字段的shader_chunks中对应type的配置数据而已



shader_chunks.json的主要代码如下：
```ts
[
  {
    "name": "common",
    "glsls": [
      {
        "type": "vs",
        "name": "common_vertex"
      },
      {
        "type": "fs",
        "name": "common_fragment"
      }
    ],
    "variables": {
      "uniforms": [
        {
          "name": "u_vMatrix",
          "field": "vMatrix",
          "type": "mat4",
          "from": "camera"
        },
        ...
      ]
    }
  },
  ...
  {
    "name": "modelMatrix_instance",
    "glsls": [
      {
        "type": "vs",
        "name": "modelMatrix_instance_vertex"
      }
    ],
    "variables": {
      "attributes": [
        {
          "name": "a_mVec4_0",
          "buffer": 4,
          "type": "vec4"
        },
        ...
      ]
    }
  },
  ...
]
```

<!-- shader_chunks.json是一个数组，其中的每个元素定义了一个GLSL Chunk的配置数据，它关联了一个GLSL Chunk，并包括了部分的Send Config -->

下面介绍数组元素的各个一级字段：


name字段是一套GLSL Chunk的名称，与shaders.json关联

glsls字段定义了一套GLSL Chunk，其中的如果它的元素的type为vs或者fs，则name分别为属于VS GLSL的GLSL Chunk或者属于FS GLSL的GLSL Chunk的文件名；
<!-- 如果type为vs_function或者fs_function，则name为设置GLSL的动作名。如这里的name为define_light_count的glsls，此处的name是定义最大方向光个数的动作名 -->


variables字段定义了这套GLSL Chunk中顶点、Uniform数据的Send Config


### Client的代码

Client
```ts
let parsedConfig = parseConfig(shadersJson, shaderChunksJson)
```

shadersJson、shadersChunkJson是加载shaders.json、shader_chunks.json后的JSON

这里通过Engine来调用ChunkHandler的parseConfig函数，对GLSL Config进行解析
因为ChunkHandler是Rescript写的，所以需要在parseConfig函数中将JSON转换为Rescript的数据格式-Record
如果ChunkHandler是使用Typescript写的，则不需要parseConfig这一步


继续看Client后面的代码：
```ts
let state = createState(parsedConfig)

let sceneData = createScene(state)
state = sceneData[0]
let [allBasicMaterials, allPBRMaterials, _] = sceneData[1]

state = initBasicMaterialShader(state, [allBasicMaterials, "render_basic"])

state = initPBRMaterialShader(state, [allPBRMaterials, "render_pbr"])

state = initCamera(state)

state = render(state)
```

<!-- 
我们首先创建了引擎的EngineState；
然后创建了场景；
然后初始化所有基础材质的shader；
然后初始化所有PBR材质的shader；
接着初始化相机，设置与相机相关的假的视图矩阵和透视矩阵；
最后渲染场景 -->


<!-- 这里的步骤跟之前一样： -->
<!-- 我们首先创建了引擎的state；
然后创建了场景，场景跟之前一样；
然后初始化所有基础材质的shader；
接着初始化相机，设置相机的假数据；
最后渲染场景 -->

这里的步骤跟之前一样，不一样的地方是：
现在initBasicMaterialShader、initPBRMaterialShader这两个函数是在一个模块（InitMaterialShader）中，而不是分别在两个模块（InitBasicMaterialShader、InitPBRMaterialShader）中；
在调用initBasicMaterialShader、initPBRMaterialShader函数时，分别新传入了"render_basic"、"render_pbr"这个参数，它用来指定使用shaders.json->shaders中对应Shader种类的GLSL配置数据

<!-- 如果引擎再加入更多的材质，比如加入Phong材质，那么Client的代码就会变为：
```ts
state = initBasicMaterialShader(state, "render_basic", allBasicMaterials)
state = initPhongMaterialShader(state, "render_phong", allPhongMaterials)
```

也就是说基础材质对应render_basic Shader，Phong材质对应render_phong Shader -->


### 创建EngineState的代码

Engine
```ts
export let createState = ([shaders, shaderChunks]): state => {
    return {
        ...
        shaders,
        shaderChunks,
        ...
        chunk: getData(),
        ...
    }
}
```

在创建的EngineState中，主要新增了下面的内容：
保存了GLSL Config（shaders、shaderChunks）；
调用了Merged GLSL Chunk的getData函数来获得它的数据，也就是合并后的所有的GLSL Chunk，将其保存到chunk字段中


<!-- ### GLSL Chunk和Merged GLSL Chunk的代码 -->
### GLSL Chunk的说明

<!-- 我们首先看下GLSL Chunk的相关代码；
然后看下合并它们之后的Merged GLSL Chunk的代码 -->


引擎定义的GLSL Chunk具体是后缀名为.glsl的文件
我们通过自定义的字符：@top、@define、@varDeclare、@funcDeclare、@funcDefine、@body以及对应的@end，将一个完整的GLSL分割为从上往下的不同区域的代码片段，这样便于更细粒度的组合拼接

一个GLSL Chunk可以包括多个区域的代码片段

举例来说，我们看下Diffuse贴图相关的.glsl文件：
webgl1_diffuse_map_fragment.glsl
```ts
@varDeclare
varying vec2 v_diffuseMapCoord0;
@end

@body
    vec4 texelColor = texture2D(u_diffuseMapSampler, v_diffuseMapCoord0);

    vec4 totalColor = vec4(texelColor.rgb * u_color, texelColor.a);
@end
```

该GLSL Chunk包括了两个区域（@varDeclare、@body）的代码片段，其中@varDeclare包括了变量声明的代码，@body包括了main函数中的代码

其它区域包括的代码如下：
@top包括了define之前的代码，如精度代码:
```glsl
@top
precision highp float;
@end
```
@define包括了define的代码，如：
```glsl
@define
define B 2;
@end
```
@funcDeclare包括了函数声明的代码，如：
```glsl
@funcDeclare
vec3 getDirectionLightDirByLightPos(vec3 lightPos);
@end
```
@funcDefine包括了函数实现的代码，如：
```glsl
@funcDefine
vec3 getDirectionLightDirByLightPos(vec3 lightPos){
  return lightPos - vec3(0.0);
}
@end
```



一个GLSL Chunk还可以通过"#import 相对路径"来引入其它的GLSL Chunk，如common_vertex.glsl：
```glsl
@define
#import "common_define"
@end

@funcDefine
#import "common_function"
@end
```

它引入了在同一个目录下的common_define的define代码片段和common_function的funcDefine代码片段

我们再来看下定义了所有片段的GLSL Chunk是什么样的：
```glsl
@top
precision highp float;
@end

@define
define B 2;
@end

@varDeclare
varying vec2 v_mapCoord2;
@end

@funcDeclare
vec3 func2(vec3 lightPos);
@end

@funcDefine
vec3 func2(vec3 lightPos){
    return vec3(0.5);
}
@end

@body
gl_FragColor = vec4(1.0,0.5,1.0,1.0);
@end
```
它其实是对下面这个完整的GLSL代码的分割：
```glsl
precision highp float;

define B 2;

varying vec2 v_mapCoord2;

vec3 func2(vec3 lightPos);

vec3 func2(vec3 lightPos){
    return vec3(0.5);
}

void main() {
    gl_FragColor = vec4(1.0,0.5,1.0,1.0);
}
```


组合多个GLSL Chunk具体是做了什么事情？
其实就是将它们对应区域的代码叠加而已，我们看下具体的例子：
有两个GLSL Chunk，它们的代码如下：
chunk1.glsl
```glsl
@varDeclare
varying vec4 v_a;
@end

@body
    vec4 c = v_a;
@end
```
chunk2.glsl
```glsl
@varDeclare
varying vec4 v_b;
@end

@body
    vec4 d = c + v_b;
@end
```

组合chunk1.glsl和chunk2.glsl后，得到的代码如下：
```glsl
@varDeclare
varying vec4 v_a;
varying vec4 v_b;
@end

@body
    vec4 c = v_a;
    vec4 d = c + v_b;
@end
```

### Merged GLSL Chunk的代码

MergedGLSLChunk.ts
```ts
  let _buildChunk =
      (
        [ top, define ]:[string, string],
        varDeclare: string,
        [ funcDeclare, funcDefine ]:[string, string],
        body: string
      ) => {
    return {
      top,
      define,
      varDeclare,
      funcDeclare,
      funcDefine,
      body
    }
  };

  export let getData = () =>{
  
        return {
            "modelMatrix_noInstance_vertex": _buildChunk([``, ``],``,[``, ``],`mat4 mMatrix = u_mMatrix;`,), "modelMatrix_instance_vertex": _buildChunk([``, ``],``,[``, ``],`mat4 mMatrix = mat4(a_mVec4_0, a_mVec4_1, a_mVec4_2, a_mVec4_3);`,), ...
        }
  }
```

可以根据需要（也就是看引擎是用Typescript还是Rescript写的）调用不同的gulp任务，将GLSL Chunk合并为Typescript或者Rescript写的Merged GLSL Chunk文件
这里我们给出的Typescript文件

我们可以看到，getData函数返回了Merged GLSL Chunk的数据，它是一个Hash Map，其中Key是shader_chunks.json的glsls字段中元素的name，也就是GLSL Chunk的文件名；Value是该GLSL Chunk包括的区域的片段代码



### 初始化所有基础材质的shader的代码


InitMaterialShader
```ts
let _initOneMaterialTypeShader = (
    state: state,
    [
      引擎实现的一些函数...
    ]: any,
    allMaterials: Array<material>,
    shaderName: shaderName,
    shaderIndexMap: Map<material, shaderIndex>
) => {
    let [newProgramMap, newSendConfigMap, newShaderIndexMap, _allGLSLs, newMaxShaderIndex] = allMaterials.reduce(([programMap, sendConfigMap, shaderIndexMap, glslMap, maxShaderIndex]: any, material) => {
        let [shaderChunks, glsl] = buildGLSL(
            [
              传入引擎实现的一些函数...
            ],
            state.shaders,
            state.shaderChunks,
            state.chunk,
            shaderName,
            state.precision
        )

        let [shaderIndex, newMaxShaderIndex] = generateShaderIndex(glslMap, glsl, maxShaderIndex)

        if (!programMap.has(shaderIndex)) {
            programMap = programMap.set(shaderIndex, createFakeProgram(glsl))
        }

        ...

        let sendConfig = getSendConfig(
            [
              传入引擎实现的一些函数...
            ],
            shaderChunks
        )

        if (!glslMap.has(shaderIndex)) {
            glslMap = glslMap.set(shaderIndex, glsl)
        }

        console.log("shaderIndex:", shaderIndex)

        return [
            programMap,
            sendConfigMap.set(shaderIndex, sendConfig),
            setShaderIndex(shaderIndexMap, material, shaderIndex),
            glslMap,
            newMaxShaderIndex
        ]
    }, [state.programMap, state.sendConfigMap, shaderIndexMap, Map(), state.maxShaderIndex])

    return [newProgramMap, newSendConfigMap, newShaderIndexMap, newMaxShaderIndex]
}

export let initBasicMaterialShader = (
    state: state,
    [allMaterials, shaderName]: [
        Array<basicMaterial>,
        shaderName
    ]
): state => {
    let [newProgramMap, newSendConfigMap, newShaderIndexMap, newMaxShaderIndex] = _initOneMaterialTypeShader(state,
        [
            传入引擎实现的一些函数...
        ],
        allMaterials, shaderName, state.basicMaterialShaderIndexMap)

    return {
        ...state,
        programMap: newProgramMap,
        sendConfigMap: newSendConfigMap,
        basicMaterialShaderIndexMap: newShaderIndexMap,
        maxShaderIndex: newMaxShaderIndex
    }
}
```


这里“初始化所有基础材质的shader”的步骤跟之前差不多，不一样的地方主要是在遍历所有的基础材质时增加了一步：调用getSendConfig函数


<!-- initBasicMaterialShader函数初始化所有基础材质的shader，它调用InitMaterialShaderUtils的initMaterialShader函数来遍历了所有的基础材质，创建了基础材质使用的shaderIndex和program，将其分别保存在EngineState的basicMaterialShaderIndexMap、programMap中 -->


<!-- 
这两个函数遍历了所有的基础材质或者PBR材质，在每次遍历中的步骤一样，具体步骤如下：
通过调用ChunkHandler的buildGLSL函数，按照GLSL Config的配置数据将Merged GLSL Chunk中对应的GLSL Chunk拼接为Target GLSL，然后使用它创建材质使用的shaderIndex和program；
通过调用ChunkHandler的getSendConfig函数，从GLSL Config中获得Send Config -->


_initOneMaterialTypeShader函数在遍历所有的基础材质时，首先调用了ChunkHandler的buildGLSL函数，按照shaders.json和shader_chunks.json的配置数据将EngineState的chunk（即Merged GLSL Chunk数据）中对应的GLSL Chunk拼接为一个Target GLSL（即返回的glsl变量）；
<!-- 
材质的一套GLSL（即一个VS GLSL和一个FS GLSL），并且经过处理后返回了shaders.json->render_basic->shaderChunks的值； -->
然后调用了ChunkHandler的getSendConfig函数，从GLSL Config（即shaderChunks变量）中获得了相关的顶点、Uniform数据的Send Config，将其保存在EngineState的sendConfigMap中


<!-- 值得说明的是： -->
ChunkHandler的buildGLSL函数和getSendConfig函数都接受了引擎实现的函数，它们被用于处理shaders.json和shader_chunks.json中的一些字段，从而实现分支处理或者从中获得Send Config

因为这些字段的值是离散的，它们的范围是引擎定义的，用户只能从范围内选择某个具体的值，所以这些字段的类型是定义在引擎端，在类型中明确了有哪些值的范围。
<!-- 具体是定义在引擎的GLSLConfigType.ts中，代码如下： -->
类型定义的部分代码如下：
GLSLConfigType
```ts
...
export type condition = "basic_has_map"

export enum attributeBuffer {
    Vertex = 0,
    Normal = 1,
    TexCoord = 2,
    Index = 3,
    Instance_model_matrix = 4
}

export type attributeType = "vec2" | "vec3" | "vec4";

export type uniformField =
    "mMatrix"
    | "vMatrix"
    | "pMatrix"
    | "color"
    | "map";

export type uniformType = "mat4" | "float3" | "float" | "sampler2D";

export type uniformFrom = "basicMaterial" | "model" | "camera";
...
```


<!-- 另外值得注意的是我们对传入buildGLSL的部分函数进行了柯西化。这是因为这些函数的一部分参数需要在此处获得，所以就通过柯西化而将参数传入

相关代码如下：
```ts
        let [shaderChunks, glsl] = buildGLSL(
            [
                [[
                    isNameValidForStaticBranch,
                    curry3_1(getShaderChunkFromStaticBranch)(state)
                ],
                curry3_2(isPassForDynamicBranch)(material, state)],
                [
                    generateAttributeType,
                    generateUniformType,
                    curry2(buildGLSLChunkInVS)(state),
                    curry2(buildGLSLChunkInFS)(state)
                ]
            ],
            ...
        )
``` -->


### 初始化所有PBR材质的shader的代码

InitMaterialShader的initPBRMaterialShader函数实现了初始化所有PBR材质的shader，它与同一个模块的initBasicMaterialShader函数类似，不同的地方主要如下：
传入的allMaterials是所有的PBR材质组件而不是所有的基础材质组件；
传入的shaderName不一样；
传入_initOneMaterialTypeShader函数的“引擎实现的函数”不一样；
生成的shaderIndex改为保存到EngineState的pbrMaterialShaderIndexMap中

### 渲染场景的代码


<!-- 我们继续来看Client调用的下一个函数：位于Render中的render代码： -->
Render
```ts
export let render = (state: state): state => {
    let gl = state.gl
    let sendConfigMap = state.sendConfigMap
    let programMap = state.programMap

    getAllGameObjects(state.gameObjectState).forEach(gameObject => {
        let [material, materialType_] = getMaterial(state.gameObjectState, gameObject)
        let transform = getTransform(state.gameObjectState, gameObject)

        //不同的材质从不同的shaderIndexMap中取得shaderIndex
        let shaderIndex = null
        switch (materialType_) {
            case materialType.Basic:
                shaderIndex = getShaderIndex(state.basicMaterialShaderIndexMap, material)
                break
            case materialType.PBR:
                shaderIndex = getShaderIndex(state.pbrMaterialShaderIndexMap, material)
                break
        }

        let program = getExnFromStrictUndefined(programMap.get(shaderIndex))
        let sendConfig = getExnFromStrictUndefined(sendConfigMap.get(shaderIndex))

        gl.useProgram(program)

        let [attributeSendConfig, uniformSendConfig] = sendConfig

        _sendAttributeData(attributeSendConfig, state, shaderIndex, gl)
        _sendUniformData(uniformSendConfig, state, transform, material, gl)

        console.log("其它渲染逻辑...")
    })

    return state
}
```

render函数跟之前几乎是一样的，只是多了“从EngineState的sendConfigMap中获得Send Config”这一步的代码

我们看下发送顶点数据的代码：
Render
```ts
let _sendAttributeData = (attributeSendConfig: Array<attributeSendConfig>, state: state, shaderIndex: shaderIndex, gl: WebGLRenderingContext) => {
    attributeSendConfig.forEach(data => {
        if (!!data.elementSendConfig) {
            绑定ElementArrayBuffer
        }
        if (!!data.instanceSendConfig) {
            获得并发送instance相关的VBO
        }
        if (!!data.otherSendConfig) {
            获得并发送Position、TexCoord的VBO
        }
    })
}
```


现在_sendAttributeData函数没有分支判断了，而是直接遍历顶点数据的Send Config，获得并发送对应的VBO数据


我们看下发送Uniform数据的代码：
Render
```ts
let _sendUniformData = (uniformSendConfig: Array<uniformSendConfig>, state: state, transform, material, gl: WebGLRenderingContext) => {
    uniformSendConfig.forEach(data => {
        if (!!data.shaderSendConfig) {
            获得并发送相机数据
        }
        if (!!data.renderObjectSendMaterialData) {
            获得并发送材质数据
        }
        if (!!data.renderObjectSendModelData) {
            获得并发送模型的数据（如模型矩阵）
        }
    })
}
```

现在_sendUniformData函数没有分支判断了，而是直接遍历Uniform数据的Send Config，获得并发送对应的Uniform数据


### 运行代码


下面，我们运行代码，浏览器控制台打印的log跟之前基本上一样


<!-- # 设计意图 -->
<!-- 分解大块数据为小块单位，按照配置文件来拼接 -->


# 定义

## 一句话定义？


<!-- 可配置地拼接小块数据 -->

分解有各种分支的大数据为多个小块数据，按照配置文件来拼接


## 补充说明

大数据中的每个分支都可以分解为一块数据，如有下面的一个大数据：
```ts
#ifdef INSTANCE
数据1
#endif

#ifdef NO_INSTANCE
数据2
#endif
```
它有两个分支，可以将其分解为数据1、数据2这两个小块数据


配置文件由用户给出，包括下面的内容：
有哪些分支、要构造哪些Target数据、每个Target数据包括哪些块、每块有哪些配置数据




## 通用UML？

![image](https://img2023.cnblogs.com/blog/419321/202305/419321-20230501112232185-1121387971.png)



## 分析角色？

我们来看看模式的相关角色：

总体来看，分为数据、ChunkConverter、ChunkHandler、系统这四个部分


我们看下数据和ChunkConverter这两个部分：


- Target
该角色是拼接后的符合某种特定分支条件的数据，如[支持方向光，支持贴图，支持Instance]的GLSL就是一个Target

- Runtime Config
该角色是如何操作运行时数据的配置数据
具体来说，每个Runtime Config包括了多个getData函数和多个sendData函数，前者获得对应的运行时数据，后者发送它们
<!-- 因为一个Send Config对应一个Shader，而这里最多有8个Shader，所以最多有8个Send Config -->

<!-- ，它在初始化时从Target Config中获得，在运行时被使用 -->




- Target Config
该角色是配置数据，用来指定如何拼接Target，并包括了Runtime Config
它的内容由用户给出，它的格式（也就是类型）由ChunkHandler定义
Target Config中某些字段的值是离散的，它们的范围是系统定义的，用户只能从范围内选择某个具体的值

- Target Chunk
该角色是小块的数据，由系统给出
<!-- 它是通过对原始的大数据抽象分解后得到的，一般来说大数据中的一个分支对应一个Target Chunk数据 -->




- ChunkConverter
该角色负责在系统预处理处理Target Chunk，并将其合并为一个Merged Target Chunk


- Merged Target Chunk
该角色是合并了所有的Target Chunk后的数据，它是一个Typescript或者Rescript文件



我们看下ChunkHandler和系统这两个部分：

- ChunkHandler
该角色负责拼接Target和获得Runtime Config

- System
该角色为系统的门户，提供API给Client

- Init
该角色实现系统的初始化，它包括下面的步骤：
调用ChunkHandler的buildTarget函数，按照Target Config的配置数据将Merged Target Chunk中对应的Target Chunk拼接为一个Target，然后使用它；
调用ChunkHandler的getRuntimeConfig函数，从Target Config中获得Runtime Config

- OperateWhenRuntime
该角色在运行时进行某个操作（如渲染），使用了Runtime Config



<!-- ## 与之前构造GLSL案例的UML的区别

TODO -->


## 角色之间的关系？

- 有多个Target Chunk

<!-- - Target Config的格式由ChunkHandler定义。其中由系统处理的字段的类型由系统再次定义，目的是定义这些字段的所有可能的值 -->

<!-- - Target Config的内容由Client给出 -->

- Target Config通常包含两个配置文件：targets_config、chunks_config
这两个文件的关系是“总-分”的关系，其中targets_config是“总”，chunks_config是“分”

- 有多个Target，如[支持方向光，支持贴图，支持Instance]的GLSL是一个Target，[支持方向光，不支持贴图，支持Instance]的GLSL是另外一个Target

- 有多个Runtime Config，一个Runtime Config对应一个Target

## 角色的抽象代码？


下面我们来看看各个角色的抽象代码：

首先，我们看下一个Target Chunk的抽象代码
然后，我们看下ChunkConverter的抽象代码
然后，我们看下Merged Target Chunk的抽象代码
然后，我们看下系统的gulp任务的抽象代码
然后，我们看下Target Config的抽象代码
然后，我们看下用户的抽象代码
然后，我们看下系统的抽象代码
最后，我们看下ChunkHandler的抽象代码



- 一个Target Chunk的抽象代码
target_chunk1
```ts
@part1
...
@end

@part2
...
@end

...
```

part1、part2是抽象的自定义字符（实际上可以为任意的字符），用于将一个完整的大数据按照一定的顺序分割为不同区域的片段，这样便于更细粒度的组合拼接



- ChunkConverter的抽象代码
```ts
//create MergedTargetChunk.ts
export declare function createMergedTargetChunkForTs(targetChunkPathArr: Array<string>, destFilePath: string, doneFunc): void

//create MergedTargetChunk.res
export declare function createMergedTargetChunkForRes(targetChunkPathArr: Array<string>, destFilePath: string, doneFunc): void
```

ChunkConverter的API是这两个函数，这里只给出了函数签名
其中，createMergedTargetChunkForTs函数用于创建Typescript写的Merged Target Chunk文件；createMergedTargetChunkForRes函数用于创建Rescript写的Merged Target Chunk文件


- Merged Target Chunk的抽象代码
MergedTargetChunk.ts
```ts
import { chunk } from "chunk_converter_abstract/src/ChunkType";
import { chunkName } from "chunk_handler_abstract/src/type/TargetConfigType";

let _buildChunk =
    (
        part1: string,
        part2: string,
        ...
    ):chunk => {
        return {
            part1,
            part2,
            ...
        }
    };

export let getData = (): Record<chunkName, chunk> => {

    return {
        "target_chunk1": _buildChunk("...", "...", ...),
        ... 
    }
}
```

这是Typescript写的Merged Target Chunk文件的抽象代码

- 系统的gulp任务的抽象代码

在系统预处理时，系统调用下面的gulp任务来创建Merged Target Chunk:
gulpfile.js
```ts
var gulp = require("gulp");
var path = require("path");

//create for typescript
gulp.task("createMergedTargetChunkFile_ts", function (done) {
    var compiler = require("chunk_converter_abstract");

    var chunkFilePath = path.join(process.cwd(), "src/target_chunks/MergedTargetChunk.ts");
    var targetChunkPathArray = [path.join(process.cwd(), "src/target_chunks/**/*")];

    compiler.createMergedTargetChunkFileForTs(targetChunkPathArray, chunkFilePath, done);
});

//create for rescript
gulp.task("createMergedTargetChunkFile_res", function (done) {
    var compiler = require("chunk_converter_abstract");

    var chunkFilePath = path.join(process.cwd(), "src/target_chunks/MergedTargetChunk.res");
    var targetChunkPathArray = [path.join(process.cwd(), "src/target_chunks/**/*")];

    compiler.createMergedTargetChunkFileForRes(targetChunkPathArray, chunkFilePath, done);
});
```
createMergedTargetChunkFile_ts任务用来创建Typescript文件
createMergedTargetChunkFile_res任务用来创建Rescript文件


- Target Config的抽象代码
Target Config通常包括targets_config.json和chunks_config.json这两个配置文件，其中前者应该指定要构造哪些种类的Target、每种Target有哪些Target Chunk；后者应该指定所有的Target Chunk的配置数据

它们的抽象代码如下：
targets_config.json
```ts
{
  "static_branchs": [
    {
      "name": "xxx",
      "value": [
        "chunk name for condition1",
        "chunk name for condition2",
        ...
      ]
    },
    ...
  ],
  "dynamic_branchs": [
    {
      "name": "xxx",
      "condition": "xxx",
      "pass": "chunk name when condition pass",
      "fail": "chunk name when condition fail"
    },
    ...
  ],
  "groups": [
    {
      "name": "xxx",
      "value": [
        "chunk name",
        "chunk name",
        ...
      ]
    },
    ...
  ],
  "targets": [
    {
      "name": "target1",
      "target_chunks": [
        {
          "type": "static_branch | dynamic_branch | group",
          "name": "xxx"
        },
        {
          "name": "chunk name"
        },
        ...
      ]
    }
  ]
}
```

chunks_config.json
```ts
[
    {
        "name": "chunk name",
        "target chunk": [
            {
                "type": "xxx",
                "name": "target chunk's filename"
            },
            ...
        ],
        "runtime config": {
            "runtime data1 config": [
                {
                    xxx
                },
            ],
            ...
        }
    },
    ...
]
```

- 用户的抽象代码
Client
```ts
// use json loader to load target config
import * as targetsConfigJson from "./target_config/targets_config.json"
import * as chunksConfigJson from "./target_config/chunks_config.json"

...

let parsedConfig = parseConfig(targetsConfigJson, chunksConfigJson)

let state = createState(parsedConfig)

declare let someConfigData
state = init(state, someConfigData)

state = operateWhenRuntime(state)
```

这里使用webpack的json loader来加载Target Config文件

- 系统的抽象代码
System
```ts
declare function _handleConfigFunc1(state: state, someConfigData): any

declare function _addRuntimeConfigFunc1(someRuntimeConfigFromState, someConfigData): any

export let parseConfig = ChunkHandler.parseConfig

export let createState = (parsedConfig): state => {
    return {
        parsedConfig: parsedConfig,
        chunk: getData(),

        创建更多字段...
    }
}

export let init = (state: state, someConfigData): state => {
    let target = ChunkHandler.buildTarget(
        [_handleConfigFunc1, ...],

        state.parsedConfig,
        state.chunk,
        someConfigData
    )

    console.log("使用target...")

    let runtimeConfig = ChunkHandler.getRuntimeConfig(
        [_addRuntimeConfigFunc1, ... ],

        target
    )

    return {
        ...state,
        target: target,
        runtimeConfig: runtimeConfig
    }
}

export let operateWhenRuntime = (state: state): state => {
    console.log("使用state.runtimeConfig...")

    return state
}
```

这里的抽象代码直接给出了System、Init、OperateWhenRuntime这三个模块的代码，其中init函数是Init模块的函数，operateWhenRuntime函数是OperateWhenRuntime模块的函数

这里只考虑了只有一个Target和一个Runtime Config的情况，因此init函数中没有进行遍历


- ChunkHandler的抽象代码
```ts
export declare function parseConfig(configJson: JSON): config

type target = any

export declare function buildTarget(handleConfigFuncs, parsedConfig: config, targetChunk, someConfigData): target

type runtimeConfig = any

export declare function getRuntimeConfig(addRuntimeConfigFuncs, target: target): runtimeConfig
```

ChunkHandler的API是这三个函数，这里只给出了函数签名



## 遵循的设计原则在UML中的体现？
    
拼接模式主要遵循下面的设计原则：

- 单一职责原则
每个Target Chunk只是一个分支的数据
- 合成复用原则
Target组合了多个Target Chunk
- 依赖倒置原则
组合Target Chunk的顺序定义在抽象的Target Config中，而不是通过预定义宏的方式写死在Target中
- 最少知识原则
各个Target相互独立
- 开闭原则
要改变Target Chunk的组合顺序，只需要调整配置数据，无需修改代码
要增加一种Target，只需要在Target Config的targets_config.json的targets字段中增加该种类的配置数据、系统增加对应的Target Chunk、系统的Init增加对应的初始化函数，无需修改代码




# 应用

## 优点

- 用户能够灵活地拼接Target
用户能够通过Target Config配置文件，拼接自己想要的Target

- 精简的Target
拼接后的Target没有分支判断，非常精简

- 提高性能
系统能够在初始化时一次性从配置文件中获得Runtime Config，然后在运行时无需进行分支判断，而是直接遍历Runtime Config，通过它的getData、sendData函数来获得和发送运行时的数据，从而提高运行时的性能




## 缺点

- Target Config配置文件的格式由系统端定义，用户需要遵守该格式来写配置内容，这样会有一些限制

- 因为Target Chunk使用了自定义的分段字符（如@top），所以无法正确使用该文件的编译检查，如无法正确使用Shader编译检查




## 使用场景

### 场景描述

系统需要构造包括各种分支的数据

### 具体案例

- 构造引擎的着色器代码，其中构造的着色器代码不仅包括GLSL，也包括HLSL、WGSL等

- 构造游戏的地图数据

一张大的世界地图根据各种分支条件来生成，其中分支条件可以为是否有水、是否有树等

可以将世界地图按照分支分为多个小块数据

其中，包含某些分支的一个世界地图是一个Target；每个小块数据是一个Target Chunk

另外，因为世界地图包括了不同的区域，因此可以通过自定义字符，将一个完整的Target分割为不同区域的数据

一个Target Chunk可以包括多个区域的数据

如下面是根据“是否有水”的分支分解而成的两个Target Chunk的参考代码：
有水.map
```ts
@区域1
有水的数据1
@end

@区域2
有水的数据2
@end
```
无水.map
```ts
@区域1
无水的数据1
@end

@区域2
无水的数据2
@end
```

<!-- 
一张大的世界地图可以分成多个区域，每个区域的地图可以根据各种分支条件来生成，其中分支条件可以为是否有水、是否有树等

那么可以将大的世界地图按照区域分解为很多个小地图，然后又把每个小地图按照各种分支条件分解为小块数据

其中，包含某些区域的一个世界地图是一个Target； -->

<!-- 将一个区域的地图数据看作一个Target数据，将每块数据看作一个Target Chunk数据 -->


由用户给出Target Config，其中的targets_config.json应该指定要构造哪些种类的世界地图、每种世界地图有哪些Target Chunk，chunks_config.json应该指定所有的Target Chunk的配置数据


<!-- ## 实现该场景需要修改模式的哪些角色？
## 使用模式有什么好处？ -->

## 注意事项


- Target Chunk应该进行了适当抽象，从而能够保证在组合拼接为Target后是正确的

如有三个属于VS GLSL的GLSL Chunk：basic_map_fragment.glsl, no_basic_map_fragment.glsl, basic_end_fragment.glsl，其中前两个分别处理有贴图和没有贴图的情况，第三个负责输出到gl_FragColor
我们需要组合前两个中的一个GLSL Chunk、第三个GLSL Chunk

如果没有进行抽象的话，前两个的代码可能为：
basic_map_fragment.glsl
```glsl
@body
    vec4 texelColor = texture2D(u_mapSampler, v_mapCoord0);

    //对texelColor进行一些处理...
@end
```
no_basic_map_fragment.glsl
```glsl
@body
    vec4 color = vec4(u_color, u_alpha);
@end
```

这里的问题是需要在basic_end_fragment.glsl中输出颜色，因为这两个中的颜色变量名不一样，所以无法统一地输出颜色。

因此需要进行抽象，抽象出名为“totalColor”变量作为输出的颜色变量。

那么这三个GLSL Chunk的代码就应该修改为：
basic_map_fragment.glsl
```glsl
@body
    vec4 texelColor = texture2D(u_mapSampler, v_mapCoord0);

    //对texelColor进行一些处理...

    vec4 totalColor = texelColor;
@end
```
no_basic_map_fragment.glsl
```glsl
@body
    vec4 totalColor = vec4(u_color, u_alpha);
@end
```
basic_end_fragment.glsl
```glsl
@body
    gl_FragColor = vec4(totalColor.rgb, totalColor.a);
@end
```

有两种组合的情况，它们的代码如下：
basic_map_fragment.glsl+basic_end_fragment.glsl
```glsl
@body
    vec4 texelColor = texture2D(u_mapSampler, v_mapCoord0);

    //对texelColor进行一些处理...

    vec4 totalColor = texelColor;

    gl_FragColor = vec4(totalColor.rgb, totalColor.a);
@end
```
no_basic_map_fragment.glsl+basic_end_fragment.glsl
```glsl
@body
    vec4 totalColor = vec4(u_color, u_alpha);

    gl_FragColor = vec4(totalColor.rgb, totalColor.a);
@end
```

我们看到，现在这两种组合后的代码都能正确将totalColor变量输出到gl_FragColor




# 扩展


<!-- - Target Config配置文件的格式由系统端定义，用户需要遵守该格式来写配置内容，这样会有一些限制 -->

<!-- ## 支持更灵活的配置 -->

## 自定义Target Chunk

现在Target Chunk是由系统定义的，用户不能定义自己的Target Chunk

有下面两个思路来实现用户自定义Target Chunk：
1.扩展Target Config
<!-- ，来支持更灵活的配置 -->

如我们可以在shader_chunks.json->glsls字段中增加值为“custom_vs”和“custom_fs”的type，从而插入用户自定义的属于VS GLSL和FS GLSL的GLSL Chunk

shader_chunks.json相关代码如下：
```ts
  {
    ...,
    "glsls": [
      {
        "type": "custom_vs",
        "content":{
            "top":"xxx",
            "define":"xxx",
            "varDeclare":"xxx",
            "funcDeclare":"xxx",
            "funcDefine":"xxx",
            "body":"xxx"
        }
      },
      {
        "type": "custom_fs",
        "content":{
            "top":"xxx",
            "define":"xxx",
            "varDeclare":"xxx",
            "funcDeclare":"xxx",
            "funcDefine":"xxx",
            "body":"xxx"
        }
      },
    ],
    ...
  },
```

要实现这个扩展，需要进行下面的修改：
- 修改ChunkHandler的GLSLConfigType.res中glsls的类型，使其支持该type
- 修改ChunkHanlder的buildGLSL函数的传入参数，传入来自引擎的新的函数；然后在ChunkHanlder的buildGLSL函数中使用传入的新函数来处理type为custom_vs、custom_fs的情况


2.系统提供增加Target Chunk的API给用户

如引擎提供下面的API，来加入一个GLSL Chunk：
```ts
addGLSLChunk(engineState, {top, define, varDeclare, funcDeclare, funcDefine, body}, glslChunkFileName)
```

然后用户就可以在GLSL Config中使用文件名为指定的glslChunkFileName的GLSL Chunk



## 在GLSL Config中定义没有材质的Shader的Target GLSL

之前提到了没有材质的Shader，现在来讨论一下实现的细节

我们将没有材质的Shader定义在shaders.json的shaders字段中，代码如下所示：
shaders.json
```ts
"shaders": [
  {
    "name": "no_material_shader1",
    "shader_chunks": [
      ...
    ]
  },
  {
    "name": "no_material_shader2",
    "shader_chunks": [
      ...
    ]
  },
  ...
]
```

这里定义了两种没有材质的Shader

然后在引擎的InitMaterialShader模块中增加initNoMaterialShader函数，并在Client中调用它来初始化
Client
```ts
state = initNoMaterialShader(state,  "no_material_shader1")
state = initNoMaterialShader(state,  "no_material_shader2")
```

这里Client调用了两次InitMaterialShader的initNoMaterialShader函数来分别初始化第一种和第二种没有材质的Shader

“初始化没有材质的Shader”跟“初始化有材质的Shader”的区别是：
不需要“所有的材质”这个参数；
InitMaterialShader的initNoMaterialShader函数跟初始化有材质的Shader的函数（如initBasicMaterialShader）差不多，只是没有遍历allMaterials，也无需生成shaderIndex，而是只创建了一个Shader（也就是一个Program），将其保存到EngineState的一个Hash Map中，它的Key是shaderName（也就是  "no_material_shader1"或者  "no_material_shader2"），Value是Shader（具体就是Program）



## 构造DX12、Vulkan、WebGPU等现代图形API的着色器代码

构造现代图形API的着色器代码（如WebGPU的WGSL）与构造GLSL的区别主要是Send Config不同，因此可以在构造GLSL案例代码的基础上，修改下Send Config相关的代码和配置，增加对UBO、SSBO等新种类的着色器数据的支持





## 升级为着色器语言

可以把Target Config配置文件升级成新的着色器语言；
把ChunkConverter、ChunkHandler升级为编译器，负责把新的着色器语言编译为GLSL

这样做的好处是让用户能够更加灵活地自定义着色器代码，而且还可以正确地使用Shader编译检查



<!-- # 结合其它模式


## 结合哪些模式？
## 使用场景是什么？
## UML如何变化？
## 代码如何变化？ -->




# 最佳实践

<!-- ## 结合具体项目实践经验，如何应用模式来改进项目？ -->
## 哪些场景不需要使用模式？

如果大数据没有多少分支，那么不需要使用该模式来将其分解

如对于路径追踪渲染而言，它是一个统一的框架，没有什么分支判断，因此只需要一套大的GLSL即可

但是，因为这套大的GLSL的代码量可能达到上万行，所以可以使用[slang](https://github.com/shader-slang/slang)提供的更容易维护、更模块化的编程语言来实现着色器代码，并将其编译为GLSL

slang相当于着色器语言中的Typescript，它在原始的着色器语言之上增加了一层编译器，实现了一个新的着色器语言。slang可以将其编译为GLSL、HLSL等各种原始的着色器语言


<!-- ## 给出具体的实践案例？ -->



# 更多资料推荐

Unity实现了拼接模式的扩展，提出了自己的着色器语言