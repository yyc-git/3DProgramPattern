import { Dependency1 } from "./Dependency1";
import {
	api1,
...
} from "dependencylibrary1";

export let implement = (): Dependency1 => {
	return {
		abstractAPI1: () => {
			...
			return api1()
	},
		...
  }
}