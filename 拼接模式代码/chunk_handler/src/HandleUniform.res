open GLSLConfigType

let addUniformSendMetadata = (add, shaderChunks: shaderChunks) => {
  shaderChunks->Commonlib.ArraySt.reduceOneParam((. sendMetadataArr, {variables}) => {
    variables->JsonUtils.isJsonSerializedValueNone
      ? sendMetadataArr
      : {
          let {uniforms} = variables->JsonUtils.getJsonSerializedValueExn

          uniforms->JsonUtils.isJsonSerializedValueNone
            ? sendMetadataArr
            : uniforms
              ->JsonUtils.getJsonSerializedValueExn
              ->Commonlib.ArraySt.reduceOneParam((. sendMetadataArr, {name, field, type_, from}) => {
                add(sendMetadataArr, (name, field, type_, from))
              }, sendMetadataArr)
        }
  }, [])
}
