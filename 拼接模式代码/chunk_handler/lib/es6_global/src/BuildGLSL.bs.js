

import * as Curry from "../../../../../node_modules/rescript/lib/es6/curry.js";
import * as Js_string from "../../../../../node_modules/rescript/lib/es6/js_string.js";
import * as ArraySt$Commonlib from "../../../../../node_modules/commonlib/lib/es6_global/src/structure/ArraySt.bs.js";
import * as JsonUtils$Chunk_handler from "./utils/JsonUtils.bs.js";
import * as ImmutableHashMap$Commonlib from "../../../../../node_modules/commonlib/lib/es6_global/src/structure/hash_map/ImmutableHashMap.bs.js";

function _get_webgl1_main_begin(param) {
  return "\n  void main(void){\n  ";
}

function _get_webgl1_main_end(param) {
  return "\n  }\n";
}

function _buildNewLine(param) {
  return "\n  ";
}

var _getChunk = ImmutableHashMap$Commonlib.getExn;

function _generateAttributeSource(generateAttributeType, shaderChunks) {
  return ArraySt$Commonlib.reduceOneParam(shaderChunks, (function (result, param) {
                var variables = param.variables;
                if (JsonUtils$Chunk_handler.isJsonSerializedValueNone(variables)) {
                  return result;
                }
                var optionalAttributes = JsonUtils$Chunk_handler.getJsonSerializedValueExn(variables).attributes;
                if (JsonUtils$Chunk_handler.isJsonSerializedValueNone(optionalAttributes)) {
                  return result;
                } else {
                  return result + ArraySt$Commonlib.reduceOneParam(JsonUtils$Chunk_handler.getJsonSerializedValueExn(optionalAttributes), (function (result, param) {
                                var type_ = param.type_;
                                var name = param.name;
                                if (!(!JsonUtils$Chunk_handler.isJsonSerializedValueNone(name) && !JsonUtils$Chunk_handler.isJsonSerializedValueNone(type_))) {
                                  return result;
                                }
                                var name$1 = JsonUtils$Chunk_handler.getJsonSerializedValueExn(name);
                                var type_$1 = JsonUtils$Chunk_handler.getJsonSerializedValueExn(type_);
                                var type_$2 = Curry._1(generateAttributeType, type_$1);
                                return result + ("attribute " + type_$2 + " " + name$1 + ";\n  ");
                              }), "");
                }
              }), "");
}

function _isInSource(key, source) {
  return Js_string.indexOf(key, source) > -1;
}

function _generateUniformSource(generateUniformType, shaderChunks, sourceVarDeclare, sourceFuncDefine, sourceBody) {
  return ArraySt$Commonlib.reduceOneParam(shaderChunks, (function (result, param) {
                var variables = param.variables;
                if (JsonUtils$Chunk_handler.isJsonSerializedValueNone(variables)) {
                  return result;
                }
                var optionalUniforms = JsonUtils$Chunk_handler.getJsonSerializedValueExn(variables).uniforms;
                if (JsonUtils$Chunk_handler.isJsonSerializedValueNone(optionalUniforms)) {
                  return result;
                } else {
                  return result + ArraySt$Commonlib.reduceOneParam(ArraySt$Commonlib.filter(JsonUtils$Chunk_handler.getJsonSerializedValueExn(optionalUniforms), (function (param) {
                                    var name = param.name;
                                    if (_isInSource(name, sourceVarDeclare) || _isInSource(name, sourceFuncDefine)) {
                                      return true;
                                    } else {
                                      return _isInSource(name, sourceBody);
                                    }
                                  })), (function (result, param) {
                                var type_ = Curry._1(generateUniformType, param.type_);
                                return result + ("uniform " + type_ + " " + param.name + ";\n");
                              }), "");
                }
              }), "");
}

function _addNewLine(segement) {
  if (segement.trim() === "") {
    return segement;
  } else {
    return "\n  " + segement;
  }
}

function _setSource(sourceChunk) {
  var sourceTop = sourceChunk.top;
  var sourceDefine = sourceChunk.define;
  var sourceVarDeclare = sourceChunk.varDeclare;
  var sourceFuncDeclare = sourceChunk.funcDeclare;
  var sourceFuncDefine = sourceChunk.funcDefine;
  var sourceBody = sourceChunk.body;
  return function (param) {
    var top = param.top;
    var define = param.define;
    var varDeclare = param.varDeclare;
    var funcDeclare = param.funcDeclare;
    var funcDefine = param.funcDefine;
    var body = param.body;
    sourceChunk.top = sourceTop + _addNewLine(top);
    sourceChunk.define = sourceDefine + _addNewLine(define);
    sourceChunk.varDeclare = sourceVarDeclare + _addNewLine(varDeclare);
    sourceChunk.funcDeclare = sourceFuncDeclare + _addNewLine(funcDeclare);
    sourceChunk.funcDefine = sourceFuncDefine + _addNewLine(funcDefine);
    sourceChunk.body = sourceBody + _addNewLine(body);
    return sourceChunk;
  };
}

function _buildBody(param) {
  var body = param.body;
  return body + "\n  }\n";
}

function _buildVarDeclare(generateUniformType, param) {
  var varDeclare = param.varDeclare;
  var funcDefine = param.funcDefine;
  var body = param.body;
  return function (shaderChunks) {
    return varDeclare + ("\n  " + _generateUniformSource(generateUniformType, shaderChunks, varDeclare, funcDefine, body));
  };
}

function _addAlllParts(param) {
  var top = param.top;
  var define = param.define;
  var varDeclare = param.varDeclare;
  var funcDeclare = param.funcDeclare;
  var funcDefine = param.funcDefine;
  var body = param.body;
  return top + (define + (varDeclare + (funcDeclare + (funcDefine + body))));
}

function _createEmptyChunk(param) {
  return {
          top: "",
          define: "",
          varDeclare: "",
          funcDeclare: "",
          funcDefine: "",
          body: ""
        };
}

function _buildVsAndFsByType(param, param$1, param$2, chunk) {
  var name = param$2[1];
  var type_ = param$2[0];
  var fs = param[1];
  var vs = param[0];
  if (type_ === "vs") {
    return [
            _setSource(vs)(ImmutableHashMap$Commonlib.getExn(chunk, name)),
            fs
          ];
  } else if (type_ === "fs_function") {
    return [
            vs,
            _setSource(fs)(Curry._1(param$1[1], name))
          ];
  } else if (type_ === "vs_function") {
    return [
            _setSource(vs)(Curry._1(param$1[0], name)),
            fs
          ];
  } else {
    return [
            vs,
            _setSource(fs)(ImmutableHashMap$Commonlib.getExn(chunk, name))
          ];
  }
}

function _buildVsAndFs(param, param$1, chunk, shaderChunks) {
  var buildGLSLChunkInFS = param$1[1];
  var buildGLSLChunkInVS = param$1[0];
  return ArraySt$Commonlib.reduceOneParam(shaderChunks, (function (glslTuple, param) {
                var glsls = param.glsls;
                if (JsonUtils$Chunk_handler.isJsonSerializedValueNone(glsls)) {
                  return glslTuple;
                } else {
                  return ArraySt$Commonlib.reduceOneParam(JsonUtils$Chunk_handler.getJsonSerializedValueExn(glsls), (function (sourceTuple, param) {
                                return _buildVsAndFsByType(sourceTuple, [
                                            buildGLSLChunkInVS,
                                            buildGLSLChunkInFS
                                          ], [
                                            param.type_,
                                            param.name
                                          ], chunk);
                              }), glslTuple);
                }
              }), [
              param[0],
              param[1]
            ]);
}

function _buildPrecisionTop(precision) {
  if (precision === "mediump") {
    return "precision mediump float;\nprecision mediump int;";
  } else if (precision === "highp") {
    return "precision highp float;\nprecision highp int;";
  } else {
    return "precision lowp float;\nprecision lowp int;";
  }
}

function buildGLSL(param, shaderChunks, chunk, precision) {
  var generateUniformType = param[1];
  var precisionTop = _buildPrecisionTop(precision);
  var vs = {
    top: "",
    define: "",
    varDeclare: "",
    funcDeclare: "",
    funcDefine: "",
    body: ""
  };
  var fs = {
    top: "",
    define: "",
    varDeclare: "",
    funcDeclare: "",
    funcDefine: "",
    body: ""
  };
  vs.body = vs.body + "\n  void main(void){\n  ";
  fs.body = fs.body + "\n  void main(void){\n  ";
  vs.top = precisionTop + vs.top;
  fs.top = precisionTop + fs.top;
  var match = _buildVsAndFs([
        vs,
        fs
      ], [
        param[2],
        param[3]
      ], chunk, shaderChunks);
  var fs$1 = match[1];
  var vs$1 = match[0];
  vs$1.body = _buildBody(vs$1);
  fs$1.body = _buildBody(fs$1);
  vs$1.varDeclare = "\n  " + (_generateAttributeSource(param[0], shaderChunks) + vs$1.varDeclare);
  vs$1.varDeclare = _buildVarDeclare(generateUniformType, vs$1)(shaderChunks);
  fs$1.varDeclare = _buildVarDeclare(generateUniformType, fs$1)(shaderChunks);
  return [
          _addAlllParts(vs$1),
          _addAlllParts(fs$1)
        ];
}

export {
  _get_webgl1_main_begin ,
  _get_webgl1_main_end ,
  _buildNewLine ,
  _getChunk ,
  _generateAttributeSource ,
  _isInSource ,
  _generateUniformSource ,
  _addNewLine ,
  _setSource ,
  _buildBody ,
  _buildVarDeclare ,
  _addAlllParts ,
  _createEmptyChunk ,
  _buildVsAndFsByType ,
  _buildVsAndFs ,
  _buildPrecisionTop ,
  buildGLSL ,
}
/* No side effect */
