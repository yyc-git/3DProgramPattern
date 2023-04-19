

import * as Curry from "../../../../../node_modules/rescript/lib/es6/curry.js";
import * as Caml_option from "../../../../../node_modules/rescript/lib/es6/caml_option.js";
import * as ListSt$Commonlib from "../../../../../node_modules/commonlib/lib/es6_global/src/structure/ListSt.bs.js";
import * as Result$Commonlib from "../../../../../node_modules/commonlib/lib/es6_global/src/structure/Result.bs.js";

function postOrderCata(nodeFunc, tree, param) {
  return Curry._3(nodeFunc, tree._0, tree._1, ListSt$Commonlib.map(tree._2, (function (__x) {
                    return postOrderCata(nodeFunc, __x, undefined);
                  })));
}

function postOrderCataWithParentNode(nodeFunc, tree, parentNodeOpt, param) {
  var parentNode = parentNodeOpt !== undefined ? Caml_option.valFromOption(parentNodeOpt) : undefined;
  var nodeData = tree._1;
  var pipelineName = tree._0;
  return Result$Commonlib.bind(ListSt$Commonlib.traverseResultM(tree._2, (function (__x) {
                    var param = Caml_option.some(tree);
                    var param$1;
                    return postOrderCataWithParentNode(nodeFunc, __x, param, param$1);
                  })), (function (children) {
                return Curry._4(nodeFunc, parentNode, pipelineName, nodeData, children);
              }));
}

export {
  postOrderCata ,
  postOrderCataWithParentNode ,
}
/* No side effect */
