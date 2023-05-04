import { Engine } from "./Engine";
import {
	Scene,
	Engine,
	...
} from "babylonjs";

export let implement = (): Engine => {
	return {
		createScene: () => {
			return new Scene(new Engine())
		},
		...
  }
}