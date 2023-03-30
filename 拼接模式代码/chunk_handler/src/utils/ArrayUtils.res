let findFirstExn = (arr, func) => {
  Commonlib.ArraySt.find(arr, func)->Commonlib.OptionSt.getExn
}