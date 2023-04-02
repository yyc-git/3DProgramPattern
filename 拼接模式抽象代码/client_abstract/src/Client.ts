// use json loader to load target config
import * as wholeConfigJson from "./target_config/whole_config.json"
import * as chunkConfigJson from "./target_config/chunk_config.json"

import { parseConfig, createState, init, operateWhenLoop } from "splice_pattern_system_abstract/src/Main"

let parsedConfig = parseConfig(wholeConfigJson, chunkConfigJson)

let state = createState(parsedConfig)

declare let someConfigData
state = init(state, someConfigData)

state = operateWhenLoop(state)