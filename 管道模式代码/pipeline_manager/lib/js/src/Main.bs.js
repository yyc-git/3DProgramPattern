'use strict';

var Curry = require("rescript/lib/js/curry.js");
var Js_array = require("rescript/lib/js/js_array.js");
var Caml_array = require("rescript/lib/js/caml_array.js");
var Log$Commonlib = require("commonlib/lib/js/src/log/Log.bs.js");
var ListSt$Commonlib = require("commonlib/lib/js/src/structure/ListSt.bs.js");
var MostService$Most = require("most/lib/js/src/MostService.bs.js");
var Result$Commonlib = require("commonlib/lib/js/src/structure/Result.bs.js");
var ArraySt$Commonlib = require("commonlib/lib/js/src/structure/ArraySt.bs.js");
var OptionSt$Commonlib = require("commonlib/lib/js/src/structure/OptionSt.bs.js");
var Exception$Commonlib = require("commonlib/lib/js/src/structure/Exception.bs.js");
var NullableSt$Commonlib = require("commonlib/lib/js/src/structure/NullableSt.bs.js");
var TreeNode$Pipeline_manager = require("./TreeNode.bs.js");
var ImmutableHashMap$Commonlib = require("commonlib/lib/js/src/structure/hash_map/ImmutableHashMap.bs.js");
var IterateTree$Pipeline_manager = require("./IterateTree.bs.js");
var OperateTree$Pipeline_manager = require("./OperateTree.bs.js");

function _findGroup(groupName, groups) {
  if (ArraySt$Commonlib.length(ArraySt$Commonlib.filter(groups, (function (param) {
                return param.name === groupName;
              }))) > 1) {
    Exception$Commonlib.throwErr(Exception$Commonlib.buildErr("groupName:" + groupName + " has more than one in groups"));
  }
  var group = ListSt$Commonlib.getBy(ListSt$Commonlib.fromArray(groups), (function (param) {
          return param.name === groupName;
        }));
  if (group !== undefined) {
    return group;
  } else {
    return Exception$Commonlib.throwErr(Exception$Commonlib.buildErr("groupName:" + groupName + " not in groups"));
  }
}

function _getStates(stateOperateFuncs, systemState) {
  return Curry._1(stateOperateFuncs[2], systemState).states;
}

function _setStates(stateOperateFuncs, systemState, states) {
  var state = Curry._1(stateOperateFuncs[2], systemState);
  return Curry._2(stateOperateFuncs[3], systemState, {
              allRegisteredPipelines: state.allRegisteredPipelines,
              states: states
            });
}

function _buildJobStream(stateOperateFuncs, param, is_set_state, exec) {
  var setSystemState = stateOperateFuncs[1];
  var unsafeGetSystemState = stateOperateFuncs[0];
  var __x = Curry._1(param.just, exec);
  var __x$1 = Curry._2(param.flatMap, (function (func) {
          return Curry._2(func, Curry._1(unsafeGetSystemState, undefined), {
                      getStatesFunc: (function (param) {
                          return _getStates(stateOperateFuncs, param);
                        }),
                      setStatesFunc: (function (param, param$1) {
                          return _setStates(stateOperateFuncs, param, param$1);
                        })
                    });
        }), __x);
  return Curry._2(param.map, (function (systemState) {
                if (NullableSt$Commonlib.getWithDefault(is_set_state, true)) {
                  return Curry._1(setSystemState, systemState);
                }
                
              }), __x$1);
}

function _getExec(_getExecs, pipelineName, jobName) {
  while(true) {
    var getExecs = _getExecs;
    if (ListSt$Commonlib.length(getExecs) === 0) {
      return Exception$Commonlib.throwErr(Exception$Commonlib.buildErr(Log$Commonlib.buildFatalMessage("_getExec", "can't get exec with pipelineName:" + pipelineName + ", jobName:" + jobName + "", "", "", "")));
    }
    if (getExecs) {
      var result = Curry._2(getExecs.hd, pipelineName, jobName);
      if (!(result == null)) {
        return OptionSt$Commonlib.getExn(OptionSt$Commonlib.fromNullable(result));
      }
      _getExecs = getExecs.tl;
      continue ;
    }
    throw {
          RE_EXN_ID: "Match_failure",
          _1: [
            "Main.res",
            111,
            14
          ],
          Error: new Error()
        };
  };
}

function _buildJobStreams(stateOperateFuncs, mostService, param, param$1, groups) {
  var pipelineName = param$1[0];
  var getExecs = param[1];
  var buildPipelineStreamFunc = param[0];
  return ListSt$Commonlib.reduce(ListSt$Commonlib.fromArray(param$1[1]), /* [] */0, (function (streams, param) {
                var name = param.name;
                if (param.type_ === "group") {
                  var group = _findGroup(name, groups);
                  var stream = Curry._6(buildPipelineStreamFunc, stateOperateFuncs, mostService, getExecs, pipelineName, group, groups);
                  return ListSt$Commonlib.push(streams, stream);
                }
                var exec = _getExec(getExecs, pipelineName, name);
                return ListSt$Commonlib.push(streams, _buildJobStream(stateOperateFuncs, mostService, param.is_set_state, exec));
              }));
}

function _buildPipelineStream(stateOperateFuncs, mostService, getExecs, pipelineName, param, groups) {
  var streams = _buildJobStreams(stateOperateFuncs, mostService, [
        _buildPipelineStream,
        getExecs
      ], [
        pipelineName,
        param.elements
      ], groups);
  return Curry._1(param.link === "merge" ? mostService.mergeArray : mostService.concatArray, ListSt$Commonlib.toArray(streams));
}

function parse(systemState, stateOperateFuncs, mostService, getExecs, param) {
  var groups = param.groups;
  var unsafeGetSystemState = stateOperateFuncs[0];
  var group = _findGroup(param.first_group, groups);
  Curry._1(stateOperateFuncs[1], systemState);
  var __x = _buildPipelineStream(stateOperateFuncs, mostService, getExecs, param.name, group, groups);
  return Curry._2(mostService.map, (function (param) {
                return Curry._1(unsafeGetSystemState, undefined);
              }), __x);
}

var ParsePipelineData = {
  _findGroup: _findGroup,
  _getStates: _getStates,
  _setStates: _setStates,
  _buildJobStream: _buildJobStream,
  _getExec: _getExec,
  _buildJobStreams: _buildJobStreams,
  _buildPipelineStream: _buildPipelineStream,
  parse: parse
};

function createState(param) {
  return {
          allRegisteredPipelines: /* [] */0,
          states: ImmutableHashMap$Commonlib.createEmpty(undefined, undefined)
        };
}

function registerPipeline(state, pipeline, jobOrders) {
  return {
          allRegisteredPipelines: ListSt$Commonlib.push(state.allRegisteredPipelines, [
                pipeline,
                jobOrders
              ]),
          states: state.states
        };
}

function unregisterPipeline(state, targetPipelineName) {
  return {
          allRegisteredPipelines: ListSt$Commonlib.filter(state.allRegisteredPipelines, (function (param) {
                  return param[0].pipelineName !== targetPipelineName;
                })),
          states: state.states
        };
}

function _findInsertPipelineName(insertElementName, allRegisteredPipelines) {
  return OptionSt$Commonlib.get(OptionSt$Commonlib.map(ListSt$Commonlib.find(allRegisteredPipelines, (function (param) {
                        var match = Caml_array.get(param[0].allPipelineData, 0);
                        return ArraySt$Commonlib.includesByFunc(match.groups, (function (param) {
                                      return ArraySt$Commonlib.includesByFunc(param.elements, (function (param) {
                                                    return param.name === insertElementName;
                                                  }));
                                    }));
                      })), (function (param) {
                    return param[0].pipelineName;
                  })));
}

function _check(registeredPipeline) {
  if (ArraySt$Commonlib.length(registeredPipeline[0].allPipelineData) <= 1 && ArraySt$Commonlib.length(registeredPipeline[1]) <= 1) {
    return Result$Commonlib.succeed(registeredPipeline);
  } else {
    return Result$Commonlib.failWith(Log$Commonlib.buildErrorMessage("allPipelineData or jobOrders should has the same pipeline <= 1", "", "", "", ""));
  }
}

function _findAllSpecificPipelineRelatedData(allRegisteredPipelines, targetPipelineName) {
  return Result$Commonlib.bind(Result$Commonlib.mapSuccess(ListSt$Commonlib.traverseResultM(allRegisteredPipelines, (function (param) {
                        var pipeline = param[0];
                        return _check([
                                    {
                                      pipelineName: pipeline.pipelineName,
                                      createState: pipeline.createState,
                                      getExec: pipeline.getExec,
                                      allPipelineData: ArraySt$Commonlib.filter(pipeline.allPipelineData, (function (param) {
                                              return param.name === targetPipelineName;
                                            }))
                                    },
                                    ArraySt$Commonlib.filter(param[1], (function (param) {
                                            return param.pipelineName === targetPipelineName;
                                          }))
                                  ]);
                      })), (function (allRegisteredPipelines) {
                    return ListSt$Commonlib.filter(allRegisteredPipelines, (function (param) {
                                  return ArraySt$Commonlib.length(param[0].allPipelineData) === 1;
                                }));
                  })), (function (allRegisteredPipelines) {
                return ListSt$Commonlib.traverseResultM(ListSt$Commonlib.map(allRegisteredPipelines, (function (param) {
                                  var registeredPipeline = param[0];
                                  return [
                                          registeredPipeline.pipelineName,
                                          registeredPipeline.getExec,
                                          Caml_array.get(registeredPipeline.allPipelineData, 0),
                                          ArraySt$Commonlib.getFirst(param[1])
                                        ];
                                })), (function (param) {
                              var pipelineData = param[2];
                              var getExec = param[1];
                              var pipelineName = param[0];
                              return Result$Commonlib.mapSuccess(OptionSt$Commonlib.sequenceResultM(OptionSt$Commonlib.map(param[3], (function (param) {
                                                    var insertAction = param.insertAction;
                                                    var insertElementName = param.insertElementName;
                                                    return Result$Commonlib.mapSuccess(_findInsertPipelineName(insertElementName, allRegisteredPipelines), (function (insertPipelineName) {
                                                                  return {
                                                                          insertPipelineName: insertPipelineName,
                                                                          insertElementName: insertElementName,
                                                                          insertAction: insertAction
                                                                        };
                                                                }));
                                                  }))), (function (jobOrderOpt) {
                                            return {
                                                    pipelineName: pipelineName,
                                                    getExec: getExec,
                                                    pipelineData: pipelineData,
                                                    jobOrder: jobOrderOpt
                                                  };
                                          }));
                            }));
              }));
}

function _handleInsertedAsRootNode(treeDataList, param) {
  var nodeInsertPipelineNameOpt = param[4];
  var nodeJobOrderOpt = param[3];
  var pipelineData = param[2];
  var getExec = param[1];
  var pipelineName = param[0];
  return ListSt$Commonlib.reduce(treeDataList, [
              /* [] */0,
              undefined
            ], (function (param, treeData) {
                var insertPipelineNameOpt = treeData[1];
                var insertedTreeOpt = param[1];
                var newTreeDataList = param[0];
                if (insertPipelineNameOpt === undefined) {
                  return [
                          ListSt$Commonlib.addInReduce(newTreeDataList, treeData),
                          insertedTreeOpt
                        ];
                }
                if (insertPipelineNameOpt !== pipelineName) {
                  return [
                          ListSt$Commonlib.addInReduce(newTreeDataList, treeData),
                          insertedTreeOpt
                        ];
                }
                var insertedTree = TreeNode$Pipeline_manager.buildNode(pipelineName, [
                      getExec,
                      pipelineData,
                      nodeJobOrderOpt
                    ], treeData[0]);
                return [
                        ListSt$Commonlib.addInReduce(newTreeDataList, [
                              {
                                hd: insertedTree,
                                tl: /* [] */0
                              },
                              nodeInsertPipelineNameOpt
                            ]),
                        insertedTree
                      ];
              }));
}

function _add(treeDataList, node, insertPipelineNameOpt) {
  return {
          hd: [
            {
              hd: node,
              tl: /* [] */0
            },
            insertPipelineNameOpt
          ],
          tl: treeDataList
        };
}

function _insertToAsChildNodeOrSameLevelTree(treeDataList, nodeInsertPipelineName, node) {
  return ListSt$Commonlib.reduce(treeDataList, [
              /* [] */0,
              false
            ], (function (param, param$1) {
                var insertPipelineNameOpt = param$1[1];
                var sameLevelTreeList = param$1[0];
                var isInsertTo = param[1];
                var newTreeDataList = param[0];
                var match;
                var exit = 0;
                if (insertPipelineNameOpt !== undefined && insertPipelineNameOpt === nodeInsertPipelineName) {
                  match = [
                    ListSt$Commonlib.addInReduce(newTreeDataList, [
                          ListSt$Commonlib.push(sameLevelTreeList, node),
                          insertPipelineNameOpt
                        ]),
                    true
                  ];
                } else {
                  exit = 1;
                }
                if (exit === 1) {
                  var match$1 = ListSt$Commonlib.reduce(sameLevelTreeList, [
                        /* [] */0,
                        false
                      ], (function (param, tree) {
                          var isInsertTo = param[1];
                          var match = OperateTree$Pipeline_manager.insertNode(tree, nodeInsertPipelineName, node);
                          return [
                                  ListSt$Commonlib.addInReduce(param[0], match[0]),
                                  isInsertTo ? isInsertTo : match[1]
                                ];
                        }));
                  match = [
                    ListSt$Commonlib.addInReduce(newTreeDataList, [
                          match$1[0],
                          insertPipelineNameOpt
                        ]),
                    match$1[1]
                  ];
                }
                return [
                        match[0],
                        isInsertTo ? isInsertTo : match[1]
                      ];
              }));
}

function _removeInsertedTree(treeDataList, insertedTree) {
  return ListSt$Commonlib.filter(ListSt$Commonlib.map(treeDataList, (function (param) {
                    return [
                            ListSt$Commonlib.filter(param[0], (function (sameLevelTree) {
                                    return !TreeNode$Pipeline_manager.isEqual(sameLevelTree, insertedTree);
                                  })),
                            param[1]
                          ];
                  })), (function (param) {
                return ListSt$Commonlib.length(param[0]) > 0;
              }));
}

function _getTree(treeDataList) {
  if (ListSt$Commonlib.length(treeDataList) !== 1) {
    return Result$Commonlib.failWith(Log$Commonlib.buildErrorMessage("treeDataList.length should be 1", "", "", "", ""));
  } else {
    return Result$Commonlib.bind(OptionSt$Commonlib.get(ListSt$Commonlib.head(treeDataList)), (function (param) {
                  var sameLevelTreeList = param[0];
                  if (ListSt$Commonlib.length(sameLevelTreeList) !== 1) {
                    return Result$Commonlib.failWith(Log$Commonlib.buildErrorMessage("sameLevelTreeList.length should be 1", "", "", "", ""));
                  } else {
                    return OptionSt$Commonlib.get(ListSt$Commonlib.head(sameLevelTreeList));
                  }
                }));
  }
}

function _buildTree(allSpecificPipelineRelatedData) {
  return _getTree(ListSt$Commonlib.reduce(allSpecificPipelineRelatedData, /* [] */0, (function (treeDataList, param) {
                    var jobOrder = param.jobOrder;
                    var pipelineData = param.pipelineData;
                    var getExec = param.getExec;
                    var pipelineName = param.pipelineName;
                    if (jobOrder !== undefined) {
                      var insertPipelineName = jobOrder.insertPipelineName;
                      var nodeJobOrderOpt = {
                        insertElementName: jobOrder.insertElementName,
                        insertAction: jobOrder.insertAction
                      };
                      var match = _handleInsertedAsRootNode(treeDataList, [
                            pipelineName,
                            getExec,
                            pipelineData,
                            nodeJobOrderOpt,
                            insertPipelineName
                          ]);
                      var insertedTreeOpt = match[1];
                      var treeDataList$1 = match[0];
                      if (insertedTreeOpt !== undefined) {
                        var match$1 = _insertToAsChildNodeOrSameLevelTree(treeDataList$1, insertPipelineName, insertedTreeOpt);
                        var treeDataList$2 = match$1[0];
                        if (match$1[1]) {
                          return _removeInsertedTree(treeDataList$2, insertedTreeOpt);
                        } else {
                          return treeDataList$2;
                        }
                      }
                      var node = TreeNode$Pipeline_manager.buildNode(pipelineName, [
                            getExec,
                            pipelineData,
                            nodeJobOrderOpt
                          ], /* [] */0);
                      var match$2 = _insertToAsChildNodeOrSameLevelTree(treeDataList$1, insertPipelineName, node);
                      var treeDataList$3 = match$2[0];
                      if (match$2[1]) {
                        return treeDataList$3;
                      } else {
                        return _add(treeDataList$3, node, insertPipelineName);
                      }
                    }
                    var match$3 = _handleInsertedAsRootNode(treeDataList, [
                          pipelineName,
                          getExec,
                          pipelineData,
                          undefined,
                          undefined
                        ]);
                    var treeDataList$4 = match$3[0];
                    if (OptionSt$Commonlib.isSome(match$3[1])) {
                      return treeDataList$4;
                    } else {
                      return _add(treeDataList$4, TreeNode$Pipeline_manager.buildNode(pipelineName, [
                                      getExec,
                                      pipelineData,
                                      undefined
                                    ], /* [] */0), undefined);
                    }
                  })));
}

function _buildFirstGroupElement(groups, first_group) {
  return OptionSt$Commonlib.get(OptionSt$Commonlib.map(ArraySt$Commonlib.find(groups, (function (param) {
                        return param.name === first_group;
                      })), (function (param) {
                    return {
                            name: param.name,
                            type_: "group",
                            is_set_state: false
                          };
                  })));
}

function _insertElement(groups, insertAction, insertElementName, insertElement) {
  return ArraySt$Commonlib.map(groups, (function (group) {
                return {
                        name: group.name,
                        link: group.link,
                        elements: ArraySt$Commonlib.reduceOneParam(group.elements, (function (result, element) {
                                if (element.name === insertElementName) {
                                  if (insertAction === "after") {
                                    return ArraySt$Commonlib.push(ArraySt$Commonlib.push(result, element), insertElement);
                                  } else {
                                    return ArraySt$Commonlib.push(ArraySt$Commonlib.push(result, insertElement), element);
                                  }
                                } else {
                                  return ArraySt$Commonlib.push(result, element);
                                }
                              }), [])
                      };
              }));
}

var _mergeGroups = Js_array.concat;

var _mergeGetElementFuncs = ListSt$Commonlib.concat;

function _mergeToRootNode(tree) {
  return Result$Commonlib.mapSuccess(IterateTree$Pipeline_manager.postOrderCataWithParentNode((function (parentNodeOpt, pipelineName, nodeData) {
                    var getExecs = nodeData.getExecs;
                    var pipelineData = nodeData.pipelineData;
                    var jobOrder = nodeData.jobOrder;
                    return function (children) {
                      var node = TreeNode$Pipeline_manager.buildNodeByNodeData(pipelineName, nodeData, children);
                      if (parentNodeOpt === undefined) {
                        return Result$Commonlib.succeed(node);
                      }
                      var parentNodeData = TreeNode$Pipeline_manager.getNodeData(parentNodeOpt);
                      return Result$Commonlib.bind(OptionSt$Commonlib.get(jobOrder), (function (param) {
                                    var insertAction = param.insertAction;
                                    var insertElementName = param.insertElementName;
                                    return Result$Commonlib.mapSuccess(_buildFirstGroupElement(pipelineData.groups, pipelineData.first_group), (function (insertElement) {
                                                  var init = parentNodeData.pipelineData;
                                                  parentNodeData.pipelineData = {
                                                    name: init.name,
                                                    groups: Js_array.concat(_insertElement(parentNodeData.pipelineData.groups, insertAction, insertElementName, insertElement), pipelineData.groups),
                                                    first_group: init.first_group
                                                  };
                                                  parentNodeData.getExecs = ListSt$Commonlib.concat(parentNodeData.getExecs, getExecs);
                                                  return node;
                                                }));
                                  }));
                    };
                  }), tree, undefined, undefined), (function (tree) {
                var match = TreeNode$Pipeline_manager.getNodeData(tree);
                var getExecs = match.getExecs;
                var pipelineData = match.pipelineData;
                return [
                        getExecs,
                        pipelineData
                      ];
              }));
}

function merge(allRegisteredPipelines, pipelineName) {
  return Result$Commonlib.bind(Result$Commonlib.bind(_findAllSpecificPipelineRelatedData(allRegisteredPipelines, pipelineName), _buildTree), _mergeToRootNode);
}

var MergePipelineData = {
  _findInsertPipelineName: _findInsertPipelineName,
  _check: _check,
  _findAllSpecificPipelineRelatedData: _findAllSpecificPipelineRelatedData,
  _handleInsertedAsRootNode: _handleInsertedAsRootNode,
  _isInserted: OptionSt$Commonlib.isSome,
  _add: _add,
  _insertToAsChildNodeOrSameLevelTree: _insertToAsChildNodeOrSameLevelTree,
  _removeInsertedTree: _removeInsertedTree,
  _getTree: _getTree,
  _buildTree: _buildTree,
  _buildFirstGroupElement: _buildFirstGroupElement,
  _insertElement: _insertElement,
  _mergeGroups: _mergeGroups,
  _mergeGetElementFuncs: _mergeGetElementFuncs,
  _mergeToRootNode: _mergeToRootNode,
  merge: merge
};

function runPipeline(systemState, stateOperateFuncs, pipelineName) {
  var match = Curry._1(stateOperateFuncs[2], systemState);
  return Result$Commonlib.handleFail(Result$Commonlib.mapSuccess(merge(match.allRegisteredPipelines, pipelineName), (function (param) {
                    return parse(systemState, stateOperateFuncs, MostService$Most.service, param[0], param[1]);
                  })), Exception$Commonlib.throwErr);
}

function init(systemState, stateOperateFuncs) {
  var state = Curry._1(stateOperateFuncs[0], systemState);
  return Curry._2(stateOperateFuncs[1], systemState, {
              allRegisteredPipelines: state.allRegisteredPipelines,
              states: ListSt$Commonlib.reduce(state.allRegisteredPipelines, ImmutableHashMap$Commonlib.createEmpty(undefined, undefined), (function (states, param) {
                      var match = param[0];
                      return ImmutableHashMap$Commonlib.set(states, match.pipelineName, Curry._1(match.createState, systemState));
                    }))
            });
}

exports.ParsePipelineData = ParsePipelineData;
exports.createState = createState;
exports.registerPipeline = registerPipeline;
exports.unregisterPipeline = unregisterPipeline;
exports.MergePipelineData = MergePipelineData;
exports.runPipeline = runPipeline;
exports.init = init;
/* MostService-Most Not a pure module */
