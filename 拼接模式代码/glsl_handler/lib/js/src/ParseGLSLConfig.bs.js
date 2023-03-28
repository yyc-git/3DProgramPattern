'use strict';

var Json_decode$Json = require("json/lib/js/src/Json_decode.bs.js");
var OptionSt$Commonlib = require("commonlib/lib/js/src/structure/OptionSt.bs.js");

function _parseShaderMapData(json) {
  return Json_decode$Json.array((function (json) {
                return {
                        name: Json_decode$Json.field("name", Json_decode$Json.string, json),
                        value: Json_decode$Json.field("value", (function (param) {
                                return Json_decode$Json.array(Json_decode$Json.string, param);
                              }), json)
                      };
              }), json);
}

function _parseDynamicBranchData(json) {
  return Json_decode$Json.array((function (json) {
                return {
                        name: Json_decode$Json.field("name", Json_decode$Json.string, json),
                        condition: Json_decode$Json.field("condition", Json_decode$Json.string, json),
                        pass: Json_decode$Json.optional((function (param) {
                                return Json_decode$Json.field("pass", Json_decode$Json.string, param);
                              }), json),
                        fail: Json_decode$Json.optional((function (param) {
                                return Json_decode$Json.field("fail", Json_decode$Json.string, param);
                              }), json)
                      };
              }), json);
}

function parseShaders(shaders) {
  return {
          staticBranchs: Json_decode$Json.field("static_branchs", _parseShaderMapData, shaders),
          dynamicBranchs: Json_decode$Json.field("dynamic_branchs", _parseDynamicBranchData, shaders),
          groups: Json_decode$Json.field("groups", _parseShaderMapData, shaders),
          materialShaders: Json_decode$Json.field("material_shaders", (function (json) {
                  return Json_decode$Json.array((function (json) {
                                return {
                                        name: Json_decode$Json.field("name", Json_decode$Json.string, json),
                                        shaderLibs: Json_decode$Json.field("shader_libs", (function (param) {
                                                return Json_decode$Json.array((function (json) {
                                                              return {
                                                                      type_: Json_decode$Json.optional((function (param) {
                                                                              return Json_decode$Json.field("type", Json_decode$Json.string, param);
                                                                            }), json),
                                                                      name: Json_decode$Json.field("name", Json_decode$Json.string, json)
                                                                    };
                                                            }), param);
                                              }), json)
                                      };
                              }), json);
                }), shaders),
          noMaterialShaders: Json_decode$Json.field("no_material_shaders", (function (json) {
                  return Json_decode$Json.array((function (json) {
                                return {
                                        name: Json_decode$Json.field("name", Json_decode$Json.string, json),
                                        shaderLibs: Json_decode$Json.field("shader_libs", (function (param) {
                                                return Json_decode$Json.array((function (json) {
                                                              return {
                                                                      type_: Json_decode$Json.optional((function (param) {
                                                                              return Json_decode$Json.field("type", Json_decode$Json.string, param);
                                                                            }), json),
                                                                      name: Json_decode$Json.field("name", Json_decode$Json.string, json)
                                                                    };
                                                            }), param);
                                              }), json)
                                      };
                              }), json);
                }), shaders)
        };
}

function _parseGlsl(json) {
  return Json_decode$Json.optional((function (param) {
                return Json_decode$Json.field("glsls", (function (json) {
                              return Json_decode$Json.array((function (json) {
                                            return {
                                                    type_: Json_decode$Json.field("type", Json_decode$Json.string, json),
                                                    name: Json_decode$Json.field("name", Json_decode$Json.string, json)
                                                  };
                                          }), json);
                            }), param);
              }), json);
}

function _parseVariable(json) {
  return Json_decode$Json.optional((function (param) {
                return Json_decode$Json.field("variables", (function (json) {
                              return {
                                      uniforms: Json_decode$Json.optional((function (param) {
                                              return Json_decode$Json.field("uniforms", (function (json) {
                                                            return Json_decode$Json.array((function (json) {
                                                                          return {
                                                                                  name: Json_decode$Json.field("name", Json_decode$Json.string, json),
                                                                                  field: Json_decode$Json.field("field", Json_decode$Json.string, json),
                                                                                  type_: Json_decode$Json.field("type", Json_decode$Json.string, json),
                                                                                  from: Json_decode$Json.field("from", Json_decode$Json.string, json)
                                                                                };
                                                                        }), json);
                                                          }), param);
                                            }), json),
                                      attributes: Json_decode$Json.optional((function (param) {
                                              return Json_decode$Json.field("attributes", (function (json) {
                                                            return Json_decode$Json.array((function (json) {
                                                                          var __x = Json_decode$Json.optional((function (param) {
                                                                                  return Json_decode$Json.field("type", Json_decode$Json.string, param);
                                                                                }), json);
                                                                          return {
                                                                                  name: Json_decode$Json.optional((function (param) {
                                                                                          return Json_decode$Json.field("name", Json_decode$Json.string, param);
                                                                                        }), json),
                                                                                  buffer: Json_decode$Json.field("buffer", Json_decode$Json.$$int, json),
                                                                                  type_: OptionSt$Commonlib.map(__x, (function (prim) {
                                                                                          return prim;
                                                                                        }))
                                                                                };
                                                                        }), json);
                                                          }), param);
                                            }), json)
                                    };
                            }), param);
              }), json);
}

function parseShaderLibs(shaderLibs) {
  return Json_decode$Json.array((function (json) {
                return {
                        name: Json_decode$Json.field("name", Json_decode$Json.string, json),
                        glsls: _parseGlsl(json),
                        variables: _parseVariable(json)
                      };
              }), shaderLibs);
}

exports._parseShaderMapData = _parseShaderMapData;
exports._parseDynamicBranchData = _parseDynamicBranchData;
exports.parseShaders = parseShaders;
exports._parseGlsl = _parseGlsl;
exports._parseVariable = _parseVariable;
exports.parseShaderLibs = parseShaderLibs;
/* No side effect */
