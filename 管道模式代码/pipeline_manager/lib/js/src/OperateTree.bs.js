'use strict';

var TreeNode$Pipeline_manager = require("./TreeNode.bs.js");
var IterateTree$Pipeline_manager = require("./IterateTree.bs.js");

function insertNode(tree, targetPipelineName, node) {
  var isInsert = {
    contents: false
  };
  return [
          IterateTree$Pipeline_manager.postOrderCata((function (pipelineName, nodeData, children) {
                  if (pipelineName === targetPipelineName) {
                    isInsert.contents = true;
                    return TreeNode$Pipeline_manager.buildNodeByNodeData(pipelineName, nodeData, {
                                hd: node,
                                tl: children
                              });
                  } else {
                    return TreeNode$Pipeline_manager.buildNodeByNodeData(pipelineName, nodeData, children);
                  }
                }), tree, undefined),
          isInsert.contents
        ];
}

exports.insertNode = insertNode;
/* No side effect */
