let isJsonSerializedValueNone = value =>
  Obj.magic(value) === Js.Nullable.null || Obj.magic(value) === Js.Nullable.undefined

let getJsonSerializedValueExn = Commonlib.OptionSt.getExn

let toNullable = Commonlib.OptionSt.toNullable
