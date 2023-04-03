// use json loader to load target config
import * as targetsConfigJson from "./target_config/targets_config.json"
import * as chunksConfigJson from "./target_config/chunks_config.json"

import { parseConfig, createState, init, operateWhenLoop } from "splice_pattern_system_abstract/src/Main"

let parsedConfig = parseConfig(targetsConfigJson, chunksConfigJson)

let state = createState(parsedConfig)

declare let someConfigData
state = init(state, someConfigData)

state = operateWhenLoop(state)