

import * as TreeNode$Pipeline_manager from "./TreeNode.bs.js";
import * as IterateTree$Pipeline_manager from "./IterateTree.bs.js";

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

export {
  insertNode ,
}
/* No side effect */
