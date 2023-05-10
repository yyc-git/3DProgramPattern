

import * as NullUtils$Commonlib from "../utils/NullUtils.bs.js";
import * as SparseMap$Commonlib from "./SparseMap.bs.js";

function fastGet(map, key) {
  var value = SparseMap$Commonlib.unsafeGet(map, key);
  return [
          NullUtils$Commonlib.isInMap(value),
          value
        ];
}

function set(map, key, value) {
  map[key] = value;
  return map;
}

function remove(map, key) {
  map[key] = undefined;
  return map;
}

function deleteVal(map, key) {
  map[key] = undefined;
  return map;
}

var createEmpty = SparseMap$Commonlib.createEmpty;

var copy = SparseMap$Commonlib.copy;

var unsafeGet = SparseMap$Commonlib.unsafeGet;

var get = SparseMap$Commonlib.get;

var getNullable = SparseMap$Commonlib.getNullable;

var has = SparseMap$Commonlib.has;

var map = SparseMap$Commonlib.map;

var reducei = SparseMap$Commonlib.reducei;

var getValues = SparseMap$Commonlib.getValues;

var getKeys = SparseMap$Commonlib.getKeys;

export {
  createEmpty ,
  copy ,
  unsafeGet ,
  get ,
  fastGet ,
  getNullable ,
  has ,
  set ,
  remove ,
  map ,
  reducei ,
  getValues ,
  getKeys ,
  deleteVal ,
}
/* No side effect */
