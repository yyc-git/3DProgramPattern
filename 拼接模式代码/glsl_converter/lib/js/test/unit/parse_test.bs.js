'use strict';

var Curry = require("rescript/lib/js/curry.js");
var Sinon = require("meta3d-bs-sinon/lib/js/src/sinon.bs.js");
var Sinon$1 = require("sinon");
var Meta3d_jest = require("meta3d-bs-jest/lib/js/src/meta3d_jest.bs.js");
var Parse$Glsl_converter = require("../../src/Parse.bs.js");
var StringTool$Glsl_converter = require("../tool/StringTool.bs.js");

Meta3d_jest.describe("parse", (function (param) {
        var sandbox = Sinon.getSandboxDefaultVal(undefined);
        beforeEach(function () {
              sandbox.contents = Sinon$1.sandbox.create();
            });
        Meta3d_jest.describe("parseSegment", (function (param) {
                Meta3d_jest.test("parse segment", (function (param) {
                        return Curry._2(Meta3d_jest.Expect.Operators.$eq, Meta3d_jest.Expect.expect(StringTool$Glsl_converter.removeSegmentDataBlankNewLine(Parse$Glsl_converter.parseSegment("../src/basic.glsl", "\n         @top\n         precision highp float;\n         @end\n\n         @define\n         #import \"common_vertex\"\n         @end\n\n\n\n         @varDeclare\n\n         varying vec2 v_mapCoord0;\n\n         varying vec2 v_mapCoord1;\n         @end\n\n         @funcDeclare\n         vec3 getDirectionLightDirByLightPos(vec3 lightPos);\n         @end\n\n         @funcDefine\n         vec3 getDirectionLightDirByLightPos(vec3 lightPos){\n             return lightPos - vec3(0.0);\n         }\n         @end\n\n         @body\n         gl_Position = u_pMatrix * u_vMatrix * mMatrix * vec4(a_position, 1.0);\n         @end\n\n         "))), StringTool$Glsl_converter.removeSegmentDataBlankNewLine([
                                        "basic",
                                        [
                                          "top",
                                          "precision highp float;"
                                        ],
                                        [
                                          "define",
                                          "#import \"common_vertex\""
                                        ],
                                        [
                                          "varDeclare",
                                          "\nvarying vec2 v_mapCoord0;\n\nvarying vec2 v_mapCoord1;\n    "
                                        ],
                                        [
                                          "funcDeclare",
                                          "\n         vec3 getDirectionLightDirByLightPos(vec3 lightPos);\n    "
                                        ],
                                        [
                                          "funcDefine",
                                          "\n         vec3 getDirectionLightDirByLightPos(vec3 lightPos){\n             return lightPos - vec3(0.0);\n         }\n                    "
                                        ],
                                        [
                                          "body",
                                          "\n         gl_Position = u_pMatrix * u_vMatrix * mMatrix * vec4(a_position, 1.0);\n                    "
                                        ]
                                      ]));
                      }));
              }));
      }));

/*  Not a pure module */
