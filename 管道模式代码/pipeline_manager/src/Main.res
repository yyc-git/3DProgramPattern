module ParsePipelineData = {
  // TODO use Result instead of throw err

  open PipelineJsonType

  let _findGroup = (groupName, groups) => {
    groups
    ->Commonlib.ArraySt.filter(({name}: group) => name === groupName)
    ->Commonlib.ArraySt.length > 1
      ? {
          Commonlib.Exception.throwErr(
            Commonlib.Exception.buildErr(j`groupName:$groupName has more than one in groups`),
          )
        }
      : {
          ()
        }

    switch groups
    ->Commonlib.ListSt.fromArray
    ->Commonlib.ListSt.getBy(({name}: group) => name === groupName) {
    | None =>
      Commonlib.Exception.throwErr(
        Commonlib.Exception.buildErr(j`groupName:$groupName not in groups`),
      )
    | Some(group) => group
    }
  }

  let _getStates = (
    (
      unsafeGetSystemState,
      setSystemState,
      unsafeGetPipelineManagerState,
      setPipelineManagerState,
    ) as stateOperateFuncs,
    systemState: StateType.systemState,
  ) => {
    let {states}: StateType.state = unsafeGetPipelineManagerState(systemState)

    states
  }

  let _setStates = (
    (
      unsafeGetSystemState,
      setSystemState,
      unsafeGetPipelineManagerState,
      setPipelineManagerState,
    ) as stateOperateFuncs,
    systemState: StateType.systemState,
    states,
  ): StateType.systemState => {
    let state: StateType.state = unsafeGetPipelineManagerState(systemState)

    setPipelineManagerState(
      systemState,
      {
        ...state,
        states,
      },
    )
  }

  let _buildJobStream = (
    (
      unsafeGetSystemState,
      setSystemState,
      unsafeGetPipelineManagerState,
      setPipelineManagerState,
    ) as stateOperateFuncs,
    {just, flatMap, map}: Most.ServiceType.service,
    is_set_state,
    exec,
  ): Most.StreamType.stream<unit> => {
    exec->just->flatMap(func =>
      func(
        unsafeGetSystemState(),
        (
          {
            getStatesFunc: _getStates(stateOperateFuncs),
            setStatesFunc: _setStates(stateOperateFuncs),
          }: StateType.operateStatesFuncs
        ),
      )
    , _)->map(
      systemState =>
        is_set_state->Commonlib.NullableSt.getWithDefault(true) ? setSystemState(systemState) : (),
      _,
    )
  }

  let rec _getExec = (
    getExecs: PipelineManagerType.getExecs,
    pipelineName,
    jobName,
  ): PipelineManagerType.exec => {
    getExecs->Commonlib.ListSt.length === 0
      ? Commonlib.Exception.throwErr(
          Commonlib.Exception.buildErr(
            Commonlib.Log.buildFatalMessage(
              ~title="_getExec",
              ~description=j`can't get exec with pipelineName:${pipelineName}, jobName:${jobName}`,
              ~reason="",
              ~solution=j``,
              ~params=j``,
            ),
          ),
        )
      : {
          let list{headGetElementFunc, ...remainGetElementFuncs} = getExecs

          let result = headGetElementFunc(pipelineName, jobName)

          result->Js.Nullable.isNullable
            ? _getExec(remainGetElementFuncs, pipelineName, jobName)
            : result->Commonlib.OptionSt.fromNullable->Commonlib.OptionSt.getExn
        }
  }

  let _buildJobStreams = (
    stateOperateFuncs,
    mostService: Most.ServiceType.service,
    (buildPipelineStreamFunc, getExecs),
    (pipelineName, elements),
    groups,
  ) =>
    elements
    ->Commonlib.ListSt.fromArray
    ->Commonlib.ListSt.reduce(list{}, (streams, {name, type_, is_set_state}: element) =>
      switch type_ {
      | #job =>
        let exec = _getExec(getExecs, pipelineName, name)

        streams->Commonlib.ListSt.push(
          _buildJobStream(stateOperateFuncs, mostService, is_set_state, exec),
        )
      | #group =>
        // TODO fix: handle is_set_state for group

        let group = _findGroup(name, groups)
        let stream = buildPipelineStreamFunc(
          stateOperateFuncs,
          mostService,
          getExecs,
          pipelineName,
          group,
          groups,
        )
        streams->Commonlib.ListSt.push(stream)
      }
    )

  let rec _buildPipelineStream = (
    stateOperateFuncs,
    mostService: Most.ServiceType.service,
    getExecs,
    pipelineName,
    {name, link, elements},
    groups,
  ) => {
    let streams = _buildJobStreams(
      stateOperateFuncs,
      mostService,
      (_buildPipelineStream, getExecs),
      (pipelineName, elements),
      groups,
    )

    streams
    ->Commonlib.ListSt.toArray
    ->switch link {
    | #merge => mostService.mergeArray
    | #concat => mostService.concatArray
    }
  }

  let parse = (
    // state: StateType.state,
    systemState: StateType.systemState,
    (
      unsafeGetSystemState,
      setSystemState,
      unsafeGetPipelineManagerState,
      setPipelineManagerState,
    ) as stateOperateFuncs,
    mostService: Most.ServiceType.service,
    getExecs,
    {name, groups, first_group},
  ): Most.StreamType.stream<StateType.systemState> => {
    let group = _findGroup(first_group, groups)

    // state->PipelineStateContainer.setState
    systemState->setSystemState

    _buildPipelineStream(
      stateOperateFuncs,
      mostService,
      getExecs,
      name,
      group,
      groups,
    )->mostService.map(() => unsafeGetSystemState(), _)
  }
}

let createState = (): StateType.state => {
  {
    allRegisteredPipelines: list{},
    states: Commonlib.ImmutableHashMap.createEmpty(),
  }
}

let registerPipeline = (
  {allRegisteredPipelines} as state: StateType.state,
  pipeline: PipelineManagerType.pipelineForRegister,
  // config: Js.Nullable.t<Meta3dEngineCoreProtocol.RegisterPipelineType.config>,
  jobOrders: RegisterPipelineType.jobOrders,
): StateType.state => {
  {
    ...state,
    allRegisteredPipelines: allRegisteredPipelines->Commonlib.ListSt.push((
      pipeline,
      // config,
      jobOrders,
    )),
  }
}

let unregisterPipeline = (
  {allRegisteredPipelines} as state: StateType.state,
  targetPipelineName: PipelineBasicType.pipelineName,
): StateType.state => {
  ...state,
  allRegisteredPipelines: allRegisteredPipelines->Commonlib.ListSt.filter(((
    {pipelineName},
    // _,
    _,
  )) => {
    pipelineName !== targetPipelineName
  }),
}

module MergePipelineData = {
  let _findInsertPipelineName = (
    insertElementName,
    allRegisteredPipelines: PipelineManagerType.allRegisteredPipelines,
  ): Commonlib.Result.t2<PipelineBasicType.pipelineName> => {
    allRegisteredPipelines
    ->Commonlib.ListSt.find((({pipelineName, allPipelineData}, _)) => {
      let {groups} = allPipelineData[0]

      groups->Commonlib.ArraySt.includesByFunc(({elements}) => {
        elements->Commonlib.ArraySt.includesByFunc(
          ({name}) => {
            name === insertElementName
          },
        )
      })
    })
    ->Commonlib.OptionSt.map((({pipelineName}, _)) => pipelineName)
    ->Commonlib.OptionSt.get
  }

  let _check = (
    ({allPipelineData}, jobOrders) as registeredPipeline: StateType.registeredPipeline,
  ) => {
    allPipelineData->Commonlib.ArraySt.length <= 1 && jobOrders->Commonlib.ArraySt.length <= 1
      ? registeredPipeline->Commonlib.Result.succeed
      : Commonlib.Result.failWith(
          Commonlib.Log.buildErrorMessage(
            ~title="allPipelineData or jobOrders should has the same pipeline <= 1",
            ~description="",
            ~reason="",
            ~solution="",
            ~params="",
          ),
        )
  }

  let _findAllSpecificPipelineRelatedData = (
    allRegisteredPipelines: PipelineManagerType.allRegisteredPipelines,
    targetPipelineName: PipelineBasicType.pipelineName,
  ): Commonlib.Result.t2<list<PipelineManagerType.specificPipelineRelatedData>> => {
    allRegisteredPipelines
    // ->Commonlib.ListSt.traverseResultM((({allPipelineData} as pipeline, config, jobOrders)) => {
    ->Commonlib.ListSt.traverseResultM((({allPipelineData} as pipeline, jobOrders)) => {
      (
        {
          ...pipeline,
          allPipelineData: allPipelineData->Commonlib.ArraySt.filter(({name}) => {
            name === targetPipelineName
          }),
        },
        // config,
        jobOrders->Commonlib.ArraySt.filter(({pipelineName}) => {
          pipelineName === targetPipelineName
        }),
      )->_check
    })
    ->Commonlib.Result.mapSuccess(allRegisteredPipelines => {
      allRegisteredPipelines->Commonlib.ListSt.filter(((
        {allPipelineData} as registeredPipeline,
        _,
      )) => {
        allPipelineData->Commonlib.ArraySt.length === 1
      })
    })
    ->Commonlib.Result.bind(allRegisteredPipelines => {
      allRegisteredPipelines
      ->Commonlib.ListSt.map(((
        {pipelineName, getExec, allPipelineData} as registeredPipeline,
        jobOrders,
      )) => {
        (pipelineName, getExec, allPipelineData[0], jobOrders->Commonlib.ArraySt.getFirst)
      })
      ->Commonlib.ListSt.traverseResultM(((pipelineName, getExec, pipelineData, jobOrderOpt)) => {
        jobOrderOpt
        ->Commonlib.OptionSt.map(
          ({insertElementName, insertAction}) => {
            _findInsertPipelineName(
              insertElementName,
              allRegisteredPipelines,
            )->Commonlib.Result.mapSuccess(
              (insertPipelineName): PipelineManagerType.jobOrder => {
                {
                  insertPipelineName,
                  insertElementName,
                  insertAction,
                }
              },
            )
          },
        )
        ->Commonlib.OptionSt.sequenceResultM
        ->Commonlib.Result.mapSuccess(
          (jobOrderOpt): PipelineManagerType.specificPipelineRelatedData => {
            {
              pipelineName,
              getExec,
              pipelineData,
              jobOrder: jobOrderOpt,
            }
          },
        )
      })
    })
  }

  let _handleInsertedAsRootNode = (
    treeDataList,
    (pipelineName, getExec, pipelineData, nodeJobOrderOpt, nodeInsertPipelineNameOpt),
  ) => {
    treeDataList->Commonlib.ListSt.reduce((list{}, None), (
      (newTreeDataList, insertedTreeOpt),
      (sameLevelTreeList, insertPipelineNameOpt) as treeData,
    ) => {
      switch insertPipelineNameOpt {
      | Some(insertPipelineName) if insertPipelineName === pipelineName =>
        let insertedTree = TreeNode.buildNode(
          pipelineName,
          (getExec, pipelineData, nodeJobOrderOpt),
          sameLevelTreeList,
        )

        (
          newTreeDataList->Commonlib.ListSt.addInReduce((
            list{insertedTree},
            nodeInsertPipelineNameOpt,
          )),
          Some(insertedTree),
        )
      | _ => (newTreeDataList->Commonlib.ListSt.addInReduce(treeData), insertedTreeOpt)
      }
    })
  }

  let _isInserted = Commonlib.OptionSt.isSome

  let _add = (
    treeDataList: PipelineManagerType.treeDataList,
    node,
    insertPipelineNameOpt,
  ): PipelineManagerType.treeDataList => {
    list{(list{node}, insertPipelineNameOpt), ...treeDataList}
  }

  let _insertToAsChildNodeOrSameLevelTree = (
    treeDataList: PipelineManagerType.treeDataList,
    nodeInsertPipelineName,
    node: TreeType.tree,
  ): (PipelineManagerType.treeDataList, bool) => {
    treeDataList->Commonlib.ListSt.reduce((list{}, false), (
      (newTreeDataList, isInsertTo),
      (sameLevelTreeList, insertPipelineNameOpt),
    ) => {
      let (newTreeDataList, isInsertTo_) = switch insertPipelineNameOpt {
      | Some(insertPipelineName) if insertPipelineName === nodeInsertPipelineName => (
          newTreeDataList->Commonlib.ListSt.addInReduce((
            sameLevelTreeList->Commonlib.ListSt.push(node),
            insertPipelineNameOpt,
          )),
          true,
        )
      | _ =>
        let (sameLevelTreeList, isInsertTo) = sameLevelTreeList->Commonlib.ListSt.reduce(
          (list{}, false),
          ((sameLevelTreeList, isInsertTo), tree) => {
            let (tree, isInsertTo_) = tree->OperateTree.insertNode(nodeInsertPipelineName, node)

            (
              sameLevelTreeList->Commonlib.ListSt.addInReduce(tree),
              isInsertTo ? isInsertTo : isInsertTo_,
            )
          },
        )

        (
          newTreeDataList->Commonlib.ListSt.addInReduce((sameLevelTreeList, insertPipelineNameOpt)),
          isInsertTo,
        )
      }

      (newTreeDataList, isInsertTo ? isInsertTo : isInsertTo_)
    })
  }

  let _removeInsertedTree = (
    treeDataList: PipelineManagerType.treeDataList,
    insertedTree,
  ): PipelineManagerType.treeDataList => {
    treeDataList
    ->Commonlib.ListSt.map(((sameLevelTreeList, insertPipelineNameOpt)) => {
      (
        sameLevelTreeList->Commonlib.ListSt.filter(sameLevelTree =>
          !TreeNode.isEqual(sameLevelTree, insertedTree)
        ),
        insertPipelineNameOpt,
      )
    })
    ->Commonlib.ListSt.filter(((sameLevelTreeList, insertPipelineNameOpt)) => {
      sameLevelTreeList->Commonlib.ListSt.length > 0
    })
  }

  let _getTree = treeDataList => {
    treeDataList->Commonlib.ListSt.length !== 1
      ? {
          Commonlib.Result.failWith(
            Commonlib.Log.buildErrorMessage(
              ~title="treeDataList.length should be 1",
              ~description="",
              ~reason={
                ""
              },
              ~solution="",
              ~params="",
            ),
          )
        }
      : {
          treeDataList
          ->Commonlib.ListSt.head
          ->Commonlib.OptionSt.get
          ->Commonlib.Result.bind(((sameLevelTreeList, _)) => {
            sameLevelTreeList->Commonlib.ListSt.length !== 1
              ? {
                  Commonlib.Result.failWith(
                    Commonlib.Log.buildErrorMessage(
                      ~title="sameLevelTreeList.length should be 1",
                      ~description="",
                      ~reason={
                        ""
                      },
                      ~solution="",
                      ~params="",
                    ),
                  )
                }
              : {
                  sameLevelTreeList->Commonlib.ListSt.head->Commonlib.OptionSt.get
                }
          })
        }
  }

  let _buildTree = (
    allSpecificPipelineRelatedData: list<PipelineManagerType.specificPipelineRelatedData>,
  ): Commonlib.Result.t2<TreeType.tree> => {
    allSpecificPipelineRelatedData
    ->Commonlib.ListSt.reduce(list{}, (
      treeDataList,
      {pipelineName, getExec, pipelineData, jobOrder},
    ) => {
      switch jobOrder {
      | None =>
        let (treeDataList, insertedTreeOpt) =
          treeDataList->_handleInsertedAsRootNode((pipelineName, getExec, pipelineData, None, None))

        _isInserted(insertedTreeOpt)
          ? treeDataList
          : treeDataList->_add(
              TreeNode.buildNode(pipelineName, (getExec, pipelineData, None), list{}),
              None,
            )
      | Some({insertPipelineName, insertElementName, insertAction}) =>
        let nodeJobOrderOpt = (
          {
            insertElementName,
            insertAction,
          }: TreeType.jobOrder
        )->Some

        let (treeDataList, insertedTreeOpt) =
          treeDataList->_handleInsertedAsRootNode((
            pipelineName,
            getExec,
            pipelineData,
            nodeJobOrderOpt,
            insertPipelineName->Some,
          ))

        switch insertedTreeOpt {
        | Some(insertedTree) =>
          let (treeDataList, isInsertTo) =
            treeDataList->_insertToAsChildNodeOrSameLevelTree(insertPipelineName, insertedTree)

          isInsertTo ? treeDataList->_removeInsertedTree(insertedTree) : treeDataList
        | None =>
          let node = TreeNode.buildNode(
            pipelineName,
            (getExec, pipelineData, nodeJobOrderOpt),
            list{},
          )

          let (treeDataList, isInsertTo) =
            treeDataList->_insertToAsChildNodeOrSameLevelTree(insertPipelineName, node)

          isInsertTo ? treeDataList : treeDataList->_add(node, Some(insertPipelineName))
        }
      }
    })
    ->_getTree
  }

  let _buildFirstGroupElement = (groups: PipelineJsonType.groups, first_group): Commonlib.Result.t2<
    PipelineJsonType.element,
  > => {
    groups
    ->Commonlib.ArraySt.find(({name}) => {
      name === first_group
    })
    ->Commonlib.OptionSt.map(({name}): PipelineJsonType.element => {
      name,
      type_: #group,
      is_set_state: false->Js.Nullable.return,
    })
    ->Commonlib.OptionSt.get
  }

  let _insertElement = (
    groups: PipelineJsonType.groups,
    insertAction: RegisterPipelineType.insertAction,
    insertElementName,
    insertElement: PipelineJsonType.element,
  ) => {
    groups->Commonlib.ArraySt.map(({name, elements} as group) => {
      {
        ...group,
        elements: elements->Commonlib.ArraySt.reduceOneParam((. result, {name} as element) => {
          name === insertElementName
            ? {
                switch insertAction {
                // | RegisterPipelineType.Before =>
                | #before =>
                  result->Commonlib.ArraySt.push(insertElement)->Commonlib.ArraySt.push(element)
                // | RegisterPipelineType.After =>
                | #after =>
                  result->Commonlib.ArraySt.push(element)->Commonlib.ArraySt.push(insertElement)
                }
              }
            : result->Commonlib.ArraySt.push(element)
        }, []),
      }
    })
  }

  let _mergeGroups = (
    groups: PipelineJsonType.groups,
    insertGroups: PipelineJsonType.groups,
  ): PipelineJsonType.groups => {
    Js.Array.concat(groups, insertGroups)
  }

  let _mergeGetElementFuncs = (getExecs: PipelineManagerType.getExecs, insertGetElementFuncs) => {
    Commonlib.ListSt.concat(getExecs, insertGetElementFuncs)
  }

  let _mergeToRootNode = (tree: TreeType.tree): Commonlib.Result.t2<(
    list<StateType.getExec>,
    PipelineJsonType.pipelineData,
  )> => {
    IterateTree.postOrderCataWithParentNode(
      ~tree,
      ~nodeFunc=(
        parentNodeOpt,
        pipelineName,
        {getExecs, pipelineData, jobOrder} as nodeData,
        children,
      ) => {
        let node = TreeNode.buildNodeByNodeData(pipelineName, nodeData, children)

        switch parentNodeOpt {
        | None => node->Commonlib.Result.succeed
        | Some(parentNode) =>
          let parentNodeData = TreeNode.getNodeData(parentNode)

          jobOrder
          ->Commonlib.OptionSt.get
          ->Commonlib.Result.bind(({insertElementName, insertAction}) => {
            _buildFirstGroupElement(
              pipelineData.groups,
              pipelineData.first_group,
            )->Commonlib.Result.mapSuccess(insertElement => {
              parentNodeData.pipelineData = {
                ...parentNodeData.pipelineData,
                groups: parentNodeData.pipelineData.groups
                ->_insertElement(insertAction, insertElementName, insertElement)
                ->_mergeGroups(pipelineData.groups),
              }
              parentNodeData.getExecs = _mergeGetElementFuncs(parentNodeData.getExecs, getExecs)

              node
            })
          })
        }
      },
      (),
    )->Commonlib.Result.mapSuccess(tree => {
      let {getExecs, pipelineData} = TreeNode.getNodeData(tree)

      (getExecs, pipelineData)
    })
  }

  let merge = (
    allRegisteredPipelines: PipelineManagerType.allRegisteredPipelines,
    pipelineName: PipelineBasicType.pipelineName,
  ): Commonlib.Result.t2<(list<StateType.getExec>, PipelineJsonType.pipelineData)> => {
    allRegisteredPipelines
    ->_findAllSpecificPipelineRelatedData(pipelineName)
    ->Commonlib.Result.bind(_buildTree)
    ->Commonlib.Result.bind(_mergeToRootNode)
  }
}

let runPipeline = (
  systemState: StateType.systemState,
  (unsafeGetSystemState, setSystemState, unsafeGetPipelineManagerState, setPipelineManagerState) as stateOperateFuncs,
  // mostService: Most.ServiceType.service,
  pipelineName: PipelineBasicType.pipelineName,
): Most.StreamType.stream<StateType.systemState> => {
  let mostService = Most.MostService.service

  // TODO check is allRegisteredPipelines duplicate

  let {allRegisteredPipelines}: StateType.state = systemState->unsafeGetPipelineManagerState

  allRegisteredPipelines
  ->MergePipelineData.merge(pipelineName)
  ->Commonlib.Result.mapSuccess(((getExecs, pipelineData)) => {
    ParsePipelineData.parse(systemState, stateOperateFuncs, mostService, getExecs, pipelineData)
  })
  ->Commonlib.Result.handleFail(Commonlib.Exception.throwErr)
}

let init = (
  systemState: StateType.systemState,
  (unsafeGetPipelineManagerState, setPipelineManagerState) as stateOperateFuncs,
): StateType.systemState => {
  let {allRegisteredPipelines} as state: StateType.state = systemState->unsafeGetPipelineManagerState

  setPipelineManagerState(
    systemState,
    {
      ...state,
      states: allRegisteredPipelines->Commonlib.ListSt.reduce(
        Commonlib.ImmutableHashMap.createEmpty(),
        (states, ({pipelineName, createState}, _)) => {
          states->Commonlib.ImmutableHashMap.set(pipelineName, createState(systemState))
        },
      ),
    },
  )
}
