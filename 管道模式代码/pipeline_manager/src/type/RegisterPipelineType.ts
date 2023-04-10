import { elementName, pipelineName } from "./PipelibeBasicType"

export abstract class state { protected opaque!: any } /* simulate opaque types */

export type insertAction = "before" | "after"

export type jobOrder = {
  //管道名
  pipelineName: pipelineName,
  //将该管道的所有Job插入到的element名（element可以为job或者group）
  insertElementName: elementName,
  //insertAction的值可以为before或者after，意思是插入到该element之前或者之后
  insertAction: insertAction,
}

//因为一个Pipeline可以包括多个管道，所以jobOrders是数组，对应多个管道
export type jobOrders = Array<jobOrder>