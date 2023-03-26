let _functionContent = `
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

let _buildInitDataContent = (glslContent: string) =>
  j`
        return {
          $glslContent
        }
  `

let _buildChunkFileContent = glslContent =>
  _functionContent ++ _buildInitDataContent(glslContent) ++ "}"

let _writeToChunkFile = (destFilePath, doneFunc, content) => {
  Node.Fs.writeFileSync(destFilePath, content, #utf8)
  doneFunc(.) |> ignore
}

let _convertArrayToList = (array: array<string>) =>
  array |> Js.Array.reduce((list, str) => list{str, ...list}, list{})

let createChunkFile = (glslPathArr: array<string>, destFilePath: string, doneFunc) =>
  glslPathArr
  |> Js.Array.map(glslPath => Glob.sync(glslPath))
  |> ArraySystem.flatten
  |> _convertArrayToList
  |> List.map(actualGlslPath =>
    Node.Fs.readFileSync(actualGlslPath, #utf8) |> Parse.parseSegment(actualGlslPath)
  )
  |> Parse.parseImport
  |> _buildChunkFileContent
  |> _writeToChunkFile(destFilePath, doneFunc)
