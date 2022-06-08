import { IDependency1 } from "./IDependency1";
import {
	api1,
...
} from "dependencylibrary1";

export let implement = (): IDependency1 => {
	return {
		abstractAPI1: () => {
			...
			return api1()
	},
		...
  }
}