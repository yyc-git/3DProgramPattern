import { RenderEngine } from "./RenderEngine";
import {
	Scene,
...
} from "three";

export let implement = (): RenderEngine => {
	return {
		createScene: () => {
			return new Scene();
		},
		...
  }
}