import * as Engine from "./Engine"

let state = Engine.DirectorAPI.createState()

state = Engine.SceneAPI.createScene(state)

state = Engine.DirectorAPI.init(state)

Engine.DirectorAPI.loop(state)