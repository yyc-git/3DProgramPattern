let createEmpty = HashMap.createEmpty

let set = (
  map: CommonlibType.HashMapType.t2<'a>,
  key: string,
  value: 'a,
): CommonlibType.HashMapType.t2<'a> => {
  let newMap = map->HashMap.copy

  Js.Dict.set(newMap, key, value->CommonlibType.HashMapType.notNullableToNullable)

  newMap
}

let unsafeGet = HashMap.unsafeGet

let get = HashMap.get

let getExn = HashMap.getExn

let getNullable = HashMap.getNullable

let has = HashMap.has

let deleteVal = (map: CommonlibType.HashMapType.t2<'a>, key: string) => {
  let newMap = map->HashMap.copy

  Js.Dict.set(newMap, key, Js.Nullable.undefined)

  newMap
}

let getValidValues = HashMap.getValidValues

let copy = HashMap.copy

let entries = HashMap.entries

let map = HashMap.map