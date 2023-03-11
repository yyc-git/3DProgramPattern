let createState = (): SceneManagerStateType.state => {
  {allGameObjects: []}
}

let createScene = (state: EngineStateType.state) => {
  Js.log("创建场景")

  let sceneGameObject = Obj.magic(1)

  {
    ...state,
    scene: {
      ...state.scene,
      //通过concat而不是push来加入，保持state的immutable
      allGameObjects: Js.Array.concat(state.scene.allGameObjects, [sceneGameObject]),
    },
  }
}

let getAllGameObjects = (state: EngineStateType.state) => {
  state.scene.allGameObjects
}

let init = (state: EngineStateType.state) => {
  Js.log("初始化场景")

  state
}

let update = (state: EngineStateType.state) => {
  Js.log("更新场景")

  let _ = Math.multiplyMatrix(Obj.magic(1), Obj.magic(1))

  state
}
