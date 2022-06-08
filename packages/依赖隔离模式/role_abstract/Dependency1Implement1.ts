import { IDependency1 } from "./IDependency1";
import {
	operate1,
...
} from "dependencylibrary1";

export let implement = (): IDependency1 => {
	return {
		abstractOperate1: () => {
			...
			return operate1()
	},
		...
  }
}