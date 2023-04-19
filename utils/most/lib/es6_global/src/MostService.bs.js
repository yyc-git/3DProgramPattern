

import * as Most from "most";
import * as Curry from "../../../../../node_modules/rescript/lib/es6/curry.js";
import * as Most$Most from "./most.bs.js";
import * as Caml_array from "../../../../../node_modules/rescript/lib/es6/caml_array.js";
import * as ArraySt$Commonlib from "../../../../../node_modules/commonlib/lib/es6_global/src/structure/ArraySt.bs.js";

var _isFromEventStream = (function(stream){ var source = stream.source; return !!source.event && !!source.source; });

function concatArray(streamArr) {
  var match = streamArr.length;
  if (match !== 0) {
    return ArraySt$Commonlib.reduceOneParam(ArraySt$Commonlib.sliceFrom(streamArr, 1), (function (stream1, stream2) {
                  _isFromEventStream(stream1) === true;
                  return Most$Most.concat(stream2, stream1);
                }), Caml_array.get(streamArr, 0));
  } else {
    return Most.just(1);
  }
}

function callFunc(func) {
  var __x = Most.just(func);
  return Most.map((function (func) {
                return Curry._1(func, undefined);
              }), __x);
}

function service_tap(prim0, prim1) {
  return Most.tap(prim0, prim1);
}

function service_filter(prim0, prim1) {
  return Most.filter(prim0, prim1);
}

function service_take(prim0, prim1) {
  return Most.take(prim0, prim1);
}

function service_fromEvent(prim0, prim1, prim2) {
  return Most.fromEvent(prim0, prim1, prim2);
}

function service_fromPromise(prim) {
  return Most.fromPromise(prim);
}

function service_just(prim) {
  return Most.just(prim);
}

function service_map(prim0, prim1) {
  return Most.map(prim0, prim1);
}

function service_flatMap(prim0, prim1) {
  return Most.flatMap(prim0, prim1);
}

function service_mergeArray(prim) {
  return Most.mergeArray(prim);
}

function service_drain(prim) {
  return Most.drain(prim);
}

var service = {
  tap: service_tap,
  filter: service_filter,
  take: service_take,
  fromEvent: service_fromEvent,
  fromPromise: service_fromPromise,
  just: service_just,
  concat: Most$Most.concat,
  map: service_map,
  flatMap: service_flatMap,
  mergeArray: service_mergeArray,
  concatArray: concatArray,
  callFunc: callFunc,
  drain: service_drain
};

export {
  _isFromEventStream ,
  concatArray ,
  callFunc ,
  service ,
}
/* most Not a pure module */
