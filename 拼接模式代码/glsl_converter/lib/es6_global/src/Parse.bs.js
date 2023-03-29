

import * as List from "../../../../../node_modules/rescript/lib/es6/list.js";
import * as Path from "path";
import * as Curry from "../../../../../node_modules/rescript/lib/es6/curry.js";
import * as Js_dict from "../../../../../node_modules/rescript/lib/es6/js_dict.js";
import * as Js_string from "../../../../../node_modules/rescript/lib/es6/js_string.js";
import * as Caml_array from "../../../../../node_modules/rescript/lib/es6/caml_array.js";
import * as Pervasives from "../../../../../node_modules/rescript/lib/es6/pervasives.js";
import * as Caml_option from "../../../../../node_modules/rescript/lib/es6/caml_option.js";
import * as Js_null_undefined from "../../../../../node_modules/rescript/lib/es6/js_null_undefined.js";

function _getFileName(path) {
  return Path.basename(path, Path.extname(path));
}

function _buildGlslContent(name, param) {
  var extname = Path.extname(name);
  if (extname !== "") {
    return Pervasives.failwith("should import fileName without " + extname);
  }
  var match = Js_string.startsWith("./", name);
  var match$1 = Js_string.startsWith("../", name);
  if (match || match$1) {
    return Pervasives.failwith("should import fileName, not filePath");
  } else {
    return "\"" + name + "\": _buildChunk([`" + param[0] + "`, `" + param[1] + "`],`" + param[2] + "`,[`" + param[3] + "`, `" + param[4] + "`],`" + param[5] + "`,), ";
  }
}

function _execRegex(regex, content, _startIndex, _recordList, noneFunc, someFunc) {
  while(true) {
    var recordList = _recordList;
    var startIndex = _startIndex;
    var result = regex.exec(content);
    if (result === null) {
      return Curry._2(noneFunc, startIndex, recordList);
    }
    _recordList = Curry._3(someFunc, result, startIndex, recordList);
    _startIndex = regex.lastIndex;
    continue ;
  };
}

function _getAllImportContent(fileName, segmentName, segmentContent, map) {
  var _createImportFlagRe = function (param) {
    return /#import\s+"(.+)"/g;
  };
  var _get = function (fileNameList, segmentName, segmentContent, map) {
    var recordList = _execRegex(_createImportFlagRe(undefined), segmentContent, 0, /* [] */0, (function (startIndex, recordList) {
            return {
                    hd: [
                      startIndex,
                      segmentContent.length,
                      undefined
                    ],
                    tl: recordList
                  };
          }), (function (result, startIndex, recordList) {
            return {
                    hd: [
                      startIndex,
                      result.index,
                      Caml_option.nullable_to_opt(Js_null_undefined.bind(Caml_array.get(result, 1), (function (importFileName) {
                                  var extname = Path.extname(importFileName);
                                  if (extname !== "") {
                                    return Pervasives.failwith("should import fileName without " + extname);
                                  }
                                  var match = Js_string.startsWith("./", importFileName);
                                  var match$1 = Js_string.startsWith("../", importFileName);
                                  if (match) {
                                    return Pervasives.failwith("should import fileName, not filePath");
                                  }
                                  if (match$1) {
                                    return Pervasives.failwith("should import fileName, not filePath");
                                  }
                                  var segmentMap = Js_dict.get(map, importFileName);
                                  if (segmentMap === undefined) {
                                    return Pervasives.failwith("import glsl file:" + importFileName + " should exist");
                                  }
                                  var segmentMap$1 = Caml_option.valFromOption(segmentMap);
                                  var fileName = segmentMap$1["fileName"];
                                  var newFileNameList = {
                                    hd: fileName,
                                    tl: fileNameList
                                  };
                                  if (List.mem(fileName, fileNameList)) {
                                    var msg = Js_string.slice(0, -2, List.fold_left((function (str, fileName) {
                                                return str + (fileName + "=>");
                                              }), "", List.rev(newFileNameList)));
                                    return Pervasives.failwith("not allow circular reference(the reference path is " + msg + ")");
                                  }
                                  var importContent = Js_dict.get(segmentMap$1, segmentName);
                                  if (importContent !== undefined) {
                                    if (_createImportFlagRe(undefined).test(importContent)) {
                                      return _get(newFileNameList, segmentName, importContent, map);
                                    } else {
                                      return importContent;
                                    }
                                  } else {
                                    return Pervasives.failwith("segment:" + segmentName + " should exist in " + importFileName + ".glsl");
                                  }
                                })))
                    ],
                    tl: recordList
                  };
          }));
    return List.fold_left((function (content, param) {
                  var importSegmentContent = param[2];
                  return content + (Js_string.slice(param[0], param[1], segmentContent) + (
                            importSegmentContent !== undefined ? importSegmentContent : ""
                          ));
                }), "", List.rev(recordList));
  };
  return _get({
              hd: fileName,
              tl: /* [] */0
            }, segmentName, segmentContent, map);
}

function _convertListToMap(list) {
  return List.fold_left((function (map, param) {
                var match = param[6];
                var match$1 = param[5];
                var match$2 = param[4];
                var match$3 = param[3];
                var match$4 = param[2];
                var match$5 = param[1];
                var fileName = param[0];
                var segmentMap = {};
                segmentMap["fileName"] = fileName;
                segmentMap[match$5[0]] = match$5[1];
                segmentMap[match$4[0]] = match$4[1];
                segmentMap[match$3[0]] = match$3[1];
                segmentMap[match$2[0]] = match$2[1];
                segmentMap[match$1[0]] = match$1[1];
                segmentMap[match[0]] = match[1];
                map[fileName] = segmentMap;
                return map;
              }), {}, list);
}

function parseImport(list) {
  var map = _convertListToMap(list);
  return List.fold_left((function (content, param) {
                var match = param[6];
                var match$1 = param[5];
                var match$2 = param[4];
                var match$3 = param[3];
                var match$4 = param[2];
                var match$5 = param[1];
                var fileName = param[0];
                return content + _buildGlslContent(fileName, [
                            _getAllImportContent(fileName, match$5[0], match$5[1], map),
                            _getAllImportContent(fileName, match$4[0], match$4[1], map),
                            _getAllImportContent(fileName, match$3[0], match$3[1], map),
                            _getAllImportContent(fileName, match$2[0], match$2[1], map),
                            _getAllImportContent(fileName, match$1[0], match$1[1], map),
                            _getAllImportContent(fileName, match[0], match[1], map)
                          ]);
              }), "", list);
}

function parseSegment(actualGlslPath, content) {
  var endFlagRe = /@end/g;
  var list = List.rev(List.fold_left((function (list, flag) {
              var index = Js_string.indexOf(flag, content);
              var tmp;
              if (index !== -1) {
                var startIndex = index + flag.length | 0;
                var result = endFlagRe.exec(content);
                tmp = result !== null ? Js_string.slice(startIndex, result.index, content).trim() : Pervasives.failwith("@end should match to segement flag");
              } else {
                tmp = "";
              }
              return {
                      hd: tmp,
                      tl: list
                    };
            }), /* [] */0, {
            hd: "@top",
            tl: {
              hd: "@define",
              tl: {
                hd: "@varDeclare",
                tl: {
                  hd: "@funcDeclare",
                  tl: {
                    hd: "@funcDefine",
                    tl: {
                      hd: "@body",
                      tl: /* [] */0
                    }
                  }
                }
              }
            }
          }));
  return [
          Path.basename(actualGlslPath, Path.extname(actualGlslPath)),
          [
            "top",
            List.nth(list, 0)
          ],
          [
            "define",
            List.nth(list, 1)
          ],
          [
            "varDeclare",
            List.nth(list, 2)
          ],
          [
            "funcDeclare",
            List.nth(list, 3)
          ],
          [
            "funcDefine",
            List.nth(list, 4)
          ],
          [
            "body",
            List.nth(list, 5)
          ]
        ];
}

export {
  _getFileName ,
  _buildGlslContent ,
  _execRegex ,
  _getAllImportContent ,
  _convertListToMap ,
  parseImport ,
  parseSegment ,
}
/* path Not a pure module */
