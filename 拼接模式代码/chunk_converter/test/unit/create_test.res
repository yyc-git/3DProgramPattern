// open Wonder_jest

// let _ = describe("create shunk system file", () => {
//   open Expect
//   open Expect.Operators
//   open Sinon
//   let sandbox = getSandboxDefaultVal()
//   let destFilePath = ref("./chunkSystem.re")
//   beforeEach(() => sandbox := createSandbox())
//   afterEach(() =>
//     if Node.Fs.existsSync(destFilePath.contents) {
//       Node.Fs.unlinkSync(destFilePath.contents)
//     } else {
//       ()
//     }
//   )
//   test("add private functions", () => {
//     Create.createShunkSystemFile([], destFilePath.contents, (. ()) => ())
//     Node.Fs.readFileSync(destFilePath.contents, #utf8)
//     |> StringTool.removeBlankNewLine
//     |> expect
//     |> toContainString(
//       `
// open ChunkType;

// let _getGLSLChunkMap = (state) => state.glslChunkRecord.chunkMap;

// let getChunk = (name: string, state) =>
//   state |> _getGLSLChunkMap |> WonderCommonlib.MutableHashMapService.get(name) |> Js.Option.getExn;

// let _buildChunk =
//     (
//       (top: string,
//       define: string),
//       varDeclare: string,
//       (funcDeclare: string,
//       funcDefine: string),
//       body: string
//     ) => {
//   top,
//   define,
//   varDeclare,
//   funcDeclare,
//   funcDefine,
//   body
// };
// ` |> StringTool.removeBlankNewLine,
//     )
//   })
//   test("test parsed glsl content", () => {
//     Create.createShunkSystemFile(
//       ["./test/res/glsl1.glsl", "./test/res/glsl2.glsl"],
//       destFilePath.contents,
//       (. ()) => (),
//     )
//     Node.Fs.readFileSync(destFilePath.contents, #utf8)
//     |> StringTool.removeBlankNewLine
//     |> expect
//     |> toContainString(
//       "|> set(\"glsl2\", _buildChunk({||},{|define B 2;|},{|varying vec2 v_mapCoord2;|},{|vec3 func2(vec3 lightPos);|},{|vec3 func2(vec3 lightPos){\n                       return vec3(0.5);\n                   }|},{|gl_FragColor = vec4(1.0,0.5,1.0,1.0);|}))\n                |> set(\"glsl1\", let_buildChunk=((top:string,define:string),varDeclare:string,(funcDeclare:string,funcDefine:string),body:string)=>{top,define,varDeclare,funcDeclare,funcDefine,body};,{|vec3 func2(vec3 lightPos){\n                       return vec3(0.5);\n                   }\n                   vec3 func1(vec3 lightPos){\n                       return vec3(1.0);\n                   }|},{|gl_Position = u_pMatrix * u_vMatrix * mMatrix * vec4(a_position, 1.0);|}))" |> StringTool.removeBlankNewLine,
//     )
//   })
//   test("exec done func", () => {
//     let done_ = createEmptyStubWithJsObjSandbox(sandbox)
//     Create.createShunkSystemFile(["./test/res/glsl2.glsl"], destFilePath.contents, done_)
//     Node.Fs.readFileSync(destFilePath.contents, #utf8) |> ignore
//     done_ |> expect |> toCalledOnce
//   })
//   test("support pass glob path array", () => {
//     let done_ = createEmptyStubWithJsObjSandbox(sandbox)
//     Create.createShunkSystemFile(["./test/res/glsl*"], destFilePath.contents, done_)
//     let content =
//       Node.Fs.readFileSync(destFilePath.contents, #utf8) |> StringTool.removeBlankNewLine
//     (content |> Js.String.includes("glsl1"), content |> Js.String.includes("glsl2"))
//     |> expect == (true, true)
//   })
// })
