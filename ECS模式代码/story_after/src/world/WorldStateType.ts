import type { Map } from "immutable";
import { gameObject, state as gameObjectState } from "../gameObject/GameObjectStateType"

export type state = {
    gameObjects: Map<gameObject, gameObjectState>
}