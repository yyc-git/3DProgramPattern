

import * as HashMap$Commonlib from "./HashMap.bs.js";

function set(map, key, value) {
  var newMap = HashMap$Commonlib.copy(map);
  newMap[key] = value;
  return newMap;
}

function deleteVal(map, key) {
  var newMap = HashMap$Commonlib.copy(map);
  newMap[key] = undefined;
  return newMap;
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
