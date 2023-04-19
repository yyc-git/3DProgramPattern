'use strict';

var SparseMap$Commonlib = require("./SparseMap.bs.js");

function set(map, key, value) {
  var newMap = SparseMap$Commonlib.copy(map);
  newMap[key] = value;
  return newMap;
}

function remove(map, key) {
  var newMap = SparseMap$Commonlib.copy(map);
  newMap[key] = undefined;
  return newMap;
}

function deleteVal(map, key) {
  var newMap = SparseMap$Commonlib.copy(map);
  newMap[key] = undefined;
  return newMap;
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
