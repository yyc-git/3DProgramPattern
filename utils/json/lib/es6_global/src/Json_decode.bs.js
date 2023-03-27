// Generated by ReScript, PLEASE EDIT WITH CARE

import * as List from "../../../../../node_modules/rescript/lib/es6/list.js";
import * as $$Array from "../../../../../node_modules/rescript/lib/es6/array.js";
import * as Curry from "../../../../../node_modules/rescript/lib/es6/curry.js";
import * as Js_dict from "../../../../../node_modules/rescript/lib/es6/js_dict.js";
import * as Caml_option from "../../../../../node_modules/rescript/lib/es6/caml_option.js";
import * as Caml_string from "../../../../../node_modules/rescript/lib/es6/caml_string.js";
import * as Caml_exceptions from "../../../../../node_modules/rescript/lib/es6/caml_exceptions.js";
import * as Caml_js_exceptions from "../../../../../node_modules/rescript/lib/es6/caml_js_exceptions.js";

function _isInteger(value) {
  if (Number.isFinite(value)) {
    return Math.floor(value) === value;
  } else {
    return false;
  }
}

var DecodeError = /* @__PURE__ */Caml_exceptions.create("Json_decode-Json.DecodeError");

function bool(json) {
  if (typeof json === "boolean") {
    return json;
  }
  throw {
        RE_EXN_ID: DecodeError,
        _1: "Expected boolean, got " + JSON.stringify(json),
        Error: new Error()
      };
}

function $$float(json) {
  if (typeof json === "number") {
    return json;
  }
  throw {
        RE_EXN_ID: DecodeError,
        _1: "Expected number, got " + JSON.stringify(json),
        Error: new Error()
      };
}

function $$int(json) {
  var f = $$float(json);
  if (_isInteger(f)) {
    return f;
  }
  throw {
        RE_EXN_ID: DecodeError,
        _1: "Expected integer, got " + JSON.stringify(json),
        Error: new Error()
      };
}

function string(json) {
  if (typeof json === "string") {
    return json;
  }
  throw {
        RE_EXN_ID: DecodeError,
        _1: "Expected string, got " + JSON.stringify(json),
        Error: new Error()
      };
}

function $$char(json) {
  var s = string(json);
  if (s.length === 1) {
    return Caml_string.get(s, 0);
  }
  throw {
        RE_EXN_ID: DecodeError,
        _1: "Expected single-character string, got " + JSON.stringify(json),
        Error: new Error()
      };
}

function date(json) {
  return new Date(string(json));
}

function nullable(decode, json) {
  if (json === null) {
    return null;
  } else {
    return Curry._1(decode, json);
  }
}

function nullAs(value, json) {
  if (json === null) {
    return value;
  }
  throw {
        RE_EXN_ID: DecodeError,
        _1: "Expected null, got " + JSON.stringify(json),
        Error: new Error()
      };
}

function array(decode, json) {
  if (Array.isArray(json)) {
    var length = json.length;
    var target = new Array(length);
    for(var i = 0; i < length; ++i){
      var value;
      try {
        value = Curry._1(decode, json[i]);
      }
      catch (raw_msg){
        var msg = Caml_js_exceptions.internalToOCamlException(raw_msg);
        if (msg.RE_EXN_ID === DecodeError) {
          throw {
                RE_EXN_ID: DecodeError,
                _1: msg._1 + ("\n\tin array at index " + String(i)),
                Error: new Error()
              };
        }
        throw msg;
      }
      target[i] = value;
    }
    return target;
  }
  throw {
        RE_EXN_ID: DecodeError,
        _1: "Expected array, got " + JSON.stringify(json),
        Error: new Error()
      };
}

function list(decode, json) {
  return $$Array.to_list(array(decode, json));
}

function pair(decodeA, decodeB, json) {
  if (Array.isArray(json)) {
    var length = json.length;
    if (length === 2) {
      try {
        return [
                Curry._1(decodeA, json[0]),
                Curry._1(decodeB, json[1])
              ];
      }
      catch (raw_msg){
        var msg = Caml_js_exceptions.internalToOCamlException(raw_msg);
        if (msg.RE_EXN_ID === DecodeError) {
          throw {
                RE_EXN_ID: DecodeError,
                _1: msg._1 + "\n\tin pair/tuple2",
                Error: new Error()
              };
        }
        throw msg;
      }
    } else {
      throw {
            RE_EXN_ID: DecodeError,
            _1: "Expected array of length 2, got array of length " + length,
            Error: new Error()
          };
    }
  } else {
    throw {
          RE_EXN_ID: DecodeError,
          _1: "Expected array, got " + JSON.stringify(json),
          Error: new Error()
        };
  }
}

function tuple3(decodeA, decodeB, decodeC, json) {
  if (Array.isArray(json)) {
    var length = json.length;
    if (length === 3) {
      try {
        return [
                Curry._1(decodeA, json[0]),
                Curry._1(decodeB, json[1]),
                Curry._1(decodeC, json[2])
              ];
      }
      catch (raw_msg){
        var msg = Caml_js_exceptions.internalToOCamlException(raw_msg);
        if (msg.RE_EXN_ID === DecodeError) {
          throw {
                RE_EXN_ID: DecodeError,
                _1: msg._1 + "\n\tin tuple3",
                Error: new Error()
              };
        }
        throw msg;
      }
    } else {
      throw {
            RE_EXN_ID: DecodeError,
            _1: "Expected array of length 3, got array of length " + length,
            Error: new Error()
          };
    }
  } else {
    throw {
          RE_EXN_ID: DecodeError,
          _1: "Expected array, got " + JSON.stringify(json),
          Error: new Error()
        };
  }
}

function tuple4(decodeA, decodeB, decodeC, decodeD, json) {
  if (Array.isArray(json)) {
    var length = json.length;
    if (length === 4) {
      try {
        return [
                Curry._1(decodeA, json[0]),
                Curry._1(decodeB, json[1]),
                Curry._1(decodeC, json[2]),
                Curry._1(decodeD, json[3])
              ];
      }
      catch (raw_msg){
        var msg = Caml_js_exceptions.internalToOCamlException(raw_msg);
        if (msg.RE_EXN_ID === DecodeError) {
          throw {
                RE_EXN_ID: DecodeError,
                _1: msg._1 + "\n\tin tuple4",
                Error: new Error()
              };
        }
        throw msg;
      }
    } else {
      throw {
            RE_EXN_ID: DecodeError,
            _1: "Expected array of length 4, got array of length " + length,
            Error: new Error()
          };
    }
  } else {
    throw {
          RE_EXN_ID: DecodeError,
          _1: "Expected array, got " + JSON.stringify(json),
          Error: new Error()
        };
  }
}

function dict(decode, json) {
  if (typeof json === "object" && !Array.isArray(json) && json !== null) {
    var keys = Object.keys(json);
    var l = keys.length;
    var target = {};
    for(var i = 0; i < l; ++i){
      var key = keys[i];
      var value;
      try {
        value = Curry._1(decode, json[key]);
      }
      catch (raw_msg){
        var msg = Caml_js_exceptions.internalToOCamlException(raw_msg);
        if (msg.RE_EXN_ID === DecodeError) {
          throw {
                RE_EXN_ID: DecodeError,
                _1: msg._1 + "\n\tin dict",
                Error: new Error()
              };
        }
        throw msg;
      }
      target[key] = value;
    }
    return target;
  }
  throw {
        RE_EXN_ID: DecodeError,
        _1: "Expected object, got " + JSON.stringify(json),
        Error: new Error()
      };
}

function field(key, decode, json) {
  if (typeof json === "object" && !Array.isArray(json) && json !== null) {
    var value = Js_dict.get(json, key);
    if (value !== undefined) {
      try {
        return Curry._1(decode, Caml_option.valFromOption(value));
      }
      catch (raw_msg){
        var msg = Caml_js_exceptions.internalToOCamlException(raw_msg);
        if (msg.RE_EXN_ID === DecodeError) {
          throw {
                RE_EXN_ID: DecodeError,
                _1: msg._1 + ("\n\tat field '" + (key + "'")),
                Error: new Error()
              };
        }
        throw msg;
      }
    } else {
      throw {
            RE_EXN_ID: DecodeError,
            _1: "Expected field '" + key + "'",
            Error: new Error()
          };
    }
  } else {
    throw {
          RE_EXN_ID: DecodeError,
          _1: "Expected object, got " + JSON.stringify(json),
          Error: new Error()
        };
  }
}

function getFailValueForOptimized(param) {
  return -1000000;
}

function optimizedField(key, decode, json) {
  if (typeof json === "object" && !Array.isArray(json) && json !== null) {
    var value = Js_dict.get(json, key);
    if (value === undefined) {
      return -1000000;
    }
    try {
      return Curry._1(decode, Caml_option.valFromOption(value));
    }
    catch (raw_msg){
      var msg = Caml_js_exceptions.internalToOCamlException(raw_msg);
      if (msg.RE_EXN_ID === DecodeError) {
        throw {
              RE_EXN_ID: DecodeError,
              _1: msg._1 + ("\n\tat field '" + (key + "'")),
              Error: new Error()
            };
      }
      throw msg;
    }
  } else {
    throw {
          RE_EXN_ID: DecodeError,
          _1: "Expected object, got " + JSON.stringify(json),
          Error: new Error()
        };
  }
}

function at(key_path, decoder) {
  if (key_path) {
    var rest = key_path.tl;
    var key = key_path.hd;
    if (!rest) {
      return function (param) {
        return field(key, decoder, param);
      };
    }
    var partial_arg = at(rest, decoder);
    return function (param) {
      return field(key, partial_arg, param);
    };
  }
  throw {
        RE_EXN_ID: "Invalid_argument",
        _1: "Expected key_path to contain at least one element",
        Error: new Error()
      };
}

function optional(decode, json) {
  try {
    return Caml_option.some(Curry._1(decode, json));
  }
  catch (raw_exn){
    var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
    if (exn.RE_EXN_ID === DecodeError) {
      return ;
    }
    throw exn;
  }
}

function optimizedOptional(decode, json) {
  var result = Curry._1(decode, json);
  if (result === -1000000) {
    return ;
  } else {
    return Caml_option.some(result);
  }
}

function oneOf(decoders, json) {
  var _decoders = decoders;
  var _errors = /* [] */0;
  while(true) {
    var errors = _errors;
    var decoders$1 = _decoders;
    if (decoders$1) {
      try {
        return Curry._1(decoders$1.hd, json);
      }
      catch (raw_e){
        var e = Caml_js_exceptions.internalToOCamlException(raw_e);
        if (e.RE_EXN_ID === DecodeError) {
          _errors = {
            hd: e._1,
            tl: errors
          };
          _decoders = decoders$1.tl;
          continue ;
        }
        throw e;
      }
    } else {
      var revErrors = List.rev(errors);
      throw {
            RE_EXN_ID: DecodeError,
            _1: "All decoders given to oneOf failed. Here are all the errors: " + revErrors + ". And the JSON being decoded: " + JSON.stringify(json),
            Error: new Error()
          };
    }
  };
}

function either(a, b) {
  var partial_arg_1 = {
    hd: b,
    tl: /* [] */0
  };
  var partial_arg = {
    hd: a,
    tl: partial_arg_1
  };
  return function (param) {
    return oneOf(partial_arg, param);
  };
}

function withDefault($$default, decode, json) {
  try {
    return Curry._1(decode, json);
  }
  catch (raw_exn){
    var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
    if (exn.RE_EXN_ID === DecodeError) {
      return $$default;
    }
    throw exn;
  }
}

function map(f, decode, json) {
  return Curry._1(f, Curry._1(decode, json));
}

function andThen(b, a, json) {
  return Curry._2(b, Curry._1(a, json), json);
}

var tuple2 = pair;

export {
  _isInteger ,
  DecodeError ,
  bool ,
  $$float ,
  $$int ,
  string ,
  $$char ,
  date ,
  nullable ,
  nullAs ,
  array ,
  list ,
  pair ,
  tuple2 ,
  tuple3 ,
  tuple4 ,
  dict ,
  field ,
  getFailValueForOptimized ,
  optimizedField ,
  at ,
  optional ,
  optimizedOptional ,
  oneOf ,
  either ,
  withDefault ,
  map ,
  andThen ,
}
/* No side effect */
