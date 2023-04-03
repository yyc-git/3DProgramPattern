let _functionContentForTs = `
  let _buildChunk =
      (
        [ top, define ]:[string, string],
        varDeclare: string,
        [ funcDeclare, funcDefine ]:[string, string],
        body: string
      ) => {
    return {
      top,
      define,
      varDeclare,
      funcDeclare,
      funcDefine,
      body
    }
  };

  export let getData = () =>{
  `

let _buildInitDataContentForTs = (glslContent: string) =>
  j`
        return {
          $glslContent
        }
  `

let _functionContentForRes = `
  open Chunk_converter.ChunkType


  let _buildChunk =
      (
        ( top:string, define:string ),
        varDeclare: string,
        ( funcDeclare:string, funcDefine:string ),
        body: string
      ) => {
    {
      top,
      define,
      varDeclare,
      funcDeclare,
      funcDefine,
      body
    }
  };

  let getData = () =>{
  `

let _buildInitDataContentForRes = (glslContent: string) =>
  j`
          $glslContent
  `

let _buildChunkFileContent = ((buildInitDataContent, functionContent), glslContent) =>
  functionContent ++ buildInitDataContent(glslContent) ++ "}"

let _writeToChunkFile = (destFilePath, doneFunc, content) => {
  Node.Fs.writeFileSync(destFilePath, content, #utf8)
  doneFunc(.) |> ignore
}

let _convertArrayToList = (array: array<string>) =>
  array |> Js.Array.reduce((list, str) => list{str, ...list}, list{})

let _createMergedTargetChunkFile = (
  _buildChunkFileContent,
  glslPathArr: array<string>,
  destFilePath: string,
  doneFunc,
) =>
  glslPathArr
  |> Js.Array.map(glslPath => Glob.sync(glslPath))
  |> ArrayUtils.flatten
  |> _convertArrayToList
  |> List.map(actualGlslPath =>
    Node.Fs.readFileSync(actualGlslPath, #utf8) |> Parse.parseSegment(actualGlslPath)
  )
  |> Parse.parseImport
  |> _buildChunkFileContent
  |> _writeToChunkFile(destFilePath, doneFunc)

let createMergedGLSLChunkFileForTs = (glslPathArr: array<string>, destFilePath: string, doneFunc) =>
  _createMergedTargetChunkFile(
    _buildChunkFileContent((_buildInitDataContentForTs, _functionContentForTs)),
    glslPathArr,
    destFilePath,
    doneFunc,
  )

let createMergedGLSLChunkFileForRes = (glslPathArr: array<string>, destFilePath: string, doneFunc) =>
  _createMergedTargetChunkFile(
    _buildChunkFileContent((_buildInitDataContentForRes, _functionContentForRes)),
    glslPathArr,
    destFilePath,
    doneFunc,
  )