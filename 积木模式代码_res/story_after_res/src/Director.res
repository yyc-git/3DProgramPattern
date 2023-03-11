//创建引擎的state，包含引擎的所有运行时数据
let createState = (): EngineStateType.state => {
  {
    scene: SceneManager.createState(),
  }
}

let init = (engineState: EngineStateType.state) => {
  let engineState = SceneManager.init(engineState)
  let engineState = Render.init(engineState)

  engineState
}

//假实现
let requestAnimationFrame = func => ()

let rec loop = (engineState: EngineStateType.state) => {
  let engineState = SceneManager.update(engineState)
  let engineState = Render.render(engineState)

  requestAnimationFrame(time => {
    loop(engineState)
  })
}
