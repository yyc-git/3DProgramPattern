open GLSLConfigType

let addAttributeSendConfig = (add, shaderChunks: shaderChunks) => {
  shaderChunks->Commonlib.ArraySt.reduceOneParam((. sendConfigArr, {variables}) => {
    variables->JsonUtils.isJsonSerializedValueNone
      ? sendConfigArr
      : {
          let {attributes} = variables->JsonUtils.getJsonSerializedValueExn

          attributes->JsonUtils.isJsonSerializedValueNone
            ? sendConfigArr
            : attributes
              ->JsonUtils.getJsonSerializedValueExn
              ->Commonlib.ArraySt.reduceOneParam((. sendConfigArr, {name, buffer, type_}) => {
                add(sendConfigArr, (name->JsonUtils.toNullable, buffer, type_->JsonUtils.toNullable))
              }, sendConfigArr)
        }
  }, [])
}
