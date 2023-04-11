export abstract class state { protected opaque!: any } /* simulate opaque types */

export type operateStatesFuncs = {
	getStatesFunc: <worldState, states> (_1: worldState) => states,
	setStatesFunc: <worldState, states> (_1: worldState, _2: states) => worldState,
}