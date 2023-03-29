let _getFileName = (path: string) => Node.Path.basename_ext(path, PathExtend.extname(path))

let _buildGlslContent = (name: string, (top, define, varDeclare, funcDeclare, funcDefine, body)) =>
  switch PathExtend.extname(name) {
  | "" =>
    switch (name |> Js.String.startsWith("./"), name |> Js.String.startsWith("../")) {
    | (false, false) =>
      {j`"$name": _buildChunk(`} ++
      "[`" ++
      top ++
      "`" ++
      ", `" ++
      define ++
      "`" ++
      "]," ++
      "`" ++
      varDeclare ++
      "`" ++
      "," ++
      "[`" ++
      funcDeclare ++
      "`" ++
      ", `" ++
      funcDefine ++
      "`" ++
      "]," ++
      "`" ++
      body ++
      "`" ++
      "," ++ "), "
    | (_, _) => failwith(j`should import fileName, not filePath`)
    }
  | extname => failwith(j`should import fileName without $extname`)
  }

let rec _execRegex = (regex, content, startIndex, recordList, noneFunc, someFunc) =>
  switch regex->Js.Re.exec_(content) {
  | None => noneFunc(startIndex, recordList)
  | Some(result) =>
    _execRegex(
      regex,
      content,
      Js.Re.lastIndex(regex),
      someFunc(result, startIndex, recordList),
      noneFunc,
      someFunc,
    )
  }

let _getAllImportContent = (fileName: string, segmentName: string, segmentContent: string, map) => {
  let _createImportFlagRe = () => %re(`/#import\s+"(.+)"/g`)
  let rec _get = (fileNameList: list<string>, segmentName: string, segmentContent: string, map) => {
    let recordList = _execRegex(
      _createImportFlagRe(),
      segmentContent,
      0,
      list{},
      (startIndex, recordList) => list{
        (startIndex, Js.String.length(segmentContent), None),
        ...recordList,
      },
      (result, startIndex, recordList) => list{
        (
          startIndex,
          Js.Re.index(result),
          Js.Nullable.to_opt(
            Js.Nullable.bind(Js.Re.captures(result)[1], (. importFileName) =>
              switch PathExtend.extname(importFileName) {
              | "" =>
                switch (
                  importFileName |> Js.String.startsWith("./"),
                  importFileName |> Js.String.startsWith("../"),
                ) {
                | (false, false) =>
                  switch Js.Dict.get(map, importFileName) {
                  | None => failwith(j`import glsl file:$importFileName should exist`)
                  | Some(segmentMap) =>
                    let fileName = Js.Dict.unsafeGet(segmentMap, "fileName")
                    let newFileNameList = list{fileName, ...fileNameList}
                    if List.mem(fileName, fileNameList) {
                      let msg =
                        newFileNameList
                        |> List.rev
                        |> List.fold_left((str, fileName) => str ++ (fileName ++ "=>"), "")
                        |> Js.String.slice(~from=0, ~to_=-2)
                      failwith(j`not allow circular reference(the reference path is $msg)`)
                    } else {
                      switch Js.Dict.get(segmentMap, segmentName) {
                      | None =>
                        failwith(j`segment:$segmentName should exist in $importFileName.glsl`)
                      | Some(importContent) =>
                        if _createImportFlagRe()->Js.Re.test_(importContent) {
                          _get(newFileNameList, segmentName, importContent, map)
                        } else {
                          importContent
                        }
                      }
                    }
                  }
                | (_, _) => failwith(j`should import fileName, not filePath`)
                }
              | extname => failwith(j`should import fileName without $extname`)
              }
            ),
          ),
        ),
        ...recordList,
      },
    )
    recordList
    |> List.rev
    |> List.fold_left((content, (startIndex, endIndex, importSegmentContent)) =>
      content ++
      ((segmentContent |> Js.String.slice(~from=startIndex, ~to_=endIndex)) ++
      switch importSegmentContent {
      | None => ""
      | Some(content) => content
      })
    , "")
  }
  _get(list{fileName}, segmentName, segmentContent, map)
}

let _convertListToMap = list =>
  list |> List.fold_left(
    (
      map,
      (
        fileName,
        (topKey, topContent),
        (defineKey, defineContent),
        (varDeclareKey, varDeclareContent),
        (funcDeclareKey, funcDeclareContent),
        (funcDefineKey, funcDefineContent),
        (bodyKey, bodyContent),
      ),
    ) => {
      let segmentMap = Js.Dict.empty()
      Js.Dict.set(segmentMap, "fileName", fileName)
      Js.Dict.set(segmentMap, topKey, topContent)
      Js.Dict.set(segmentMap, defineKey, defineContent)
      Js.Dict.set(segmentMap, varDeclareKey, varDeclareContent)
      Js.Dict.set(segmentMap, funcDeclareKey, funcDeclareContent)
      Js.Dict.set(segmentMap, funcDefineKey, funcDefineContent)
      Js.Dict.set(segmentMap, bodyKey, bodyContent)
      Js.Dict.set(map, fileName, segmentMap)
      map
    },
    Js.Dict.empty(),
  )

let parseImport = list => {
  let map = _convertListToMap(list)
  list |> List.fold_left(
    (
      content,
      (
        fileName,
        (topKey, topContent),
        (defineKey, defineContent),
        (varDeclareKey, varDeclareContent),
        (funcDeclareKey, funcDeclareContent),
        (funcDefineKey, funcDefineContent),
        (bodyKey, bodyContent),
      ),
    ) =>
      content ++
      _buildGlslContent(
        fileName,
        (
          _getAllImportContent(fileName, topKey, topContent, map),
          _getAllImportContent(fileName, defineKey, defineContent, map),
          _getAllImportContent(fileName, varDeclareKey, varDeclareContent, map),
          _getAllImportContent(fileName, funcDeclareKey, funcDeclareContent, map),
          _getAllImportContent(fileName, funcDefineKey, funcDefineContent, map),
          _getAllImportContent(fileName, bodyKey, bodyContent, map),
        ),
      ),
    "",
  )
}

let parseSegment = (actualGlslPath: string, content: string) => {
  let segmentFlagList = list{
    "@top",
    "@define",
    "@varDeclare",
    "@funcDeclare",
    "@funcDefine",
    "@body",
  }
  let endFlagRe = %re(`/@end/g`)
  segmentFlagList
  |> List.fold_left((list, flag) => list{
    switch content |> Js.String.indexOf(flag) {
    | -1 => ""
    | index =>
      let startIndex = index + Js.String.length(flag)
      switch endFlagRe->Js.Re.exec_(content) {
      | None => failwith("@end should match to segement flag")
      | Some(result) =>
        content |> Js.String.slice(~from=startIndex, ~to_=Js.Re.index(result)) 
        |> Js.String.trim
      }
    },
    ...list,
  }, list{})
  |> List.rev
  |> (
    list => {
      open List
      (
        _getFileName(actualGlslPath),
        ("top", nth(list, 0)),
        ("define", nth(list, 1)),
        ("varDeclare", nth(list, 2)),
        ("funcDeclare", nth(list, 3)),
        ("funcDefine", nth(list, 4)),
        ("body", nth(list, 5)),
      )
    }
  )
}
