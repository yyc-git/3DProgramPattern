import { RenderEngine } from "./RenderEngine";
import {
	Scene,
	Engine,
	...
} from "babylonjs";

export let implement = (): RenderEngine => {
	return {
		createScene: () => {
			return new Scene(new Engine())
		},
		...
  }
}