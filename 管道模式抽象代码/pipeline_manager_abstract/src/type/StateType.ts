export abstract class state { protected opaque!: any } /* simulate opaque types */

export type operateStatesFuncs = {
	getStatesFunc: <systemState, states> (_1: systemState) => states,
	setStatesFunc: <systemState, states> (_1: systemState, _2: states) => systemState,
}