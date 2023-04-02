

import * as Json_decode$Json from "../../../../../node_modules/json/lib/es6_global/src/Json_decode.bs.js";

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
          shaders: Json_decode$Json.field("shaders", (function (json) {
                  return Json_decode$Json.array((function (json) {
                                return {
                                        name: Json_decode$Json.field("name", Json_decode$Json.string, json),
                                        shaderChunks: Json_decode$Json.field("shader_chunks", (function (param) {
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
                                                                          return {
                                                                                  name: Json_decode$Json.optional((function (param) {
                                                                                          return Json_decode$Json.field("name", Json_decode$Json.string, param);
                                                                                        }), json),
                                                                                  buffer: Json_decode$Json.field("buffer", Json_decode$Json.$$int, json),
                                                                                  type_: Json_decode$Json.optional((function (param) {
                                                                                          return Json_decode$Json.field("type", Json_decode$Json.string, param);
                                                                                        }), json)
                                                                                };
                                                                        }), json);
                                                          }), param);
                                            }), json)
                                    };
                            }), param);
              }), json);
}

function parseShaderChunks(shaderChunks) {
  return Json_decode$Json.array((function (json) {
                return {
                        name: Json_decode$Json.field("name", Json_decode$Json.string, json),
                        glsls: _parseGlsl(json),
                        variables: _parseVariable(json)
                      };
              }), shaderChunks);
}

export {
  _parseShaderMapData ,
  _parseDynamicBranchData ,
  parseShaders ,
  _parseGlsl ,
  _parseVariable ,
  parseShaderChunks ,
}
/* No side effect */
