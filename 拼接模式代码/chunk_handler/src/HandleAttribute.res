open GLSLConfigType

let addAttributeSendMetadata = (add, shaderChunks: shaderChunks) => {
  shaderChunks->Commonlib.ArraySt.reduceOneParam((. sendMetadataArr, {variables}) => {
    variables->JsonUtils.isJsonSerializedValueNone
      ? sendMetadataArr
      : {
          let {attributes} = variables->JsonUtils.getJsonSerializedValueExn

          attributes->JsonUtils.isJsonSerializedValueNone
            ? sendMetadataArr
            : attributes
              ->JsonUtils.getJsonSerializedValueExn
              ->Commonlib.ArraySt.reduceOneParam((. sendMetadataArr, {name, buffer, type_}) => {
                add(sendMetadataArr, (name->JsonUtils.toNullable, buffer, type_->JsonUtils.toNullable))
              }, sendMetadataArr)
        }
  }, [])
}
