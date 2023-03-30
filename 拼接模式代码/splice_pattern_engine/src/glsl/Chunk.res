
  open Chunk_converter.ShaderChunkType


  let _buildChunk =
      (
        ( top:string, define:string ),
        varDeclare: string,
        ( funcDeclare:string, funcDefine:string ),
        body: string
      ) => {
    {
      top,
      define,
      varDeclare,
      funcDeclare,
      funcDefine,
      body
    }
  };

  let getData = () =>{
  
          "modelMatrix_noInstance_vertex": _buildChunk([``, ``],``,[``, ``],`mat4 mMatrix = u_mMatrix;`,), "modelMatrix_hardware_instance_vertex": _buildChunk([``, ``],``,[``, ``],`mat4 mMatrix = mat4(a_mVec4_0, a_mVec4_1, a_mVec4_2, a_mVec4_3);`,), "modelMatrix_batch_instance_vertex": _buildChunk([``, ``],``,[``, ``],`mat4 mMatrix = u_mMatrix;`,), "webgl1_setPos_mvp": _buildChunk([``, ``],``,[``, ``],`gl_Position = u_pMatrix * u_vMatrix * mMatrix * vec4(a_position, 1.0);`,), "common_vertex": _buildChunk([``, ``],``,[``, `mat2 transpose(mat2 m) {
  return mat2(  m[0][0], m[1][0],   // new col 0
                m[0][1], m[1][1]    // new col 1
             );
  }`],``,), "common_function": _buildChunk([``, ``],``,[``, `mat2 transpose(mat2 m) {
  return mat2(  m[0][0], m[1][0],   // new col 0
                m[0][1], m[1][1]    // new col 1
             );
  }`],``,), "common_fragment": _buildChunk([``, ``],``,[``, ``],``,), "common_define": _buildChunk([``, ``],``,[``, ``],``,), "webgl1_basic_vertex": _buildChunk([``, ``],``,[``, ``],`gl_Position = u_pMatrix * u_vMatrix * mMatrix * vec4(a_position, 1.0);`,), "webgl1_basic_end_fragment": _buildChunk([``, ``],``,[``, ``],`gl_FragColor = vec4(totalColor.rgb, totalColor.a);`,), "webgl1_no_basic_map_fragment": _buildChunk([``, ``],``,[``, ``],`vec4 totalColor = vec4(u_color, 1.0);`,), "webgl1_basic_map_vertex": _buildChunk([``, ``],`varying vec2 v_mapCoord0;`,[``, ``],`v_mapCoord0 = a_texCoord;`,), "webgl1_basic_map_fragment": _buildChunk([``, ``],`varying vec2 v_mapCoord0;`,[``, ``],`vec4 texelColor = texture2D(u_mapSampler, v_mapCoord0);

    vec4 totalColor = vec4(texelColor.rgb * u_color, texelColor.a);`,), 
  }