let _isFromEventStream = %raw(` function(stream){ var source = stream.source; return !!source.event && !!source.source; } `)

let concatArray = streamArr =>
  switch Js.Array.length(streamArr) {
  | 0 => Most.just(Obj.magic(1))
  | _ =>
    streamArr
    ->Commonlib.ArraySt.sliceFrom(1)
    ->Commonlib.ArraySt.reduceOneParam(
      (. stream1, stream2) =>
        _isFromEventStream(stream1) === true
          ? stream2->Most.concat(stream1)
          : stream2->Most.concat(stream1),
      streamArr[0],
    )
  }

let callFunc = func => {
  Most.just(func)->Most.map(func => func(), _)
}

let service: ServiceType.service = {
  tap: Most.tap,
  filter: Most.filter,
  take: Most.take,
  fromEvent: Most.fromEvent->Obj.magic,
  fromPromise: Most.fromPromise->Obj.magic,
  just: Most.just,
  map: Most.map,
  flatMap: Most.flatMap,
  mergeArray: Most.mergeArray,
  concat: Most.concat,
  concatArray,
  callFunc,
  drain: Most.drain,
}

type insertAction =
  | Before
  | After
