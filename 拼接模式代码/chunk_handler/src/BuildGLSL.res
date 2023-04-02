open GLSLConfigType

let _get_webgl1_main_begin = () => {
  j`
  void main(void){
  `
}

let _get_webgl1_main_end = () => {
  j`
  }
`
}

let _buildNewLine = () => {
  j`
  `
}

let _getChunk = (chunk, name) => {
  chunk->Commonlib.ImmutableHashMap.getExn(name)
}

let _generateAttributeSource = (generateAttributeType, shaderChunks: shaderChunks) =>
  shaderChunks->Commonlib.ArraySt.reduceOneParam((. result: string, {variables}) => {
    variables->JsonUtils.isJsonSerializedValueNone
      ? result
      : {
          let optionalAttributes = JsonUtils.getJsonSerializedValueExn(variables).attributes

          optionalAttributes->JsonUtils.isJsonSerializedValueNone
            ? result
            : result ++
              optionalAttributes
              ->JsonUtils.getJsonSerializedValueExn
              ->Commonlib.ArraySt.reduceOneParam((. result: string, {name, type_}: attribute) => {
                !(name->JsonUtils.isJsonSerializedValueNone) &&
                !(type_->JsonUtils.isJsonSerializedValueNone)
                  ? {
                      let name = name->JsonUtils.getJsonSerializedValueExn
                      let type_ = type_->JsonUtils.getJsonSerializedValueExn

                      let type_ = generateAttributeType(type_)
                      result ++ j`attribute $type_ $name;
  `
                    }
                  : result
              }, "")
        }
  }, "")

let _isInSource = (key: string, source: string) => Js.String.indexOf(key, source) > -1

let _generateUniformSource = (
  generateUniformType,
  shaderChunks: shaderChunks,
  sourceVarDeclare: string,
  sourceFuncDefine: string,
  sourceBody: string,
) => shaderChunks->Commonlib.ArraySt.reduceOneParam((. result: string, {variables}) => {
    variables->JsonUtils.isJsonSerializedValueNone
      ? result
      : {
          let optionalUniforms = JsonUtils.getJsonSerializedValueExn(variables).uniforms

          optionalUniforms->JsonUtils.isJsonSerializedValueNone
            ? result
            : result ++
              optionalUniforms
              ->JsonUtils.getJsonSerializedValueExn
              ->Commonlib.ArraySt.filter(({name}: uniform) =>
                _isInSource(name, sourceVarDeclare) ||
                (_isInSource(name, sourceFuncDefine) ||
                _isInSource(name, sourceBody))
              )
              ->Commonlib.ArraySt.reduceOneParam((. result: string, {name, type_}: uniform) => {
                let type_ = generateUniformType(type_)
                result ++ j`uniform $type_ $name;
`
              }, "")
        }
  }, "")

let _addNewLine = (segement: string) => {
  segement->Js.String.trim == "" ? segement : _buildNewLine() ++ segement
}

let _setSource = (
  {
    top: sourceTop,
    define: sourceDefine,
    varDeclare: sourceVarDeclare,
    funcDeclare: sourceFuncDeclare,
    funcDefine: sourceFuncDefine,
    body: sourceBody,
  } as sourceChunk: Chunk_converter.ChunkType.glslChunk,
  {
    top,
    define,
    varDeclare,
    funcDeclare,
    funcDefine,
    body,
  }: Chunk_converter.ChunkType.glslChunk,
) => {
  sourceChunk.top = sourceTop ++ _addNewLine(top)
  sourceChunk.define = sourceDefine ++ _addNewLine(define)
  sourceChunk.varDeclare = sourceVarDeclare ++ _addNewLine(varDeclare)
  sourceChunk.funcDeclare = sourceFuncDeclare ++ _addNewLine(funcDeclare)
  sourceChunk.funcDefine = sourceFuncDefine ++ _addNewLine(funcDefine)
  sourceChunk.body = sourceBody ++ _addNewLine(body)

  sourceChunk
}

let _buildBody = ({body}: Chunk_converter.ChunkType.glslChunk) =>
  body ++ _get_webgl1_main_end()

let _buildVarDeclare = (
  generateUniformType,
  {top, varDeclare, funcDefine, body}: Chunk_converter.ChunkType.glslChunk,
  shaderChunks,
) =>
  varDeclare ++
  (_buildNewLine() ++
  _generateUniformSource(generateUniformType, shaderChunks, varDeclare, funcDefine, body))

let _addAlllParts = (
  {
    top,
    define,
    varDeclare,
    funcDeclare,
    funcDefine,
    body,
  }: Chunk_converter.ChunkType.glslChunk,
) => top ++ (define ++ (varDeclare ++ (funcDeclare ++ (funcDefine ++ body))))

let _createEmptyChunk = (): Chunk_converter.ChunkType.glslChunk => {
  top: "",
  define: "",
  varDeclare: "",
  funcDeclare: "",
  funcDefine: "",
  body: "",
}

let _buildVsAndFsByType = (
  (vs, fs),
  (buildGLSLChunkInVS, buildGLSLChunkInFS),
  (type_: glslType, name),
  chunk,
) =>
  switch type_ {
  | #vs => (_setSource(vs, _getChunk(chunk, name)), fs)
  | #vs_function => (_setSource(vs, buildGLSLChunkInVS(name)), fs)
  | #fs => (vs, _setSource(fs, _getChunk(chunk, name)))
  | #fs_function => (vs, _setSource(fs, buildGLSLChunkInFS(name)))
  | _ =>
    Commonlib.Exception.throwErr(
      Commonlib.Exception.buildErr(
        Commonlib.Log.buildFatalMessage(
          ~title="_buildVsAndFsByType",
          ~description=j`unknown glsl type: $type_`,
          ~reason="",
          ~solution=j``,
          ~params=j`name: $name`,
        ),
      ),
    )
  }

let _buildVsAndFs = ((vs, fs), (buildGLSLChunkInVS, buildGLSLChunkInFS), chunk, shaderChunks) =>
  shaderChunks->Commonlib.ArraySt.reduceOneParam(
    (. glslTuple, {glsls}) =>
      JsonUtils.isJsonSerializedValueNone(glsls)
        ? glslTuple
        : glsls
          ->JsonUtils.getJsonSerializedValueExn
          ->Commonlib.ArraySt.reduceOneParam(
            (. sourceTuple, {type_, name}: glsl) =>
              _buildVsAndFsByType(
                sourceTuple,
                (buildGLSLChunkInVS, buildGLSLChunkInFS),
                (type_, name),
                chunk,
              ),
            glslTuple,
          ),
    (vs, fs),
  )

let _buildPrecisionTop = precision => {
  switch precision {
  | #highp => `precision highp float;
precision highp int;`
  | #mediump => `precision mediump float;
precision mediump int;`
  | #lowp => `precision lowp float;
precision lowp int;`
  }
}

let buildGLSL = (
  (
    generateAttributeType: attributeType => string,
    generateUniformType: uniformType => string,
    buildGLSLChunkInVS: glslName => Chunk_converter.ChunkType.glslChunk,
    buildGLSLChunkInFS: glslName => Chunk_converter.ChunkType.glslChunk,
  ),
  shaderChunks: shaderChunks,
  chunk: CommonlibType.ImmutableHashMapType.t<
    glslName,
    Chunk_converter.ChunkType.glslChunk,
  >,
  precision: [#highp | #mediump | #lowp],
): (string, string) => {
  let precisionTop = _buildPrecisionTop(precision)

  let vs = _createEmptyChunk()
  let fs = _createEmptyChunk()

  vs.body = vs.body ++ _get_webgl1_main_begin()
  fs.body = fs.body ++ _get_webgl1_main_begin()
  vs.top = precisionTop ++ vs.top
  fs.top = precisionTop ++ fs.top

  let (vs, fs) = _buildVsAndFs(
    (vs, fs),
    (buildGLSLChunkInVS, buildGLSLChunkInFS),
    chunk,
    shaderChunks,
  )

  vs.body = _buildBody(vs)
  fs.body = _buildBody(fs)
  vs.varDeclare =
    _buildNewLine() ++
    (_generateAttributeSource(generateAttributeType, shaderChunks) ++
    vs.varDeclare)
  vs.varDeclare = _buildVarDeclare(generateUniformType, vs, shaderChunks)
  fs.varDeclare = _buildVarDeclare(generateUniformType, fs, shaderChunks)

  (_addAlllParts(vs), _addAlllParts(fs))
}
