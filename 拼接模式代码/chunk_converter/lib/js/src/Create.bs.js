'use strict';

var Fs = require("fs");
var List = require("rescript/lib/js/list.js");
var Glob = require("glob");
var Curry = require("rescript/lib/js/curry.js");
var Js_array = require("rescript/lib/js/js_array.js");
var Parse$Chunk_converter = require("./Parse.bs.js");
var ArrayUtils$Chunk_converter = require("./ArrayUtils.bs.js");

var _functionContentForTs = "\n  let _buildChunk =\n      (\n        [ top, define ]:[string, string],\n        varDeclare: string,\n        [ funcDeclare, funcDefine ]:[string, string],\n        body: string\n      ) => {\n    return {\n      top,\n      define,\n      varDeclare,\n      funcDeclare,\n      funcDefine,\n      body\n    }\n  };\n\n  export let getData = () =>{\n  ";

function _buildInitDataContentForTs(glslContent) {
  return "\n        return {\n          " + glslContent + "\n        }\n  ";
}

var _functionContentForRes = "\n  open Chunk_converter.ChunkType\n\n\n  let _buildChunk =\n      (\n        ( top:string, define:string ),\n        varDeclare: string,\n        ( funcDeclare:string, funcDefine:string ),\n        body: string\n      ) => {\n    {\n      top,\n      define,\n      varDeclare,\n      funcDeclare,\n      funcDefine,\n      body\n    }\n  };\n\n  let getData = () =>{\n  ";

function _buildInitDataContentForRes(glslContent) {
  return "\n          " + glslContent + "\n  ";
}

function _buildChunkFileContent(param, glslContent) {
  return param[1] + Curry._1(param[0], glslContent) + "}";
}

function _writeToChunkFile(destFilePath, doneFunc, content) {
  Fs.writeFileSync(destFilePath, content, "utf8");
  doneFunc();
}

function _convertArrayToList(array) {
  return Js_array.reduce((function (list, str) {
                return {
                        hd: str,
                        tl: list
                      };
              }), /* [] */0, array);
}

function _createMergedTargetChunkFile(_buildChunkFileContent, glslPathArr, destFilePath, doneFunc) {
  _writeToChunkFile(destFilePath, doneFunc, Curry._1(_buildChunkFileContent, Parse$Chunk_converter.parseImport(List.map((function (actualGlslPath) {
                      return Parse$Chunk_converter.parseSegment(actualGlslPath, Fs.readFileSync(actualGlslPath, "utf8"));
                    }), _convertArrayToList(ArrayUtils$Chunk_converter.flatten(Js_array.map((function (glslPath) {
                                  return Glob.sync(glslPath);
                                }), glslPathArr)))))));
}

function createMergedGLSLChunkFileForTs(glslPathArr, destFilePath, doneFunc) {
  var partial_arg = [
    _buildInitDataContentForTs,
    _functionContentForTs
  ];
  _createMergedTargetChunkFile((function (param) {
          return _buildChunkFileContent(partial_arg, param);
        }), glslPathArr, destFilePath, doneFunc);
}

function createMergedGLSLChunkFileForRes(glslPathArr, destFilePath, doneFunc) {
  var partial_arg = [
    _buildInitDataContentForRes,
    _functionContentForRes
  ];
  _createMergedTargetChunkFile((function (param) {
          return _buildChunkFileContent(partial_arg, param);
        }), glslPathArr, destFilePath, doneFunc);
}

exports._functionContentForTs = _functionContentForTs;
exports._buildInitDataContentForTs = _buildInitDataContentForTs;
exports._functionContentForRes = _functionContentForRes;
exports._buildInitDataContentForRes = _buildInitDataContentForRes;
exports._buildChunkFileContent = _buildChunkFileContent;
exports._writeToChunkFile = _writeToChunkFile;
exports._convertArrayToList = _convertArrayToList;
exports._createMergedTargetChunkFile = _createMergedTargetChunkFile;
exports.createMergedGLSLChunkFileForTs = createMergedGLSLChunkFileForTs;
exports.createMergedGLSLChunkFileForRes = createMergedGLSLChunkFileForRes;
/* fs Not a pure module */
