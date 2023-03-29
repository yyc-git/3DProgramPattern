

import * as Curry from "../../../../../../node_modules/rescript/lib/es6/curry.js";
import * as Sinon from "../../../../../../node_modules/meta3d-bs-sinon/lib/es6_global/src/sinon.bs.js";
import * as Sinon$1 from "sinon";
import * as Meta3d_jest from "../../../../../../node_modules/meta3d-bs-jest/lib/es6_global/src/meta3d_jest.bs.js";
import * as Parse$Glsl_converter from "../../src/Parse.bs.js";
import * as StringTool$Glsl_converter from "../tool/StringTool.bs.js";

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

export {
  
}
/*  Not a pure module */
