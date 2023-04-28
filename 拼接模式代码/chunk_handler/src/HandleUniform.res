open GLSLConfigType

let addUniformSendConfig = (add, shaderChunks: shaderChunks) => {
  shaderChunks->Commonlib.ArraySt.reduceOneParam((. sendConfigArr, {variables}) => {
    variables->JsonUtils.isJsonSerializedValueNone
      ? sendConfigArr
      : {
          let {uniforms} = variables->JsonUtils.getJsonSerializedValueExn

          uniforms->JsonUtils.isJsonSerializedValueNone
            ? sendConfigArr
            : uniforms
              ->JsonUtils.getJsonSerializedValueExn
              ->Commonlib.ArraySt.reduceOneParam((. sendConfigArr, {name, field, type_, from}) => {
                add(sendConfigArr, (name, field, type_, from))
              }, sendConfigArr)
        }
  }, [])
}
