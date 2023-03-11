import { IDependency1 } from "./IDependency1"

let _dependency1: IDependency1 = null
...

export let getDependency1 = (): IDependency1 => {
  return _dependency1;
}

export let setDependency1 = (dependency1: IDependency1) {
  _dependency1 = dependency1;
}

...