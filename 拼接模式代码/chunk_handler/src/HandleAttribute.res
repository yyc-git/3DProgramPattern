open GLSLConfigType

let addAttributeSendData = (add, shaderChunks: shaderChunks) => {
  shaderChunks->Commonlib.ArraySt.reduceOneParam((. sendDataArr, {variables}) => {
    variables->JsonUtils.isJsonSerializedValueNone
      ? sendDataArr
      : {
          let {attributes} = variables->JsonUtils.getJsonSerializedValueExn

          attributes->JsonUtils.isJsonSerializedValueNone
            ? sendDataArr
            : attributes
              ->JsonUtils.getJsonSerializedValueExn
              ->Commonlib.ArraySt.reduceOneParam((. sendDataArr, {name, buffer, type_}) => {
                add(sendDataArr, (name->JsonUtils.toNullable, buffer, type_->JsonUtils.toNullable))
              }, sendDataArr)
        }
  }, [])
}
