export interface command {
    exec: () => void,
    undo: () => void
}