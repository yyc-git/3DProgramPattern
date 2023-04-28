TODO explain

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

如果type为vs_function或者fs_function，则name为设置GLSL的动作名。如这里name为define_light_count的glsls，它里面的name是定义最大方向光个数的动作名

这种type的glsl会在splice_pattern_engine->MaterialShaderGLSLUtils的buildGLSLChunkInVS、buildGLSLChunkInFS函数中处理