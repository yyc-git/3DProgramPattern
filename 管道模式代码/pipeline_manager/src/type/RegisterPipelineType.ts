import { elementName, pipelineName } from "./PipelibeBasicType"

export abstract class state { protected opaque!: any } /* simulate opaque types */

export type insertAction = "before" | "after"

export type jobOrder = {
  //管道名
  pipelineName: pipelineName,
  //将该管道的所有Job插入到某个element中（element可以为job或者group），而这里的insertElementName就是该element的名称
  insertElementName: elementName,
  //值可以为before或者after，意思是插入到该element之前或者之后
  insertAction: insertAction,
}

//可能要合并多种同名管道，所以jobOrders是数组，每个数组元素对应一种名字的管道
export type jobOrders = Array<jobOrder>