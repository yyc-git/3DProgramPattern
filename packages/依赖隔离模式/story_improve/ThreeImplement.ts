import { IRenderEngine } from "./IRenderEngine";
import {
	Scene,
...
} from "three";

export let implement = (): IRenderEngine => {
	return {
		createScene: () => {
			return new Scene();
		},
		...
  }
}