// TODO is already post order???
// let rec firstOrderCata = (
let rec postOrderCata = (
  ~nodeFunc: (
    PipelineBasicType.pipelineName,
    TreeType.nodeData,
    list<TreeType.tree>,
  ) => TreeType.tree,
  ~tree: TreeType.tree,
  (),
): TreeType.tree => {
  let recurse = postOrderCata(~nodeFunc)

  switch tree {
  | Node(pipelineName, nodeData, children) =>
    nodeFunc(pipelineName, nodeData, children->Commonlib.ListSt.map(recurse(~tree=_, ())))
  }
}

// let rec postOrderFoldWithParentNode = (
//   ~nodeFunc: (option<   TreeType.tree>, 'acc, PipelineBasicType.pipelineName,    TreeType.nodeData) => 'acc,
//   ~acc: 'acc,
//   ~tree:    TreeType.tree,
//   ~parentNode: option<   TreeType.tree>=None,
//   (),
// ): 'acc => {
// //   let recurse = firstOrderCata(~nodeFunc, ~acc, ~parentNode, ())

//   let recurse = (parentNode, acc, child) =>
//     postOrderFoldWithParentNode(
//       ~acc,
//       ~tree=child,
//       ~nodeFunc,
//       ~parentFolderNode,
//       (),
//     )

//   switch tree {
//   | Node(pipelineName, nodeData, children) =>
//     let localAccum =
//       nodeFunc(parentNode, acc, pipelineName, nodeData, children)

//     UIStateAssetService.fold(
//     //   seqFoldFunc,

//       recurse(
//         Some(
//           FolderNodeAssetService.buildNodeByNodeData(
//             ~nodeId,
//             ~nodeData=folderNodeData,
//             ~children,
//           ),
//         ),
//       ),
//       localAccum,
//       children,
//     )

//     // nodeFunc(pipelineName, nodeData, children->Commonlib.ListSt.map(recurse(~tree=_, ())))
//   }

// }

let rec postOrderCataWithParentNode = (
  ~nodeFunc: (
    option<TreeType.tree>,
    PipelineBasicType.pipelineName,
    TreeType.nodeData,
    list<TreeType.tree>,
  ) => Commonlib.Result.t2<TreeType.tree>,
  ~tree: TreeType.tree,
  ~parentNode: option<TreeType.tree>=None,
  (),
): Commonlib.Result.t2<TreeType.tree> => {
  let recurse = postOrderCataWithParentNode(~nodeFunc)

  switch tree {
  | Node(pipelineName, nodeData, children) =>
    children
    ->Commonlib.ListSt.traverseResultM(recurse(~tree=_, ~parentNode=tree->Some, ()))
    ->Commonlib.Result.bind(children => {
      nodeFunc(parentNode, pipelineName, nodeData, children)
    })
  }
}
