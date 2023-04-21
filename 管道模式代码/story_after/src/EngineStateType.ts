export type engineInPCState = {
    gl: WebGL2RenderingContext | null
}

export type engineInMobileState = {
    gl: WebGL2RenderingContext | null
}

export type state = {
    engineInPC: engineInPCState,
    engineInMobile: engineInMobileState,
}