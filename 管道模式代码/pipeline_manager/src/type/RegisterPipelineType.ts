import { elementName, pipelineName } from "./PipelibeBasicType"

export abstract class state { protected opaque!: any } /* simulate opaque types */

export type insertAction = "before" | "after"

export type jobOrder = {
  pipelineName: pipelineName,
  insertElementName: elementName,
  insertAction: insertAction,
}

export type jobOrders = Array<jobOrder>