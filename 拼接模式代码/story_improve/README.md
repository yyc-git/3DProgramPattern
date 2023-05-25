# 如何运行代码

```js
npm run webpack:dev-server
```

# 代码说明

shader_chunks.json
```ts
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
```

如上面的代码所示，如果shader_chunks.json中的type为vs_function或者fs_function，则name为设置GLSL的动作名，如name（defineMaxDirectionLightCount）是定义最大方向光个数的动作名

这种type的glsl会在splice_pattern_engine/MaterialShaderGLSLUtils的buildGLSLChunkInVS、buildGLSLChunkInFS函数中处理