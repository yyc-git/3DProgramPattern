'use strict';

var Fs = require("fs");
var List = require("rescript/lib/js/list.js");
var Glob = require("glob");
var Js_array = require("rescript/lib/js/js_array.js");
var Parse$Glsl_compiler = require("./Parse.bs.js");
var ArraySystem$Glsl_compiler = require("./ArraySystem.bs.js");

var _functionContent = "\n  let _buildChunk =\n      (\n        [ top, define ]:[string, string],\n        varDeclare: string,\n        [ funcDeclare, funcDefine ]:[string, string],\n        body: string\n      ) => {\n    return {\n      top,\n      define,\n      varDeclare,\n      funcDeclare,\n      funcDefine,\n      body\n    }\n  };\n\n  export let getData = () =>{\n  ";

function _buildInitDataContent(glslContent) {
  return "\n        return {\n          " + glslContent + "\n        }\n  ";
}

function _buildChunkFileContent(glslContent) {
  return _functionContent + _buildInitDataContent(glslContent) + "}";
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

function createChunkFile(glslPathArr, destFilePath, doneFunc) {
  _writeToChunkFile(destFilePath, doneFunc, _buildChunkFileContent(Parse$Glsl_compiler.parseImport(List.map((function (actualGlslPath) {
                      return Parse$Glsl_compiler.parseSegment(actualGlslPath, Fs.readFileSync(actualGlslPath, "utf8"));
                    }), _convertArrayToList(ArraySystem$Glsl_compiler.flatten(Js_array.map((function (glslPath) {
                                  return Glob.sync(glslPath);
                                }), glslPathArr)))))));
}

exports._functionContent = _functionContent;
exports._buildInitDataContent = _buildInitDataContent;
exports._buildChunkFileContent = _buildChunkFileContent;
exports._writeToChunkFile = _writeToChunkFile;
exports._convertArrayToList = _convertArrayToList;
exports.createChunkFile = createChunkFile;
/* fs Not a pure module */
