import { config } from "./type/TargetConfigType";

export declare function parseConfig(configJson: JSON): config

type target = any

export declare function buildTarget(handleConfigFuncs, parsedConfig: config, targetChunk, someConfigData): target

type runtimeData = any

export declare function getRuntimeData(addRuntimeDataFuncs, target: target): runtimeData