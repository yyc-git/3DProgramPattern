'use strict';

var NullUtils$Commonlib = require("../utils/NullUtils.bs.js");
var SparseMap$Commonlib = require("./SparseMap.bs.js");

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

exports.createEmpty = createEmpty;
exports.copy = copy;
exports.unsafeGet = unsafeGet;
exports.get = get;
exports.fastGet = fastGet;
exports.getNullable = getNullable;
exports.has = has;
exports.set = set;
exports.remove = remove;
exports.map = map;
exports.reducei = reducei;
exports.getValues = getValues;
exports.getKeys = getKeys;
exports.deleteVal = deleteVal;
/* No side effect */
