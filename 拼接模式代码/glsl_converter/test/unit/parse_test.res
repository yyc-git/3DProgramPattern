open Meta3d_jest

let _ = describe("parse", () => {
  open Expect
  open Expect.Operators
  open Sinon
  let sandbox = getSandboxDefaultVal()
  beforeEach(() => sandbox := createSandbox())
  describe("parseSegment", () =>
    test(
      "parse segment",
      () =>
        Parse.parseSegment(
          "../src/basic.glsl",
          `
         @top
         precision highp float;
         @end

         @define
         #import "common_vertex"
         @end



         @varDeclare

         varying vec2 v_mapCoord0;

         varying vec2 v_mapCoord1;
         @end

         @funcDeclare
         vec3 getDirectionLightDirByLightPos(vec3 lightPos);
         @end

         @funcDefine
         vec3 getDirectionLightDirByLightPos(vec3 lightPos){
             return lightPos - vec3(0.0);
         }
         @end

         @body
         gl_Position = u_pMatrix * u_vMatrix * mMatrix * vec4(a_position, 1.0);
         @end

         `,
        )
        |> StringTool.removeSegmentDataBlankNewLine
        |> expect ==
          ((
            "basic",
            ("top", "precision highp float;"),
            ("define", `#import "common_vertex"`),
            (
              "varDeclare",
              `
varying vec2 v_mapCoord0;

varying vec2 v_mapCoord1;
    `,
            ),
            (
              "funcDeclare",
              `
         vec3 getDirectionLightDirByLightPos(vec3 lightPos);
    `,
            ),
            (
              "funcDefine",
              `
         vec3 getDirectionLightDirByLightPos(vec3 lightPos){
             return lightPos - vec3(0.0);
         }
                    `,
            ),
            (
              "body",
              `
         gl_Position = u_pMatrix * u_vMatrix * mMatrix * vec4(a_position, 1.0);
                    `,
            ),
          )
          |> StringTool.removeSegmentDataBlankNewLine),
    )
  )
  //   describe("parseImport", () => {
  //     test("support one glsl's segment import other glsl's segment", () => {
  //       let list = list{
  //         (
  //           "basic0",
  //           ("top", ""),
  //           (
  //             "define",
  //             `
  // #import "basic1"
  // define A 1;
  // #import "basic2"
  // define B 2;
  //     `,
  //           ),
  //           (
  //             "varDeclare",
  //             `
  // #import "basic2"

  // varying vec2 v_mapCoord0;

  // #import "basic1"
  //     `,
  //           ),
  //           ("funcDeclare", ""),
  //           ("funcDefine", ""),
  //           ("body", ""),
  //         ),
  //         (
  //           "basic1",
  //           ("top", ""),
  //           (
  //             "define",
  //             `
  // define C 3;
  // #import "basic2"
  //     `,
  //           ),
  //           (
  //             "varDeclare",
  //             `
  // varying vec2 v_mapCoord1;
  //     `,
  //           ),
  //           ("funcDeclare", ""),
  //           ("funcDefine", ""),
  //           ("body", ""),
  //         ),
  //         (
  //           "basic2",
  //           ("top", ""),
  //           (
  //             "define",
  //             `
  // define D 4;
  //     `,
  //           ),
  //           (
  //             "varDeclare",
  //             `
  // varying vec2 v_mapCoord2;
  //     `,
  //           ),
  //           ("funcDeclare", ""),
  //           ("funcDefine", ""),
  //           ("body", ""),
  //         ),
  //       }
  //       Js.log(StringTool.removeBlankNewLine(Parse.parseImport(list)))
  //       StringTool.removeBlankNewLine(Parse.parseImport(list))
  //       |> expect ==
  //         StringTool.removeBlankNewLine(
  //           "\n|>set(\"basic0\",_buildChunk({||},{|defineC3;defineD4;defineA1;defineD4;defineB2;|},{|varyingvec2v_mapCoord2;varyingvec2v_mapCoord0;varyingvec2v_mapCoord1;|},{||},{||},{||}))\n|>set(\"basic1\",_buildChunk({||},{|defineC3;defineD4;|},{|varyingvec2v_mapCoord1;|},{||},{||},{||}))\n|>set(\"basic2\",_buildChunk({||},{|defineD4;|},{|varyingvec2v_mapCoord2;|},{||},{||},{||}))\n",
  //         )
  //     })
  //     describe("check", () => {
  //       test("check circular reference", () => {
  //         let list = list{
  //           (
  //             "basic0",
  //             ("top", ""),
  //             (
  //               "define",
  //               `
  // #import "basic1"
  // define A 1;
  //     `,
  //             ),
  //             ("varDeclare", ""),
  //             ("funcDeclare", ""),
  //             ("funcDefine", ""),
  //             ("body", ""),
  //           ),
  //           (
  //             "basic1",
  //             ("top", ""),
  //             (
  //               "define",
  //               `
  // define C 3;
  // #import "basic2"
  //     `,
  //             ),
  //             ("varDeclare", ""),
  //             ("funcDeclare", ""),
  //             ("funcDefine", ""),
  //             ("body", ""),
  //           ),
  //           (
  //             "basic2",
  //             ("top", ""),
  //             (
  //               "define",
  //               `
  // #import "basic0"
  //     `,
  //             ),
  //             ("varDeclare", ""),
  //             ("funcDeclare", ""),
  //             ("funcDefine", ""),
  //             ("body", ""),
  //           ),
  //         }
  //         expect(() => Parse.parseImport(list) |> ignore) |> toThrowMessage(
  //           "not allow circular reference(the reference path is basic0=>basic1=>basic2=>basic0)",
  //         )
  //       })
  //       describe("should import fileName, not filePath", () => {
  //         test("fileName shouldn't start with ./", () => {
  //           let list = list{
  //             (
  //               "basic0",
  //               ("top", ""),
  //               (
  //                 "define",
  //                 `
  // #import "./src/basic1"
  // define A 1;
  //     `,
  //               ),
  //               ("varDeclare", ""),
  //               ("funcDeclare", ""),
  //               ("funcDefine", ""),
  //               ("body", ""),
  //             ),
  //             (
  //               "basic1",
  //               ("top", ""),
  //               ("define", ""),
  //               ("varDeclare", ""),
  //               ("funcDeclare", ""),
  //               ("funcDefine", ""),
  //               ("body", ""),
  //             ),
  //           }
  //           expect(() => Parse.parseImport(list) |> ignore) |> toThrowMessage(
  //             "should import fileName, not filePath",
  //           )
  //         })
  //         test("fileName shouldn't start with ../", () => {
  //           let list = list{
  //             (
  //               "basic0",
  //               ("top", ""),
  //               (
  //                 "define",
  //                 `
  // #import "../src/basic1"
  // define A 1;
  //     `,
  //               ),
  //               ("varDeclare", ""),
  //               ("funcDeclare", ""),
  //               ("funcDefine", ""),
  //               ("body", ""),
  //             ),
  //             (
  //               "basic1",
  //               ("top", ""),
  //               ("define", ""),
  //               ("varDeclare", ""),
  //               ("funcDeclare", ""),
  //               ("funcDefine", ""),
  //               ("body", ""),
  //             ),
  //           }
  //           expect(() => Parse.parseImport(list) |> ignore) |> toThrowMessage(
  //             "should import fileName, not filePath",
  //           )
  //         })
  //       })
  //       test("should import fileName without extname", () => {
  //         let list = list{
  //           (
  //             "basic0",
  //             ("top", ""),
  //             (
  //               "define",
  //               `
  // #import "basic1.glsl"
  // define A 1;
  //     `,
  //             ),
  //             ("varDeclare", ""),
  //             ("funcDeclare", ""),
  //             ("funcDefine", ""),
  //             ("body", ""),
  //           ),
  //           (
  //             "basic1",
  //             ("top", ""),
  //             ("define", ""),
  //             ("varDeclare", ""),
  //             ("funcDeclare", ""),
  //             ("funcDefine", ""),
  //             ("body", ""),
  //           ),
  //         }
  //         expect(() => Parse.parseImport(list) |> ignore) |> toThrowMessage(
  //           "should import fileName without .glsl",
  //         )
  //       })
  //     })
  //   })
})
