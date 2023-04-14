import { stream } from "most/src/StreamType"
import { service } from "most/src/ServiceType"

export function ignore(stream: stream<any>, { map }: service) {
	return map((_) => { }, stream)
}

function _createGetWorkerDataStream({ fromEvent, tap, filter }: service, command: string, worker: Worker) {
	return tap(() => {
		console.log("get worker data! command: ", command)
	},
		filter((event) => {
			return event.data.command === command
		},
			fromEvent<MessageEvent, Worker>("message", worker, false)))
}

export function createGetMainWorkerDataStream(service: service, tapFunc: (event: MessageEvent) => void, command: string, worker: Worker) {
	let { tap, take } = service

	let stream = _createGetWorkerDataStream(service, command, worker)

	return ignore(take(1, tap(tapFunc, stream)), service)
}

export function createGetOtherWorkerDataStream(service: service, command: string, worker: Worker) {
	let { take } = service

	let stream = _createGetWorkerDataStream(service, command, worker)

	return ignore(take(1, stream), service)
}