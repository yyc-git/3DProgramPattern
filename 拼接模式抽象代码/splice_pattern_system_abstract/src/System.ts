import * as ChunkHandler from "chunk_handler_abstract"
import { state } from "./SystemStateType"
import { getData } from "./target_chunks/ConverterdChunk"

declare function _handleConfigFunc1(state: state, someConfigData): any

declare function _addRuntimeMetadataFunc1(someRuntimeMetadataFromState, someConfigData): any

export let parseConfig = ChunkHandler.parseConfig

export let createState = (parsedConfig): state => {
    return {
        parsedConfig: parsedConfig,
        chunk: getData(),

        创建更多字段...
    }
}

export let init = (state: state, someConfigData): state => {
    let target = ChunkHandler.buildTarget(
        [_handleConfigFunc1, ...],

        state.parsedConfig,
        state.chunk,
        someConfigData
    )

    console.log("使用target...")

    let runtimeMetadata = ChunkHandler.buildRuntimeMetadata(
        [_addRuntimeMetadataFunc1, ... ],

        target
    )

    return {
        ...state,
        target: target,
        runtimeMetadata: runtimeMetadata
    }
}

export let operateWhenRuntime = (state: state): state => {
    console.log("使用state.runtimeMetadata...")

    return state
}