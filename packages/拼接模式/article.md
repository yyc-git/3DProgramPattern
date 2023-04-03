[TOC]


# 复杂的Shader


## 需求


实现一个材质系统，默认支持方向光，并且能选择性地支持贴图、Instance(一种批量渲染的技术)


## 实现思路

![image](https://img2023.cnblogs.com/blog/419321/202304/419321-20230403160805774-559164177.png)

如上图所示，一个材质对应一个Shader；一个Shader对应一套GLSL，即一个顶点着色器的GLSL和一个片元着色器的GLSL

我们要为选择性支持的每种情况都写一个Shader，也就是4个Shader，它们分别是：
[支持方向光，支持贴图，支持Instance]
[支持方向光，支持贴图，不支持Instance]
[支持方向光，不支持贴图，支持Instance]
[支持方向光，不支持贴图，不支持Instance]


我们每支持一种新的功能，Shader的个数就要翻倍。手工去写这每一个Shader是不可能的

可以通过使用预定义的宏来解决这个问题。我们只需要写一个很大的能支持各种功能的Shader，通过用大量“#ifdef 功能名/#else/#endif”来将各个功能分开处理；然后在初始化时，判断材质是否支持某个功能，支持的话则加入"#define 功能名"来开启该功能。这样的话就可以将这个大Shader分别编译为4个Shader了





## 给出UML

![image](https://img2023.cnblogs.com/blog/419321/202304/419321-20230403160816959-1182182065.png)

Main是引擎的门户，负责暴露API给Client

InitBasicMaterialShader负责初始化基础材质的Shader，判断材质是否支持功能，支持的话就在默认的有预定义宏的GLSL中加入Define变量；然后使用它创建对应的Shader

Render负责渲染，遍历所有的GameObjects，获得并发送它们的顶点数据和Uniform数据



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

我们首先创建了引擎的state，用来保存引擎的所有数据；
然后创建了场景，主要包括3个基础材质material1、material2、material3，其中material1、material3都有贴图，material2没有贴图；
然后初始化所有基础材质的shader；
接着初始化相机，设置与相机相关的假的视图矩阵和透视矩阵；
最后渲染场景

这里值得说明的是我们这里使用ECS模式的思路，在场景中创建的所有的GameObject、组件（如BasicMaterial组件、Transform组件）都只是一个number而已

我们看下Main中的createState代码：
```ts
export let createState = (): state => {
    return {
        gl: createFakeWebGLRenderingContext(),
        ...
        isSupportInstance: true,
        maxDirectionLightCount: 4,
        ...
    }
}
```

我们构造了假的WebGL上下文-gl；
通过设置配置字段isSupportInstance为true，开启了Instance；
设置最大的方向光个数为4个，这个与支持方向光的Shader有关



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

该函数最终创建了所有的基础材质对应的Program，保存在state.programMap中

这里提出了shaderIndex的概念：它是shader的索引，一个shaderIndex对应一个Shader
<!-- 它们的对应关系为：因为一个shaderIndex对应一个Shader，一个Shader对应一套GLSL(VS GLSL和FS GLSL)，所以一个shaderIndex对应一套GLSL -->

Material、ShaderIndex、Program、GLSL对应关系如下图所示：
![image](https://img2023.cnblogs.com/blog/419321/202304/419321-20230403160828435-1930437553.png)

_buildGLSL函数构造了一个Material对应的一套GLSL，它的实现代码如下：
```ts
let _buildDefaultVSGLSL = () => {
    return `
precision lowp float;
precision lowp int;

#ifdef INSTANCE
attribute vec4 a_mVec4_0;
...
#endif

attribute vec3 a_position;

#ifdef MAP
attribute vec2 a_texCoord;
varying vec2 v_mapCoord0;
#endif

#ifdef NO_INSTANCE
uniform mat4 u_mMatrix;
#endif

uniform mat4 u_vMatrix;
uniform mat4 u_pMatrix;

...
void main(void){
#ifdef INSTANCE
  mat4 mMatrix = mat4(a_mVec4_0, a_mVec4_1, a_mVec4_2, a_mVec4_3);
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

    fsGLSL = _addDefineWithValue(fsGLSL, "MAX_DIRECTION_LIGHT_COUNT", String(state.maxDirectionLightCount))

    return [vsGLSL, fsGLSL]
}
```

该函数首先判断材质是否有贴图以及判断对Instance的支持情况，在默认GLSL中加入对应的Define变量；
然后继续加入支持方向光的GLSL代码，这里为了简化代码，我们只是在FS GLSL中加入了“定义最大方向光个数”的代码；
最后返回修改后的一套GLSL

值得说明的是：这套GLSL是简化后的代码，只给出了一些用于案例展示的代码


我们继续回到initBasicMaterialShader函数，它调用generateShaderIndex函数来生成shaderIndex：
```ts
        let [shaderIndex, newMaxShaderIndex] = generateShaderIndex(glslMap, glsl, maxShaderIndex)
```

我们看下Shader中的generateShaderIndex的实现代码：
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

该函数比较新的GLSL是否与之前的GLSL相同，如果相同，则返回之前的GLSL对应的shaderIndex；否则返回新的shaderIndex

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


    if (state.isSupportInstance) {
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


    if (!state.isSupportInstance){
        pos = getExnFromStrictNull(gl.getUniformLocation(program, "u_mMatrix"))
        sendMatrix4(gl, pos, getModelMatrix(state.transformState, transform))
    }
}
```

该函数首先发送了相机数据；
然后判断了材质对功能的支持情况，从BasicMaterial、Transform组件中获得并发送对应的Uniform数据


下面，我们运行代码，运行结果如下：
```text
shaderIndex: 0
shaderIndex: 1
shaderIndex: 0
useProgram
bindBuffer
vertexAttribPointer
enableVertexAttribArray
bindBuffer
vertexAttribPointer
enableVertexAttribArray
发送instance相关的顶点数据1...
发送instance相关的顶点数据2...
发送instance相关的顶点数据3...
发送instance相关的顶点数据4...
bindBuffer
uniformMatrix4fv
uniformMatrix4fv
uniform3f
uniform1i
其它渲染逻辑...
```

这里首先进行初始化Shader，打印shaderIndex。
我们看到material1、material2、material3的shaderIndex分别为0、1、0，这说明mateiral1和material3正确地共享了同一个shader；


最后进行渲染。
因为渲染render函数中调用的_getAllFakeGameObjects只返回了第一个GameObject，所以只渲染了一次

该次渲染发送的是material1的相关的数据，而material1的Shader是有贴图+支持Instance的

这一次渲染分别进行了下面的操作：
首先use program；

然后发送了a_position、a_texCoord的VBO；

然后发送了instance的顶点数据；

然后通过"bindBuffer"发送了Element Array Buffer;

然后发送了一次相机的视图矩阵u_vMatrix和透视矩阵u_pMatrix数据；

然后发送了一次材质material1的color和map数据；

最后执行其它渲染逻辑



## 提出问题

- Shader组合的方式在引擎端固定死了，用户不能指定如何组合Shader

- 在每次渲染时都要进行分支判断，这样即增加了代码的维护成本（Shader每增加一个#ifdef分支，渲染时也要对应增加该分支的判断），也降低了性能（因为有各种分支跳转，所以降低了CPU的缓存命中）


# [给出使用模式的改进方案]

## 概述解决方案

在引擎端将这个很大的能支持各种功能的默认GLSL分解为多个小块；

在用户端定义Shader的JSON配置文件，指定如何来组合Shader，以及如何获得渲染时发送的顶点数据和Uniform数据


## 给出UML？

![image](https://img2023.cnblogs.com/blog/419321/202304/419321-20230403160841165-629936287.png)

GLSL Config是的Shader的JSON配置文件，它的内容由Client给出，它的格式（也就是类型）由ChunkConverter定义

GLSL Chunk是小块的Shader代码文件，由引擎给出

引擎需要进行预处理，在gulp任务中调用ChunkConverter，将所有的GLSL Chunk代码文件合并为一个Merged GLSL Chunk,它是一个可被调用的Typescript或者Rescript文件

InitBasicMaterialShader仍然负责初始化基础材质的Shader，通过调用ChunkHandler的buildGLSL函数来按照GLSL Config的配置将GLSL Chunk中的对应的小块GLSL拼接为材质的Shader代码-GLSL，然后使用它创建材质的Shader；通过调用ChunkHandler的getSendData函数来从GLSL Config中获得发送的数据-Send Data

Render仍然负责渲染，不过不需要再获得Send Data，而是直接发送之前获得的Send Data




## 结合UML图，描述如何具体地解决问题？

- 现在用户可以通过指定GLSL Config，来指定如何组合Shader了
- 现在在每次渲染时不需要进行分支判断，而是直接遍历发送Send Data即可


## 给出代码

Client定义的GLSL Config包括两个JSON文件：shaders.json和shader_chunks.json，它们的格式定义在ChunkHandler->GLSLConfigType.res中

shaders.json部分代码如下：
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
    }
  ]
}
```

该文件定义了所有Shader的配置数据

下面介绍各个字段的用处：

static_branchs字段定义了所有不会变化的分支判断。比如是否支持Instance就属于这类判断，因为它只跟引擎是否支持Instance，而这是一开始就确定了的，不会在运行时变化

dynamic_branchs字段定义了所有会在运行时变换的分支判断。比如是否支持贴图就属于这类判断，因为材质可能在运行时设置贴图或者移除贴图

groups字段定义了多组代码块；

shaders字段定义了所有的Shader。
此处定义了一个名为render_basic的Shader，它包含的所有的代码块定义在shader_chunks字段中。 
在shader_chunks字段中，如果type为static_branch，那么就通过name关联到static_branchs字段；如果type为dynamic_branch，那么就通过name关联到dynamic_branchs字段；如果type为group，那么就通过name关联到groups字段；如果没有定义type，那么就通过name关联到shader_chunks.json



shader_chunks.json部分代码如下：
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
  {
    "name": "modelMatrix_noInstance",
    "glsls": [
      {
        "type": "vs",
        "name": "modelMatrix_noInstance_vertex"
      }
    ],
    "variables": {
      "uniforms": [
        {
          "name": "u_mMatrix",
          "field": "mMatrix",
          "type": "mat4",
          "from": "model"
        }
      ]
    }
  },
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
  {
    "name": "define_light_count",
    "glsls": [
      {
        "type": "vs_function",
        "name": "defineMaxDirectionLightCount"
      },
      {
        "type": "fs_function",
        "name": "defineMaxDirectionLightCount"
      }
    ]
  },
  ...
]
```

该文件定义了所有代码块的配置数据

下面介绍各个字段的用处：

name字段是代码块的名字，与shaders.json关联

glsls字段定义了VS GLSL和FS GLSL。其中如果type为vs或者fs，则name为VS GLSL或者FS GLSL的文件名，与GLSL Chunk的文件名关联；如果type为vs_function或者fs_function，则name为设置GLSL的动作名。此处为定义最大方向光的个数的动作名

variables字段定义了属于Send Data的顶点数据和Uniform数据




现在看下Client的代码：
```ts
// use json loader to load config
import * as shadersJson from "./glsl_config/shaders.json"
import * as shaderChunksJson from "./glsl_config/shader_chunks.json"
```

这里使用webpack的json loader来加载GLSL Config文件

继续看Client后面的代码：
```ts
//修复json loader关于Array.isArray的bug 
let _fixJsonForArrayBug = (jsonWithArray) => {
    if (Array.isArray(jsonWithArray)) {
        return jsonWithArray
    }

    return (jsonWithArray as any).default
}


let parsedConfig = parseConfig(shadersJson as any, _fixJsonForArrayBug(shaderChunksJson))

```

这里最终是调用ChunkHandler的parseConfig函数来对GLSL Config进行解析。
因为ChunkHandler是Rescript写的，所以需要在parseConfig函数中将JSON文件转换为Rescript的数据格式。
如果ChunkHandler使用Typescript写的，则不需要这一步。


继续看Client后面的代码：
```ts
let state = createState(parsedConfig)

let sceneData = createScene(state)
state = sceneData[0]
let [allMaterials, _] = sceneData[1]

state = initBasicMaterialShader(state, "render_basic", allMaterials)

state = initCamera(state)

state = render(state)
```

这里跟之前类似：
我们首先创建了引擎的state；
然后创建了场景，场景跟之前一样；
然后初始化所有基础材质的shader；
接着初始化相机，设置相机的假数据；
最后渲染场景

这里跟之前不一样的地方是在调用initBasicMaterialShader函数时，传入了"render_basic"这个参数，它用来指定所有的基础材质都使用shaders.json->shaders->render_basic的配置数据

如果引擎再加入更多的材质，比如加入Phong材质，那么Client的代码就会变为：
```ts
state = initBasicMaterialShader(state, "render_basic", allBasicMaterials)
state = initPhongMaterialShader(state, "render_phong", allPhongMaterials)
```

也就是说基础材质对应render_basic Shader，Phong材质对应render_phong Shader


我们看下Main中的createState代码：
```ts
export let createState = ([shaders, shaderChunks]): state => {
    return {
        gl: createFakeWebGLRenderingContext(),
        ...
        shaders,
        shaderChunks,
        isSupportInstance: true,
        maxDirectionLightCount: 4,
        chunk: getData(),
        ...
    }
}
```

这里调用了Merge GLSL Chunk的getData函数来获得所有的GLSL Chunk的数据，将其保存到state.chunk字段

我们介绍下相关的情况：

引擎定义的GLSL Chunk具体为多个.glsl的文件，其中每个文件通过字符@top、@define、@varDeclare、@funcDeclare、@funcDefine、@body以及对应的@end定义了对应的GLSL代码片段

举例来说，我们看下Instance相关的两个.glsl文件：
modelMatrix_instance_vertex.glsl
```ts
@body
mat4 mMatrix = mat4(a_mVec4_0, a_mVec4_1, a_mVec4_2, a_mVec4_3);
@end
```
modelMatrix_noInstance_vertex.glsl
```ts
@body
mat4 mMatrix = u_mMatrix;
@end
```

<!-- 这些.glsl文件是进行了抽象处理的，从而能够被正确地组合起来 -->

在预处理时，引擎通过gulp任务来调用ChunkConverter模块，将所有的.glsl文件合并为一个Merged GLSL Chunk，它具体就是MergedGLSLChunk.ts或者MergedGLSLChunk.res文件

我们来看下MergedGLSLChunk.ts的代码：
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

我们可以看到，getData函数返回了Merged GLSL Chunk数据，它是一个Hash Map，包含了所有的GLSL Chunk的数据


我们继续来看下InitBasicMaterialShader中的initBasicMaterialShader代码：
```ts
export let initBasicMaterialShader = (state: state, shaderName: shaderName, allMaterials: Array<material>): state => {
    let [programMap, sendDataMap, shaderIndexMap, _allGLSLs, maxShaderIndex] = allMaterials.reduce(([programMap, sendDataMap, shaderIndexMap, glslMap, maxShaderIndex]: any, material) => {
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
            state.shaders,
            state.shaderChunks,
            state.chunk,
            shaderName,
            state.precision
        )

        let [shaderIndex, newMaxShaderIndex] = generateShaderIndex(glslMap, glsl, maxShaderIndex)

        let program = createFakeProgram(glsl)

        let sendData = getSendData(
            [(sendDataArr, [name, buffer, type]) => {
                return addAttributeSendData(state.gl, program, sendDataArr, [name, buffer, type as attributeType])
            }, (sendDataArr, [name, field, type, from]) => {
                return addUniformSendData(state.gl, program, sendDataArr, [name, field as uniformField, type as uniformType, from as uniformFrom])
            }],
            shaderChunks
        )

        if (!glslMap.has(shaderIndex)) {
            glslMap = glslMap.set(shaderIndex, glsl)
        }

        ...

        return [
            programMap.set(shaderIndex, program),
            sendDataMap.set(shaderIndex, sendData),
            setShaderIndex(shaderIndexMap, material, shaderIndex),
            glslMap,
            newMaxShaderIndex
        ]
    }, [state.programMap, state.sendDataMap, state.shaderIndexMap, Map(), state.maxShaderIndex])

    return {
        ...state,
        programMap, sendDataMap, maxShaderIndex,
        shaderIndexMap
    }
}
```

该函数首先调用了ChunkHandler的buildGLSL函数，按照shaders.json和shader_chunks.json的配置将MergedGLSLChunk.ts文件中对应的小块GLSL拼接为材质的一套GLSL（即一个VS GLSL和一个FS GLSL），并且经过处理后返回了shaders.json->render_basic->shaderChunks的值；
然后调用了ChunkHandler的getSendData函数，从shaderChunks的值中获得了顶点Send Data和Uniform Send Data，将其保存在state.sendDataMap中


ChunkHandler的buildGLSL函数和getSendData函数都接受了来自引擎的函数（如isNameValidForStaticBranch、addAttributeSendData），它们用于处理shaders.json和shader_chunks.json中的一些字段，从而实现分支处理或者从中获得Send Data。

由于这些字段的值是引擎定义的，所以它们的类型是再次定义在引擎端，明确了有哪些具体的值。
具体的定义在引擎的GLSLConfigType.ts中，代码如下：
```ts
export type shaderMapDataName = "modelMatrix_instance"

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

export type glslNameForBuildGLSLChunk = "defineMaxDirectionLightCount"
```


另外值得注意的是我们对传入buildGLSL的部分函数进行了柯西化。这是因为这些函数的一部分参数需要在此处获得，所以就通过柯西化而将参数传入

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
```


我们继续来看Client调用的下一个函数：位于Render中的render代码：
```ts
export let render = (state: state): state => {
    let gl = state.gl
    let sendDataMap = state.sendDataMap
    let programMap = state.programMap

    _getAllFakeGameObjects().forEach(gameObject => {
        let material = _getFakeMaterial(state, gameObject)
        let transform = _getFakeTransform(state, gameObject)

        let shaderIndex = getShaderIndex(state.shaderIndexMap, material)

        let program = getExnFromStrictNull(programMap.get(shaderIndex))
        let sendData = getExnFromStrictNull(sendDataMap.get(shaderIndex))


        gl.useProgram(program)

        let [attributeSendData, uniformSendData] = sendData

        _sendAttributeData(attributeSendData, state, shaderIndex, gl)
        _sendUniformData(uniformSendData, state, transform, material, gl)

        console.log("其它渲染逻辑...")
    })

    return state
}
```

该函数跟之前几乎是一样的，只是多了从state.sendDataMap获得Send Data

我们看下_sendAttributeData代码：
```ts
let _sendAttributeData = (attributeSendData: Array<attributeSendData>, state: state, shaderIndex: shaderIndex, gl: WebGLRenderingContext) => {
    attributeSendData.forEach(data => {
        if (!!data.elementSendData) {
            data.elementSendData.sendBuffer(gl, _getFakeElementArrayBuffer(state, shaderIndex))
        }
        if (!!data.instanceSendData) {
            console.log("发送instance相关的顶点数据...")
        }
        if (!!data.otherSendData) {
            let { pos, size, sendBuffer, buffer } = data.otherSendData

            sendBuffer(gl, size, pos, _getFakeArrayBuffer(state, buffer, shaderIndex))
        }
    })
}
```

这里直接遍历顶点的Send Data，发送顶点数据


我们看下_sendUniformData代码：
```ts
let _sendUniformData = (uniformSendData: Array<uniformSendData>, state: state, transform, material, gl: WebGLRenderingContext) => {
    uniformSendData.forEach(data => {
        if (!!data.shaderSendData) {
            let { pos, getData, sendData } = data.shaderSendData

            sendData(gl, pos, getData(state))
        }
        if (!!data.renderObjectSendMaterialData) {
            let { pos, getData, sendData } = data.renderObjectSendMaterialData

            sendData(gl, pos, getData(state, material))
        }
        if (!!data.renderObjectSendModelData) {
            let { pos, getData, sendData } = data.renderObjectSendModelData

            sendData(gl, pos, getData(state, transform))
        }
    })
}
```

这里直接遍历Uniform的Send Data，发送Uniform数据


下面，我们运行代码，运行结果如下：
```text
shaderIndex: 0
shaderIndex: 1
shaderIndex: 0
useProgram
bindBuffer
vertexAttribPointer
enableVertexAttribArray
bindBuffer
vertexAttribPointer
enableVertexAttribArray
发送instance相关的顶点数据...
发送instance相关的顶点数据...
发送instance相关的顶点数据...
发送instance相关的顶点数据...
bindBuffer
uniformMatrix4fv
uniformMatrix4fv
uniform3f
uniform1i
其它渲染逻辑...
```

运行结果与之前基本上一样，通过了运行测试

<!-- # 设计意图 -->
<!-- 分解大块数据为小块单位，按照配置文件来拼接 -->


# 定义

## 一句话定义？

<!-- 可配置地拼接小块数据 -->

分解包含各种分支的大数据为小块单位，按照配置文件来拼接


## 描述定义？





## 通用UML？
![](./resources/role_abstract.png)


## 分析角色？

我们来看看拼接模式的相关角色：


- Target Config
该角色是配置数据，用来指定如何拼接数据

- Target Chunk
该角色是小块的数据，它是通过对原始的大数据抽象分解后得到的，一般来说大数据中的一个分支对应一个Target Chunk数据

- Merged Target Chunk
该角色是合并了所有的Target Chunk后的数据，它将所有的Target Chunk文件合并为一个Hash Map

- Target
该角色是拼接后的符合某种特定分支条件的数据，如[支持方向光，支持贴图，支持Instance]的GLSL

- Runtime Data
该角色是运行时数据，它在初始化时从Target Config中获得，在运行时被使用

- ChunkConverter
该角色负责在预处理时合并所有的Target Chunk为一个Merged Target Chunk文件

- ChunkHandler
该角色定义了Target Config的格式（也就是类型），并且实现了拼接Target和获得Runtime Data的相关函数

- Main
该角色为系统的门户，提供API给Client

- Init
该角色实现系统的初始化，调用ChunkHandler->buildTarget来拼接了Target并且直接使用它，调用ChunkHandler->getRuntimeData来获得了Runtime Data

- OperateWhenRuntime
该角色进行某个在运行时的操作，使用了Runtime Data


## 角色之间的关系？

- Target Chunk由系统给出

- Target Config的格式由ChunkHandler定义。其中由系统处理的字段的类型由系统再次定义，目的是定义这些字段的所有可能的值

- Target Config的内容由Client给出




## 角色的抽象代码？

下面我们来看看各个角色的抽象代码：


- 一个Target Chunk的抽象代码
```ts
@part1
...
@end

@part2
...
@end

...
```

- ChunkConverter的抽象代码
```ts
//create MergedTargetChunk.ts
export declare function createMergedTargetChunkForTs(targetChunkPathArr: Array<string>, destFilePath: string, doneFunc): void

//create MergedTargetChunk.res
export declare function createMergedTargetChunkForRes(targetChunkPathArr: Array<string>, destFilePath: string, doneFunc): void
```

- Target Chunk的抽象代码
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

在预处理时，系统调用下面的gulp任务来创建Target Chunk:
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


- Target Config的抽象代码
Target Config应该包含targets_config.json和chunks_config.json两个配置文件，其中前者应该指定有哪些静态分支和动态分支、要构造哪些Target；后者应该指定所有的块的配置数据

targets_config.json如下
```ts
{
  "static_branchs": [
    {
      "name": "xxx",
      "value": [
        "chunk name with condition1",
        "chunk name with condition2",
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

chunks_config.json如下
```ts
[
    {
        "name": "chunk name",
        "target chunk": [
            {
                "type": "xxx",
                "name": "target chunk name"
            },
            ...
        ],
        "runtime data": {
            "data1": [
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

- Client的抽象代码
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

- System的抽象代码
```ts
declare function _handleConfigFunc1(state: state, someConfigData): any

declare function _addRuntimeDataFunc1(someRuntimeDataFromState, someConfigData): any

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

    let runtimeData = ChunkHandler.getRuntimeData(
        [_addRuntimeDataFunc1, ... ],

        target
    )

    return {
        ...state,
        target: target,
        runtimeData: runtimeData
    }
}

export let operateWhenRuntime = (state: state): state => {
    console.log("使用state.runtimeData...")

    return state
}
```

- ChunkHandler的抽象代码
```ts
export declare function parseConfig(configJson: JSON): config

type target = any

export declare function buildTarget(handleConfigFuncs, parsedConfig: config, targetChunk, someConfigData): target

type runtimeData = any

export declare function getRuntimeData(addRuntimeDataFuncs, target: target): runtimeData
```


## 遵循的设计原则在UML中的体现？
    
TODO finish



# 应用

## 优点

- 用户能够灵活地拼接Target数据 
用户能够通过Target Config配置文件，拼接自己想要的Target数据

- 精简的Target数据
拼接后的Target数据没有分支判断，非常精简

- 提高性能
系统能够在初始化时一次性从配置文件中获得Runtime Data，然后在运行时无需进行分支判断而是直接发送Runtime Data，这样就提高了性能



## 缺点

- Target Config配置文件的格式由系统端定义，用户需要遵守该格式来写配置内容，这样增加了一些限制

- 因为Target Chunk使用了自定义的分段字符（如@top），所以无法正确使用该文件的编译检查，如无法正确使用.glsl的shader编译检查




## 使用场景

### 场景描述

系统需要构造包含各种分支的数据

### 解决方案

把每个分支对应的数据都对应分解为一块数据；

由用户给出配置文件来指定：有哪些分支、要构造哪些Target数据、每个Target数据包含哪些块、每块有哪些配置数据

### 具体案例

- 构造引擎的Shader代码

- 构造游戏的地图数据

一张大的世界地图可以分成多个区域，每个区域的地图可以根据各种分支条件来生成，如分支条件可以为是否有水、是否有很多树等。

那么可以将大的世界地图按照区域分解为很多个小地图，然后又把每个小地图按照各种分支条件分解为小块数据

将一个区域的地图数据看作一个Target数据，将每块数据看作一个Target Chunk数据

由用户给出配置文件来指定：要构造哪些区域的地图、每个区域有哪些分支条件、每个区域包含哪些块，每块有哪些配置数据




<!-- ## 实现该场景需要修改模式的哪些角色？
## 使用模式有什么好处？ -->

## 注意事项


- Target Chunk应该进行了适当抽象，从而能够保证在拼接为Target后是正确的

如对于片元着色器的GLSL，有三个GLSL Chunk：basic_map_fragment.glsl, no_basic_map_fragment.glsl, basic_end_fragment.glsl。前两者分别处理有贴图和没有贴图的情况，第三个负责输出到gl_FragColor

如果没有进行抽象的话，前两者的代码可能为：
basic_map_fragment.glsl
```ts
@body
    vec4 texelColor = texture2D(u_mapSampler, v_mapCoord0);

    //对texelColor进行一些处理...
@end
```
no_basic_map_fragment.glsl
```ts
@body
    vec4 color = vec4(u_color, u_alpha);
@end
```

这里的问题是需要在basic_end_fragment.glsl中输出颜色，而两者中的颜色变量名不一样，无法统一地输出颜色。

因此需要进行抽象，抽象出名为“totalColor”变量作为输出的颜色变量。

那么这三个GLSL Chunk的代码就应该修改为：
basic_map_fragment.glsl
```ts
@body
    vec4 texelColor = texture2D(u_mapSampler, v_mapCoord0);

    //对texelColor进行一些处理...

    vec4 totalColor = texelColor;
@end
```
no_basic_map_fragment.glsl
```ts
@body
    vec4 texelColor = vec4(u_color, u_alpha);
@end
```
basic_end_fragment.glsl
```ts
@body
    gl_FragColor = vec4(totalColor.rgb, totalColor.a);
@end
```



# 扩展

我们可以通过扩展配置文件的格式，来支持更灵活的配置

如我们可以在shader_chunks.json->glsls字段中增加值为“custom_vs”的type，从而能够在配置文件中插入用户自定义的GLSL

shader_chunks.json相关代码可以改为：
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
    ],
    ...
  },
```

要实现这个扩展，需要进行下面的修改：
- 修改ChunkHandler->GLSLConfigType.res中glsls的类型
- 修改ChunkHanlder->buildGLSL函数->传入参数，传入来自引擎的新的函数；然后在ChunkHanlder->BuildGLSL->buildGLSL函数中使用该函数来处理type为custom_vs的情况




另外，可以把Target Config配置文件升级成新的Shader语言；把ChunkConverter、ChunkHandler升级为Shader编译器，负责把新的Shader语言编译为GLSL。
这样做的好处是让用户能够更加灵活地自定义Shader，而且还可以进行Shader编译检查




<!-- # 结合其它模式


## 结合哪些模式？
## 使用场景是什么？
## UML如何变化？
## 代码如何变化？ -->




# 最佳实践

<!-- ## 结合具体项目实践经验，如何应用模式来改进项目？ -->
## 哪些场景不需要使用模式？

如果Target数据很单一，那么就只需要一个很大的Target数据即可。

如对于路径追踪渲染而言，它是一个统一的框架，没有什么分支判断，因此只需要一个大的Shader即可。

因为这个大的Shader的代码量可能达到上万行，所以可以使用[slang](https://github.com/shader-slang/slang)这种更容易维护、更模块化的编程语言来写Shader。

slang相当于着色器语言中的Typescript，在原始的着色器语言之上增加了一层编译器，可以编译为GLSL、HLSL等各种着色器语言


<!-- ## 给出具体的实践案例？ -->



# 更多资料推荐

Unity、taichi实现了Shader编译，提出了自己的Shader语言