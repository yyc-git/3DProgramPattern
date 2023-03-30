import { gameObject } from "../gameObject/GameObjectStateType"

export type state = {
    gameObject: gameObject | null,
    position: [number, number, number]
}