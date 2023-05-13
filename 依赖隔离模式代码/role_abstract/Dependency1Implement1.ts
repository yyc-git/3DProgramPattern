import { Dependency1 } from "./Dependency1";
import {
	api1,
...
} from "dependencylibrary1";

export let implement = (): Dependency1 => {
	return {
		abstractOperate1: () => {
			使用api1...
		},
		...
  }
}