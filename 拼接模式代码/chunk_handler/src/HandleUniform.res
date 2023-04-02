open GLSLConfigType

let addUniformSendData = (add, shaderChunks: shaderChunks) => {
  shaderChunks->Commonlib.ArraySt.reduceOneParam((. sendDataArr, {variables}) => {
    variables->JsonUtils.isJsonSerializedValueNone
      ? sendDataArr
      : {
          let {uniforms} = variables->JsonUtils.getJsonSerializedValueExn

          uniforms->JsonUtils.isJsonSerializedValueNone
            ? sendDataArr
            : uniforms
              ->JsonUtils.getJsonSerializedValueExn
              ->Commonlib.ArraySt.reduceOneParam((. sendDataArr, {name, field, type_, from}) => {
                add(sendDataArr, (name, field, type_, from))
              }, sendDataArr)
        }
  }, [])
}
