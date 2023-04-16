import { Dependency1 } from "./Dependency1"

let _dependency1: Dependency1 = null

export let getDependency1 = (): Dependency1 => {
  return _dependency1;
}

export let setDependency1 = (dependency1: Dependency1) {
  _dependency1 = dependency1;
}

更多的get/set函数（如getDependency2、setDependency2）...