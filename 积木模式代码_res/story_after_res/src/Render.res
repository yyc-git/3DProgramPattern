let init = (engineState: EngineStateType.state) => {
  Js.log("初始化渲染")

  engineState
}

let render = (engineState: EngineStateType.state) => {
  let allGameObjects = SceneManager.getAllGameObjects(engineState)

  Js.log("处理场景数据")

  let _ = Math.multiplyMatrix(1, 2)

  Js.log("渲染")

  engineState
}
