import { stream } from "most/src/StreamType"
import { service } from "most/src/ServiceType"

export function ignore(stream: stream<any>, { map }: service) {
	return map((_) => { }, stream)
}

function _createGetWorkerDataStream({ fromEvent, tap, filter }: service, operateType: string, worker: Worker) {
	return tap(() => {
		console.log("get worker data! operateType: ", operateType)
	},
		filter((event) => {
			// console.log(event.data.operateType, operateType, event.data.operateType === operateType)
			return event.data.operateType === operateType
		},
			fromEvent<MessageEvent, Worker>("message", worker, false)))
}

export function createGetMainWorkerDataStream(service: service, tapFunc: (event: MessageEvent) => void, operateType: string, worker: Worker) {
	let { tap, take } = service

	let stream = _createGetWorkerDataStream(service, operateType, worker)

	return ignore(take(1, tap(tapFunc, stream)), service)
}

export function createGetOtherWorkerDataStream(service: service, operateType: string, worker: Worker) {
	let { take } = service

	let stream = _createGetWorkerDataStream(service, operateType, worker)

	return ignore(take(1, stream), service)
}