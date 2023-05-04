import { Engine } from "./Engine";
import {
	Scene,
...
} from "three";

export let implement = (): Engine => {
	return {
		createScene: () => {
			return new Scene();
		},
		...
  }
}