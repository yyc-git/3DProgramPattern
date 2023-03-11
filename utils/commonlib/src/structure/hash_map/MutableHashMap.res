let createEmpty = HashMap.createEmpty

let set = (map: CommonlibType.HashMapType.t2<'a>, key: string, value: 'a) => {
  Js.Dict.set(map, key, value->CommonlibType.HashMapType.notNullableToNullable)

  map
}

let unsafeGet = HashMap.unsafeGet

let get = HashMap.get

let getExn = HashMap.getExn

let getNullable = HashMap.getNullable

let has = HashMap.has

let deleteVal = (map: CommonlibType.HashMapType.t2<'a>, key: string) => {
  Js.Dict.set(map, key, Js.Nullable.undefined)

  map
}

let getValidValues = HashMap.getValidValues

let copy = HashMap.copy

let entries = HashMap.entries

let map = HashMap.map
