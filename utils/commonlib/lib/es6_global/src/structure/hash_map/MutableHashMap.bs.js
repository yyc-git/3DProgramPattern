

import * as HashMap$Commonlib from "./HashMap.bs.js";

function set(map, key, value) {
  map[key] = value;
  return map;
}

function deleteVal(map, key) {
  map[key] = undefined;
  return map;
}

var createEmpty = HashMap$Commonlib.createEmpty;

var unsafeGet = HashMap$Commonlib.unsafeGet;

var get = HashMap$Commonlib.get;

var getExn = HashMap$Commonlib.getExn;

var getNullable = HashMap$Commonlib.getNullable;

var has = HashMap$Commonlib.has;

var getValidValues = HashMap$Commonlib.getValidValues;

var copy = HashMap$Commonlib.copy;

var entries = HashMap$Commonlib.entries;

var map = HashMap$Commonlib.map;

export {
  createEmpty ,
  set ,
  unsafeGet ,
  get ,
  getExn ,
  getNullable ,
  has ,
  deleteVal ,
  getValidValues ,
  copy ,
  entries ,
  map ,
}
/* No side effect */
