let removeBlankNewLine = str => str |> Js.String.replaceByRe(%re(`/[\s\n]+/g`), "")

let removeSegmentDataBlankNewLine = ((
  fileName,
  (topKey, topContent),
  (defineKey, defineContent),
  (varDeclareKey, varDeclareContent),
  (funcDeclareKey, funcDeclareContent),
  (funcDefineKey, funcDefineContent),
  (bodyKey, bodyContent),
)) => (
  fileName,
  (topKey, topContent |> removeBlankNewLine),
  (defineKey, defineContent |> removeBlankNewLine),
  (varDeclareKey, varDeclareContent |> removeBlankNewLine),
  (funcDeclareKey, funcDeclareContent |> removeBlankNewLine),
  (funcDefineKey, funcDefineContent |> removeBlankNewLine),
  (bodyKey, bodyContent |> removeBlankNewLine),
)

/* let compareByRemoveBlankNewLine = (actual, expected, expect) =>
 Obj.magic(_removeBlankNewLine(actual) |> Obj.magic(expect) == _removeBlankNewLine(expected)); */
