export type renderInPCState = {
    gl: WebGL2RenderingContext | null
}

export type renderInMobileState = {
    gl: WebGL2RenderingContext | null
}

export type state = {
    renderInPC: renderInPCState,
    renderInMobile: renderInMobileState,
}