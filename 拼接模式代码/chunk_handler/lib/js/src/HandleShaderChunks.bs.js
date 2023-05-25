'use strict';

var Curry = require("rescript/lib/js/curry.js");
var Js_array = require("rescript/lib/js/js_array.js");
var Log$Commonlib = require("commonlib/lib/js/src/log/Log.bs.js");
var ArraySt$Commonlib = require("commonlib/lib/js/src/structure/ArraySt.bs.js");
var Exception$Commonlib = require("commonlib/lib/js/src/structure/Exception.bs.js");
var JsonUtils$Chunk_handler = require("./utils/JsonUtils.bs.js");
var ArrayUtils$Chunk_handler = require("./utils/ArrayUtils.bs.js");

function _findFirstShaderChunkExn(shaderChunkName, shaderChunks) {
  return ArrayUtils$Chunk_handler.findFirstExn(shaderChunks, (function (item) {
                return item.name === shaderChunkName;
              }));
}

function _getShaderChunksByGroup(resultShaderChunks, groups, name, shaderChunks) {
  var __x = ArrayUtils$Chunk_handler.findFirstExn(groups, (function (item) {
          return item.name === name;
        })).value;
  return Js_array.concat(Js_array.map((function (name) {
                    return _findFirstShaderChunkExn(name, shaderChunks);
                  }), __x), resultShaderChunks);
}

function _getShaderChunksByStaticBranch(resultShaderChunks, param, name, param$1) {
  var staticBranchs = param$1[0];
  if (Curry._1(param[0], name)) {
    var match = ArrayUtils$Chunk_handler.findFirstExn(staticBranchs, (function (item) {
            return item.name === name;
          }));
    return ArraySt$Commonlib.push(resultShaderChunks, _findFirstShaderChunkExn(Curry._2(param[1], name, match.value), param$1[1]));
  }
  Log$Commonlib.debug((function (param) {
          return Log$Commonlib.buildDebugJsonMessage("staticBranchs", staticBranchs, param);
        }), true);
  return Exception$Commonlib.throwErr(Exception$Commonlib.buildErr(Log$Commonlib.buildFatalMessage("_getShaderChunksByStaticBranch", "unknown name:" + name, "", "", "")));
}

function _getShaderChunksByBynamicBranch(resultShaderChunks, isPass, name, param) {
  var dynamicBranchData = ArrayUtils$Chunk_handler.findFirstExn(param[0], (function (item) {
          return item.name === name;
        }));
  var dynamicBranchShaderChunkNameOption = Curry._1(isPass, dynamicBranchData.condition) ? dynamicBranchData.pass : dynamicBranchData.fail;
  if (JsonUtils$Chunk_handler.isJsonSerializedValueNone(dynamicBranchShaderChunkNameOption)) {
    return resultShaderChunks;
  } else {
    return ArraySt$Commonlib.push(resultShaderChunks, _findFirstShaderChunkExn(JsonUtils$Chunk_handler.getJsonSerializedValueExn(dynamicBranchShaderChunkNameOption), param[1]));
  }
}

function _getShaderChunksByType(resultShaderChunks, param, param$1, param$2) {
  var shaderChunks = param$2[0];
  var name = param$1[2];
  var type_ = param$1[0];
  var match = param[0];
  switch (type_) {
    case "dynamic_branch" :
        return _getShaderChunksByBynamicBranch(resultShaderChunks, param[1], name, [
                    param$2[2],
                    shaderChunks
                  ]);
    case "group" :
        return _getShaderChunksByGroup(resultShaderChunks, param$1[1], name, shaderChunks);
    case "static_branch" :
        return _getShaderChunksByStaticBranch(resultShaderChunks, [
                    match[0],
                    match[1]
                  ], name, [
                    param$2[1],
                    shaderChunks
                  ]);
    default:
      Log$Commonlib.debug((function (param) {
              return Log$Commonlib.buildDebugJsonMessage("shaderChunks", shaderChunks, param);
            }), true);
      return Exception$Commonlib.throwErr(Exception$Commonlib.buildErr(Log$Commonlib.buildFatalMessage("_getShaderChunksByType", "unknown type_:" + type_, "", "", "")));
  }
}

function getShaderChunksOfShader(param, shaders, shaderName, param$1, shaderChunks) {
  var groups = param$1.groups;
  var dynamicBranchs = param$1.dynamicBranchs;
  var staticBranchs = param$1.staticBranchs;
  var isPassForDynamicBranch = param[1];
  var match = param[0];
  var getShaderChunkFromStaticBranch = match[1];
  var isNameValidForStaticBranch = match[0];
  var shader = ArrayUtils$Chunk_handler.findFirstExn(shaders, (function (param) {
          return param.name === shaderName;
        }));
  return ArraySt$Commonlib.reduceOneParam(shader.shaderChunks, (function (resultShaderChunks, param) {
                var name = param.name;
                var type_ = param.type_;
                if (JsonUtils$Chunk_handler.isJsonSerializedValueNone(type_)) {
                  return ArraySt$Commonlib.push(resultShaderChunks, _findFirstShaderChunkExn(name, shaderChunks));
                } else {
                  return _getShaderChunksByType(resultShaderChunks, [
                              [
                                isNameValidForStaticBranch,
                                getShaderChunkFromStaticBranch
                              ],
                              isPassForDynamicBranch
                            ], [
                              JsonUtils$Chunk_handler.getJsonSerializedValueExn(type_),
                              groups,
                              name
                            ], [
                              shaderChunks,
                              staticBranchs,
                              dynamicBranchs
                            ]);
                }
              }), []);
}

exports._findFirstShaderChunkExn = _findFirstShaderChunkExn;
exports._getShaderChunksByGroup = _getShaderChunksByGroup;
exports._getShaderChunksByStaticBranch = _getShaderChunksByStaticBranch;
exports._getShaderChunksByBynamicBranch = _getShaderChunksByBynamicBranch;
exports._getShaderChunksByType = _getShaderChunksByType;
exports.getShaderChunksOfShader = getShaderChunksOfShader;
/* No side effect */
