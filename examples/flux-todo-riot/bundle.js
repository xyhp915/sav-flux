(function () {
'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var savUtil_cjs = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function toStringType(val) {
  return Object.prototype.toString.call(val).slice(8, -1);
}

const isArray = Array.isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}

function isString(arg) {
  return typeof arg === 'string';
}

function isFunction(arg) {
  return typeof arg === 'function';
}

function isObject(arg) {
  return toStringType(arg) === 'Object' && arg !== null;
}

function isNumber(arg) {
  return typeof arg === 'number' && !isNaN(arg);
}

function isInteger(arg) {
  return isNumber(arg) && parseInt(arg) === arg;
}

function isUndefined(arg) {
  return arg === undefined;
}

function isNull(arg) {
  return arg === null;
}

function isNan(arg) {
  return typeof arg === 'number' && isNaN(arg);
}

function isRegExp(arg) {
  return toStringType(arg) === 'RegExp';
}

function isDate(arg) {
  return toStringType(arg) === 'Date';
}

function typeValue(arg) {
  if (isNan(arg)) {
    return 'Nan';
  }
  switch (arg) {
    case undefined:
      return 'Undefined';
    case null:
      return 'Null';
    default:
      return toStringType(arg);
  }
}

const isInt = isInteger;
function isUint(arg) {
  return isInteger(arg) && arg >= 0;
}

function isAsync(func) {
  return isFunction(func) && func.constructor.name === 'AsyncFunction';
}

function isPromise(obj) {
  return obj && isFunction(obj.then);
}

let types = {
  isBoolean,
  isString,
  isNumber,
  isObject,
  isArray,
  isFunction,
  isRegExp,
  isDate,
  isNull,
  isUndefined,
  isInt,
  isUint
};

function defined(val) {
  return val !== 'undefined';
}

let probe = {
  Map: defined(typeof Map),
  Proxy: defined(typeof Proxy),
  MessageChannel: defined(typeof MessageChannel),
  localStorage: defined(typeof localStorage),
  XMLHttpRequest: defined(typeof XMLHttpRequest),
  MutationObserver: defined(typeof MutationObserver),
  FormData: defined(typeof FormData),
  window: defined(typeof window),
  document: defined(typeof document)
};

/*
 * @Description      URL解析
 * @File             url.js
 * @Auth             jetiny@hfjy.com
 */

// jsuri https://code.google.com/r/jonhwendell-jsuri/
// https://username:password@www.test.com:8080/path/index.html?this=that&some=thing#content
const REKeys = ['source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'];
const URL_RE = /^(?:(?![^:@]+:[^:@/]*@)([^:/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#/]*\.[^?#/.]+(?:[?#]|$)))*\/?)?([^?#/]*))(?:\?([^#]*))?(?:#(.*))?)/;

function parseUrl(str) {
  let _uri = {};
  let _m = URL_RE.exec(str || '');
  let _i = REKeys.length;
  while (_i--) {
    _uri[REKeys[_i]] = _m[_i] || '';
  }
  return _uri;
}

function stringifyUrl(uri) {
  let str = '';
  if (uri) {
    if (uri.host) {
      if (uri.protocol) str += uri.protocol + ':';
      str += '//';
      if (uri.user) str += uri.user + ':';
      if (uri.password) str += uri.password + '@';
      str += uri.host;
      if (uri.port) str += ':' + uri.port;
    }
    str += uri.path || '';
    if (uri.query) str += '?' + uri.query;
    if (uri.anchor) str += '#' + uri.anchor;
  }
  return str;
}

const Url = {
  parse: parseUrl,
  stringify: stringifyUrl
};

const _encode = encodeURIComponent;
const r20 = /%20/g;
const rbracket = /\[]$/;

function buildParams(prefix, obj, add) {
  if (Array.isArray(obj)) {
    // Serialize array item.
    obj.forEach(function (v, i) {
      if (rbracket.test(prefix)) {
        // Treat each array item as a scalar.
        add(prefix, v);
      } else {
        // Item is non-scalar (array or object), encode its numeric index.
        buildParams(prefix + '[' + (typeof v === 'object' ? i : '') + ']', v, add);
      }
    });
  } else if (isObject(obj)) {
    // Serialize object item.
    for (let name in obj) {
      buildParams(prefix + '[' + name + ']', obj[name], add);
    }
  } else {
    // Serialize scalar item.
    add(prefix, obj);
  }
}

// # http://stackoverflow.com/questions/1131630/the-param-inverse-function-in-javascript-jquery
// a[b]=1&a[c]=2&d[]=3&d[]=4&d[2][e]=5 <=> { a: { b: 1, c: 2 }, d: [ 3, 4, { e: 5 } ] }
function parseQuery(str, opts = {}) {
  let _querys = {};
  decodeURIComponent(str || '').replace(/\+/g, ' ')
  // (optional no-capturing & )(key)=(value)
  .replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function ($0, _name, _value) {
    if (_name) {
      let _path, _acc, _tmp, _ref;
      (_path = []).unshift(_name = _name.replace(/\[([^\]]*)]/g, function ($0, _k) {
        _path.push(_k);
        return '';
      }));
      _ref = _querys;
      for (let j = 0; j < _path.length - 1; j++) {
        _acc = _path[j];
        _tmp = _path[j + 1];
        if (!_ref[_acc]) {
          _ref[_acc] = _tmp === '' || /^[0-9]+$/.test(_tmp) ? [] : {};
        }
        _ref = _ref[_acc];
      }
      if (opts.boolval) {
        // first
        if (_value === 'true') {
          _value = true;
        } else if (_value === 'false') {
          _value = false;
        }
      } else if (opts.intval) {
        // skip "true" & "false"
        if (_tmp = parseInt(_value) === _value) {
          _value = _tmp;
        }
      }
      if ((_acc = _path[_path.length - 1]) === '') {
        _ref.push(_value);
      } else {
        _ref[_acc] = _value;
      }
    }
  });
  return _querys;
}

function stringifyQuery(query) {
  // # http://api.jquery.com/jQuery.param
  let _add = (key, value) => {
    /* jshint eqnull:true */
    _str.push(_encode(key) + '=' + (value === null || value === undefined ? '' : _encode(value)));
    // _str.push(( key ) + "=" +  (value == null ? "" : ( value )));
  };
  let _str = [];
  query || (query = {});
  for (let x in query) {
    buildParams(x, query[x], _add);
  }
  return _str.join('&').replace(r20, '+');
}

const Query = {
  parse: parseQuery,
  stringify: stringifyQuery
};

function extend() {
  // form jQuery & remove this
  let options, name, src, copy, copyIsArray, clone;
  let target = arguments[0] || {};
  let i = 1;
  let length = arguments.length;
  let deep = false;
  if (isBoolean(target)) {
    deep = target;
    target = arguments[i] || {};
    i++;
  }
  if (typeof target !== 'object' && !isFunction(target)) {
    target = {};
  }
  for (; i < length; i++) {
    options = arguments[i];
    /* jshint eqnull:true */
    if (options != null) {
      for (name in options) {
        src = target[name];
        copy = options[name];
        if (target !== copy) {
          if (deep && copy && (isObject(copy) || (copyIsArray = isArray(copy)))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && isArray(src) ? src : [];
            } else {
              clone = src && isObject(src) ? src : {};
            }
            target[name] = extend(deep, clone, copy);
          } else {
            target[name] = copy;
          }
        }
      }
    }
  }
  return target;
}

function clone(val) {
  if (isArray(val)) {
    return extend(true, [], val);
  } else if (isObject(val)) {
    return extend(true, {}, val);
  }
  return extend(true, [], [val])[0];
}

/**
 * 对象或数组遍历
 * @param  {Array|Object} obj      要遍历的对象
 * @param  {Function} iterator 遍历函数，统一遵循值在前的模式
 * @param  {Mixed} context  上下文对象
 * @return {Mixed}          返回要遍历的对象
 *
 * @example
 * each(['a','b'], function(val, key){
 *     if (val == 'a') {
 *         console.log(val);
 *         return false;
 *     }
 * });
 */
function each(obj, iterator, context) {
  if (obj) {
    let _length = obj.length;
    let _key;
    if (_length === +_length) {
      // array like
      for (_key = 0; _key < _length; _key++) {
        if (iterator.call(context, obj[_key], _key) === false) {
          return obj;
        }
      }
    } else {
      // object
      for (_key in obj) {
        if (obj.hasOwnProperty(_key)) {
          if (iterator.call(context, obj[_key], _key) === false) {
            return obj;
          }
        }
      }
    }
  }
  return obj;
}

function prop(target, key, value) {
  Object.defineProperty(target, key, { value, writable: true, configurable: true });
}

function makePropFunc(target, propName) {
  if (!target._props_) {
    prop(target, '_props_', ['_props_']);
  }
  let props = target._props_;
  return (key, value) => {
    if (isObject(key)) {
      for (let name in key) {
        Object.defineProperty(target, name, { [`${propName}`]: key[name], writable: true, configurable: true });
        props.push(name);
      }
    } else {
      let descriptor = { [`${propName}`]: value, configurable: true };
      if (propName === 'value') {
        descriptor.writable = true;
      }
      Object.defineProperty(target, key, descriptor);
      props.push(key);
    }
  };
}

function delProps(target) {
  if (target._props_) {
    target._props_.forEach(it => {
      delete target[it];
    });
  }
}

function makeProp(ctx, name) {
  if (ctx.prop) {
    return ctx.prop;
  }
  let prop = makePropFunc(ctx, 'value');
  prop.getter = makePropFunc(ctx, 'get');
  prop.setter = makePropFunc(ctx, 'set');
  if (isString(name) || isUndefined(name)) {
    prop(name || 'ctx', ctx);
  }
  prop('prop', prop);
  return prop;
}

function bindEvent(target) {
  let _events = {};
  prop(target, 'on', (event, fn) => {
    (_events[event] || (_events[event] = [])).push(fn);
  });

  prop(target, 'before', (event, fn) => {
    (_events[event] || (_events[event] = [])).unshift(fn);
  });

  prop(target, 'off', (event, fn) => {
    if (_events[event]) {
      let list = _events[event];
      if (fn) {
        let pos = list.indexOf(fn);
        if (pos !== -1) {
          list.splice(pos, 1);
        }
      } else {
        delete _events[event];
      }
    }
  });

  prop(target, 'once', (event, fn) => {
    let once = (...args) => {
      target.off(event, fn);
      fn(...args);
    };
    target.on(event, once);
  });

  prop(target, 'subscribe', (event, fn) => {
    target.on(event, fn);
    return () => {
      target.off(event, fn);
    };
  });

  prop(target, 'emit', (event, ...args) => {
    if (_events[event]) {
      let list = _events[event].slice();
      let fn;
      while (fn = list.shift()) {
        fn(...args);
      }
    }
  });
}

function unique(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError('array-unique expects an array.');
  }
  let len = arr.length;
  let i = -1;
  while (i++ < len) {
    let j = i + 1;
    for (; j < arr.length; ++j) {
      if (arr[i] === arr[j]) {
        arr.splice(j--, 1);
      }
    }
  }
  return arr;
}

function isPromiseLike(obj) {
  return !!(obj && obj.then);
}

function uuid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function guid() {
  return new Date().getTime().toString(32) + Math.floor(Math.random() * 10000000000).toString(32) + s4();
}

function shortId() {
  let a = Math.random() + new Date().getTime();
  return a.toString(16).replace('.', '');
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

function inherits(ctor, SuperCtor, useSuper) {
  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ctor.prototype, SuperCtor.prototype);
  } else {
    ctor.prototype = new SuperCtor();
    ctor.prototype.constructor = SuperCtor;
  }
  if (useSuper) {
    ctor.super_ = SuperCtor;
  }
  return ctor;
}

function strRepeat(s, n) {
  return new Array(Math.max(n || 0, 0) + 1).join(s);
}

function noop() {}

function splitEach(str, callback, chr, context) {
  return str.split(chr || ' ').forEach(callback, context);
}

function proxy(fn, context) {
  return function () {
    fn.apply(context, arguments);
  };
}

function formatDate(fmt, date) {
  if (!fmt) fmt = 'yyyy-MM-dd';
  if (!date) {
    date = new Date();
  } else {
    date = new Date(date);
  }
  let o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  return fmt;
}

let PROMISE = Promise;
let promise = {
  resolve: PROMISE.resolve.bind(PROMISE),
  reject: PROMISE.reject.bind(PROMISE),
  all: PROMISE.all.bind(PROMISE),
  then: (fn, reject) => {
    // @NOTICE deprecated to be removed next
    return new PROMISE(fn, reject);
  }
};

function toPromise(target, methods) {
  let dist = Object.create(null);
  methods.forEach(name => {
    dist[name] = (...args) => {
      return promise.then((resolve, reject) => {
        try {
          return resolve(target[name].apply(target, args));
        } catch (err) {
          return reject(err);
        }
      });
    };
  });
  return dist;
}

function next() {
  let promise = Promise.resolve();
  let ret = (resolve, reject) => {
    if (resolve || reject) {
      promise = promise.then(resolve, reject);
    }
    return promise;
  };
  return ret;
}

function convertCase(type, str) {
  switch (type) {
    case 'pascal':
      return pascalCase(str);
    case 'camel':
      return camelCase(str);
    case 'snake':
      return snakeCase(str);
    case 'hyphen':
      return hyphenCase(str);
    default:
      return str;
  }
}

/**
 * Camelize a hyphen-delmited string.
 */
const camelCaseRE = /[-_](\w)/g;
function camelCase(str) {
  return lcfirst(str.replace(camelCaseRE, (_, c) => c ? c.toUpperCase() : ''));
}

/**
 * Capitalize a string.
 */
function ucfirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * UnCapitalize a string.
 */
function lcfirst(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

const replaceAZRE = /([A-Z])/g;

/**
 * Hyphenate a camelCase string.
 */
function hyphenCase(str) {
  return camelCase(str).replace(replaceAZRE, '-$1').toLowerCase();
}

function snakeCase(str) {
  return camelCase(str).replace(replaceAZRE, '_$1').toLowerCase();
}

function pascalCase(str) {
  return ucfirst(camelCase(str));
}

/**
 * ajax 方法
 * @param  {Object}   opts 请求对象
 * {
 *     method:"GET",
 *     dataType:"JSON",
 *     headers:{},
 *     url:"",
 *     data:{},
 * }
 * @param  {Function} next 回调
 * @return {XMLHttpRequest}        xhr对象
 */
function ajax(opts, next) {
  let method = (opts.method || 'GET').toUpperCase();
  let dataType = (opts.dataType || 'JSON').toUpperCase();
  let timeout = opts.timeout;
  /* global XMLHttpRequest */
  let req = new XMLHttpRequest();
  let data = null;
  let isPost = method === 'POST';
  let isGet = method === 'GET';
  let isFormData = false;
  let emit = function (err, data, headers) {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    req.onload = req.onreadystatechange = req.onerror = null;
    if (next) {
      let tmp = next;
      next = null;
      tmp(err, data, headers);
    }
  };
  if (isGet) {
    if (opts.data) {
      let u = parseUrl(opts.url);
      let q = parseQuery(u.query);
      for (let x in opts.data) {
        q[x] = opts.data[x];
      }
      u.query = stringifyQuery(q);
      opts.url = stringifyUrl(u);
      opts.data = null;
    }
  } else if (isPost) {
    data = opts.data;
    /* global FormData */
    if (probe.FormData) {
      isFormData = data instanceof FormData;
      if (!isFormData) {
        data = stringifyQuery(data);
      }
    }
  }
  if (timeout) {
    timeout = setTimeout(function () {
      req.abort();
      emit(new Error('error_timeout'));
    }, timeout);
  }
  try {
    opts.xhr && opts.xhr(req);
    if (dataType === 'BINARY') {
      req.responseType = 'arraybuffer';
    }
    req.open(method, opts.url, true);
    if (opts.headers) {
      for (let x in opts.headers) {
        req.setRequestHeader(x, opts.headers[x]);
      }
    }
    if (isPost && !isFormData) {
      req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    if (opts.headerOnly) {
      req.onreadystatechange = function () {
        // console.log('state', req.readyState, req);
        if (req.readyState === 2) {
          // HEADERS_RECEIVED
          let headers = parseHeaders(req.getAllResponseHeaders(), opts.camelHeaders);
          req.abort();
          emit(null, undefined, headers);
        }
      };
    }
    req.onload = function () {
      // if(req.readyState != 4) return;
      if ([200, 304, 206, 0].indexOf(req.status) === -1) {
        // error
        emit(new Error('error_status_' + req.status));
      } else {
        let data = req.response;
        try {
          if (dataType === 'JSON') {
            data = JSON.parse(req.responseText);
          } else if (dataType === 'XML') {
            data = req.responseXML;
          } else if (dataType === 'TEXT') {
            data = req.responseText;
          } else if (dataType === 'BINARY') {
            let arrayBuffer = new Uint8Array(data);
            let str = '';
            for (let i = 0; i < arrayBuffer.length; i++) {
              str += String.fromCharCode(arrayBuffer[i]);
            }
            data = str;
          }
        } catch (err) {
          return emit(err);
        }
        emit(null, data, parseHeaders(req.getAllResponseHeaders(), opts.camelHeaders));
      }
    };
    req.onerror = function (e) {
      emit(new Error('error_network'));
    };
    // 进度
    if (opts.onprogress && !opts.headerOnly) {
      req.onloadend = req.onprogress = function (e) {
        let info = {
          total: e.total,
          loaded: e.loaded,
          percent: e.total ? Math.trunc(100 * e.loaded / e.total) : 0
        };
        if (e.type === 'loadend') {
          info.percent = 100;
        } else if (e.total === e.loaded) {
          return;
        }
        if (e.total < e.loaded) {
          info.total = info.loaded;
        }
        if (info.percent === 0) {
          return;
        }
        opts.onprogress(info);
      };
    }
    req.send(data);
  } catch (e) {
    emit(e);
  }
  return req;
}

function parseHeaders(str, camelHeaders) {
  let ret = {};
  str.trim().split('\n').forEach(function (key) {
    key = key.replace(/\r/g, '');
    let arr = key.split(': ');
    let name = arr.shift().toLowerCase();
    ret[camelHeaders ? camelCase(name) : name] = arr.shift();
  });
  return ret;
}

exports.isArray = isArray;
exports.isBoolean = isBoolean;
exports.isString = isString;
exports.isFunction = isFunction;
exports.isObject = isObject;
exports.isNumber = isNumber;
exports.isInteger = isInteger;
exports.isUndefined = isUndefined;
exports.isNull = isNull;
exports.isNan = isNan;
exports.isRegExp = isRegExp;
exports.isDate = isDate;
exports.typeValue = typeValue;
exports.isInt = isInt;
exports.isUint = isUint;
exports.isAsync = isAsync;
exports.isPromise = isPromise;
exports.types = types;
exports.probe = probe;
exports.parseUrl = parseUrl;
exports.stringifyUrl = stringifyUrl;
exports.Url = Url;
exports.parseQuery = parseQuery;
exports.stringifyQuery = stringifyQuery;
exports.Query = Query;
exports.clone = clone;
exports.each = each;
exports.extend = extend;
exports.bindEvent = bindEvent;
exports.unique = unique;
exports.isPromiseLike = isPromiseLike;
exports.uuid = uuid;
exports.guid = guid;
exports.shortId = shortId;
exports.inherits = inherits;
exports.strRepeat = strRepeat;
exports.noop = noop;
exports.splitEach = splitEach;
exports.proxy = proxy;
exports.formatDate = formatDate;
exports.promise = promise;
exports.toPromise = toPromise;
exports.next = next;
exports.ajax = ajax;
exports.convertCase = convertCase;
exports.camelCase = camelCase;
exports.ucfirst = ucfirst;
exports.lcfirst = lcfirst;
exports.hyphenCase = hyphenCase;
exports.snakeCase = snakeCase;
exports.pascalCase = pascalCase;
exports.prop = prop;
exports.delProps = delProps;
exports.makeProp = makeProp;
});

var savUtil_cjs_4 = savUtil_cjs.isFunction;
var savUtil_cjs_19 = savUtil_cjs.probe;
var savUtil_cjs_26 = savUtil_cjs.clone;
var savUtil_cjs_28 = savUtil_cjs.extend;
var savUtil_cjs_29 = savUtil_cjs.bindEvent;
var savUtil_cjs_30 = savUtil_cjs.unique;
var savUtil_cjs_31 = savUtil_cjs.isPromiseLike;

function Flux (opts = {strict: true}) {
  let flux = this;
  let prop = initProp(flux);
  prop('flux', flux);
  prop('prop', prop);
  prop('mutations', {});
  prop('actions', {});
  prop('proxys', {});
  prop('opts', opts);
  initUse(flux)([initUtil, savUtil_cjs_29, initPromise, initCloneThen,
    initState, initCommit, initDispatch, initProxy,
    initDeclare]);
}

function initProp (flux) {
  let prop = (key, value, opts = {}) => {
    opts.value = value;
    Object.defineProperty(flux, key, opts);
  };
  prop.get = (key, value, opts = {}) => {
    opts.get = value;
    Object.defineProperty(flux, key, opts);
  };
  return prop
}

function initUse ({flux, prop}) {
  let use = (plugin, opts) => {
    if (Array.isArray(plugin)) {
      return plugin.forEach(plugin => {
        flux.use(plugin, opts);
      })
    }
    plugin(flux, opts);
  };
  prop('use', use);
  return use
}

function initUtil ({prop, opts}) {
  prop('clone', savUtil_cjs_26);
  prop('extend', savUtil_cjs_28);
  prop('opt', (name, defaultVal = null) => {
    return name in opts ? opts[name] : defaultVal
  });
}

function initState ({prop, emit, cloneThen, clone, resolve}) {
  let state = {};
  prop.get('state', () => state, {
    set () {
      throw new Error('[flux] Use flux.replaceState() to explicit replace store state.')
    }
  });
  prop('getState', () => clone(state));

  prop('replaceState', newState => {
    let stateStr = JSON.stringify(newState);
    newState = JSON.parse(stateStr);
    for (let x in state) {
      delete state[x];
    }
    for (let x in newState) {
      state[x] = newState[x];
    }
    return Promise.resolve(JSON.parse(stateStr)).then((cloneState) => {
      emit('replace', cloneState);
      return cloneState
    })
  });

  prop('updateState', (changedState, slice) => {
    if (typeof changedState !== 'object') {
      throw new Error('[flux] updateState require new state as object')
    }
    if (changedState !== state) {
      Object.keys(changedState).map(key => {
        state[key] = changedState[key];
      });
    }
    if (!slice) {
      return cloneThen(changedState).then(cloneState => {
        emit('update', cloneState);
        return cloneState
      })
    }
    return resolve()
  });
}

function initCommit ({prop, flux, updateState, resolve}) {
  let commit = (type, payload) => {
    let {mutations} = flux;
    if (typeof type === 'object') {
      payload = type;
      type = type.type;
    }
    let entry = mutations[type];
    if (!entry) {
      throw new Error('[flux] unknown mutation : ' + type)
    }
    let state = flux.state;
    let ret = entry(flux, payload);
    let update = (ret) => {
      if (ret) {
        if (ret === state) {
          throw new Error('[flux] commit require new object rather than old state')
        }
        if (typeof ret !== 'object') {
          throw new Error('[flux] commit require new object')
        }
        return updateState(ret)
      }
      return resolve()
    };
    if (savUtil_cjs_31(ret)) {
      return ret.then(update)
    } else {
      return update(ret)
    }
  };
  prop('commit', flux.opts.noProxy ? commit : proxyApi(commit));
}

function initDispatch ({prop, flux, commit, resolve, reject, opts, cloneThen}) {
  let dispatch = (action, payload) => {
    let {actions, mutations, proxys} = flux;
    let entry = action in actions && actions[action] ||
      action in mutations && function (_, payload) {
        return commit(action, payload)
      };
    if (!entry && (proxys[action])) {
      entry = proxys[action];
    }
    if (!entry) {
      return reject('[flux] unknown action : ' + action)
    }
    let err, ret;
    try {
      ret = entry(flux, payload);
    } catch (e) {
      err = e;
    }
    if (err) {
      return reject(err)
    }
    if (!savUtil_cjs_31(ret)) {
      ret = resolve(ret);
    }
        // make copy
    return opts.strict ? ret.then(data => {
      if (Array.isArray(data) || typeof data === 'object') {
        if (data.__clone) {
          return resolve(data)
        }
        return cloneThen(data).then(newData => {
          Object.defineProperty(newData, '__clone', {value: true});
          return resolve(newData)
        })
      }
      return resolve(data)
    }) : ret
  };
  prop('dispatch', flux.opts.noProxy ? dispatch : proxyApi(dispatch));
}

function initProxy ({prop, proxys}) {
  prop('proxy', (name, value) => {
    if (typeof name === 'object') { // batch mode
      for (var x in name) {
        if (value === null) {
          delete proxys[x];
        } else {
          proxys[x] = name[x];
        }
      }
    } else { // once mode
      if (value === null) {
        delete proxys[name];
      } else {
        proxys[name] = value;
      }
    }
  });
}

function initDeclare ({prop, flux, emit, commit, dispatch, updateState}) {
  let declare = (mod) => {
    if (!mod) {
      return
    }
    if (Array.isArray(mod)) {
      return mod.forEach(declare)
    }
    if (mod.mutations) {
      for (let mutation in mod.mutations) {
        if (flux.mutations[mutation]) {
          throw new Error(`[flux] mutation exists: ${mutation}`)
        }
        flux.mutations[mutation] = mod.mutations[mutation];
        if (flux.opts.noProxy || !savUtil_cjs_19.Proxy) {
          proxyFunction(commit, mutation);
          proxyFunction(dispatch, mutation);
        }
      }
    }
    // if (mod.proxys) {
    //   for(let action in mod.proxys) {
    //     flux.proxys[action] = mod.proxys[action]
    //   }
    // }
    if (mod.actions) {
      for (let action in mod.actions) {
        if (flux.actions[action]) {
          throw new Error(`[flux] action exists: ${action}`)
        }
        flux.actions[action] = mod.actions[action];
        if (flux.opts.noProxy || !savUtil_cjs_19.Proxy) {
          proxyFunction(dispatch, action);
        }
      }
    }
    if (mod.state) {
      let states = flux.state;
      for (let state in mod.state) {
        if (state in states) {
          throw new Error(`[flux] state exists: ${state}`)
        }
      }
      updateState(mod.state, true);
    }
    emit('declare', mod);
  };
  prop('declare', declare);
}

function proxyFunction (target, name) {
  target[name] = (payload) => {
    return target(name, payload)
  };
}

function proxyApi (entry) {
  if (savUtil_cjs_19.Proxy) {
    return new Proxy(entry, {
      get (target, name) {
        return payload => {
          return entry(name, payload)
        }
      }
    })
  }
  return entry
}

function initPromise ({prop}) {
  let PROMISE = Promise;
  prop('resolve', PROMISE.resolve.bind(PROMISE));
  prop('reject', PROMISE.reject.bind(PROMISE));
  prop('all', PROMISE.all.bind(PROMISE));
  prop('then', fn => {
    return new PROMISE(fn)
  });
}

function initCloneThen ({prop, clone, resolve, then}) {
  if (!savUtil_cjs_19.MessageChannel) {
    prop('cloneThen', value => {
      return resolve().then(() => resolve(clone(value)))
    });
    return
  }
  /* global MessageChannel */
  const channel = new MessageChannel();
  let maps = {};
  let idx = 0;
  let port2 = channel.port2;
  port2.start();
  port2.onmessage = ({data: {key, value}}) => {
    const resolve = maps[key];
    resolve(value);
    delete maps[key];
  };
  prop('cloneThen', value => {
    return new Promise(resolve => {
      const key = idx++;
      maps[key] = resolve;
      try {
        channel.port1.postMessage({key, value});
      } catch (err) {
        console.error('cloneThen.postMessage', err);
        delete maps[key];
        try {
          value = JSON.parse(JSON.stringify(value));
        } catch (err) {
          console.error('cloneThen.JSON', err);
          value = clone(value);
        }
        return then(() => resolve(value))
      }
    })
  });
}

function normalizeMap (map) {
  return Array.isArray(map) ? map.map(key => {
    return {
      key: key,
      val: key
    }
  }) : Object.keys(map).map(key => {
    return {
      key: key,
      val: map[key]
    }
  })
}

// 后续不建议使用

function FluxRiot ({flux, riot}) {
  let connect = {
    dispatch: flux.dispatch,
    state: flux.getState(),
    binds: {},
    binders: {}
  };
  flux.on('update', (newState) => {
    Object.assign(connect.state, newState);
    let ids = [];
    for (let name in newState) {
      ids = ids.concat(connect.binds[name]);
    }
    savUtil_cjs_30(ids);
    let keys = Object.keys(newState);
    ids.forEach((tagName) => {
      let binder = connect.binders[tagName];
      if (binder && binder.vms.length) {
        syncBinderKeys(binder, keys);
      }
    });
  });

  flux.on('replace', (newState) => {
    connect.state = newState;
    for (let tagName in connect.binders) {
      syncBinder(connect.binders[tagName]);
    }
  });

  riot.mixin({
    init: function () {
      this.on('before-mount', () => {
        if (this.getters) {
          let tagName = this.__.tagName;
          let binder;
          if (connect.binders[tagName]) {
            binder = connect.binders[tagName];
          } else {
            let getters = normalizeMap(this.getters);
            let sync = {};
            binder = {
              sync,
              keys: [],
              vms: []
            };
            connect.binders[tagName] = binder;
            getters.forEach(({key, val}) => {
              let fn = savUtil_cjs_4(val) ? () => {
                return val(connect.state)
              } : () => {
                return connect.state[key]
              };
              let binds = connect.binds[key] || (connect.binds[key] = []);
              binds.push(tagName);
              binder.keys.push(key);
              sync[key] = fn;
            });
          }
          this.on('unmount', () => {
            let idx = binder.vms.indexOf(this);
            if (idx >= 0) {
              binder.vms.splice(idx, 1);
            }
          });
          binder.vms.push(this);
          Object.assign(this, syncState(binder.keys, binder.sync));
        }
        if (this.actions) {
          normalizeMap(this.actions).forEach(({key}) => {
            this[key] = (payload) => {
              return connect.dispatch(key, payload)
            };
          });
        }
      });
    }
  });
}

function syncState (keys, sync) {
  let ret = {};
  keys.forEach((key) => {
    ret[key] = sync[key]();
  });
  return ret
}

function syncBinder (binder) {
  if (binder.vms.length) {
    let state = syncState(binder.keys, binder.sync);
    binder.vms.forEach((vm) => vm.update(state));
  }
}

function syncBinderKeys (binder, keys) {
  let state = syncState(keys.filter((key) => binder.keys.indexOf(key) >= 0), binder.sync);
  binder.vms.forEach((vm) => vm.update(state));
}

var riot_compiler = createCommonjsModule(function (module, exports) {
/* Riot v3.6.1, @license MIT */
(function (global, factory) {
	module.exports = factory();
}(commonjsGlobal, (function () { 'use strict';

var __TAGS_CACHE = [];
var __TAG_IMPL = {};
var GLOBAL_MIXIN = '__global_mixin';
var ATTRS_PREFIX = 'riot-';
var REF_DIRECTIVES = ['ref', 'data-ref'];
var IS_DIRECTIVE = 'data-is';
var CONDITIONAL_DIRECTIVE = 'if';
var LOOP_DIRECTIVE = 'each';
var LOOP_NO_REORDER_DIRECTIVE = 'no-reorder';
var SHOW_DIRECTIVE = 'show';
var HIDE_DIRECTIVE = 'hide';
var RIOT_EVENTS_KEY = '__riot-events__';
var T_STRING = 'string';
var T_OBJECT = 'object';
var T_UNDEF  = 'undefined';
var T_FUNCTION = 'function';
var XLINK_NS = 'http://www.w3.org/1999/xlink';
var SVG_NS = 'http://www.w3.org/2000/svg';
var XLINK_REGEX = /^xlink:(\w+)/;
var WIN = typeof window === T_UNDEF ? undefined : window;
var RE_SPECIAL_TAGS = /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?|opt(?:ion|group))$/;
var RE_SPECIAL_TAGS_NO_OPTION = /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?)$/;
var RE_EVENTS_PREFIX = /^on/;
var RE_RESERVED_NAMES = /^(?:_(?:item|id|parent)|update|root|(?:un)?mount|mixin|is(?:Mounted|Loop)|tags|refs|parent|opts|trigger|o(?:n|ff|ne))$/;
var RE_HTML_ATTRS = /([-\w]+) ?= ?(?:"([^"]*)|'([^']*)|({[^}]*}))/g;
var CASE_SENSITIVE_ATTRIBUTES = { 'viewbox': 'viewBox' };
var RE_BOOL_ATTRS = /^(?:disabled|checked|readonly|required|allowfullscreen|auto(?:focus|play)|compact|controls|default|formnovalidate|hidden|ismap|itemscope|loop|multiple|muted|no(?:resize|shade|validate|wrap)?|open|reversed|seamless|selected|sortable|truespeed|typemustmatch)$/;
var IE_VERSION = (WIN && WIN.document || {}).documentMode | 0;

/**
 * Check Check if the passed argument is undefined
 * @param   { String } value -
 * @returns { Boolean } -
 */
function isBoolAttr(value) {
  return RE_BOOL_ATTRS.test(value)
}

/**
 * Check if passed argument is a function
 * @param   { * } value -
 * @returns { Boolean } -
 */
function isFunction(value) {
  return typeof value === T_FUNCTION
}

/**
 * Check if passed argument is an object, exclude null
 * NOTE: use isObject(x) && !isArray(x) to excludes arrays.
 * @param   { * } value -
 * @returns { Boolean } -
 */
function isObject(value) {
  return value && typeof value === T_OBJECT // typeof null is 'object'
}

/**
 * Check if passed argument is undefined
 * @param   { * } value -
 * @returns { Boolean } -
 */
function isUndefined(value) {
  return typeof value === T_UNDEF
}

/**
 * Check if passed argument is a string
 * @param   { * } value -
 * @returns { Boolean } -
 */
function isString(value) {
  return typeof value === T_STRING
}

/**
 * Check if passed argument is empty. Different from falsy, because we dont consider 0 or false to be blank
 * @param { * } value -
 * @returns { Boolean } -
 */
function isBlank(value) {
  return isUndefined(value) || value === null || value === ''
}

/**
 * Check if passed argument is a kind of array
 * @param   { * } value -
 * @returns { Boolean } -
 */
function isArray(value) {
  return Array.isArray(value) || value instanceof Array
}

/**
 * Check whether object's property could be overridden
 * @param   { Object }  obj - source object
 * @param   { String }  key - object property
 * @returns { Boolean } -
 */
function isWritable(obj, key) {
  var descriptor = Object.getOwnPropertyDescriptor(obj, key);
  return isUndefined(obj[key]) || descriptor && descriptor.writable
}

/**
 * Check if passed argument is a reserved name
 * @param   { String } value -
 * @returns { Boolean } -
 */
function isReservedName(value) {
  return RE_RESERVED_NAMES.test(value)
}

var check = Object.freeze({
	isBoolAttr: isBoolAttr,
	isFunction: isFunction,
	isObject: isObject,
	isUndefined: isUndefined,
	isString: isString,
	isBlank: isBlank,
	isArray: isArray,
	isWritable: isWritable,
	isReservedName: isReservedName
});

/**
 * Shorter and fast way to select multiple nodes in the DOM
 * @param   { String } selector - DOM selector
 * @param   { Object } ctx - DOM node where the targets of our search will is located
 * @returns { Object } dom nodes found
 */
function $$(selector, ctx) {
  return Array.prototype.slice.call((ctx || document).querySelectorAll(selector))
}

/**
 * Shorter and fast way to select a single node in the DOM
 * @param   { String } selector - unique dom selector
 * @param   { Object } ctx - DOM node where the target of our search will is located
 * @returns { Object } dom node found
 */
function $(selector, ctx) {
  return (ctx || document).querySelector(selector)
}

/**
 * Create a document fragment
 * @returns { Object } document fragment
 */
function createFrag() {
  return document.createDocumentFragment()
}

/**
 * Create a document text node
 * @returns { Object } create a text node to use as placeholder
 */
function createDOMPlaceholder() {
  return document.createTextNode('')
}

/**
 * Check if a DOM node is an svg tag
 * @param   { HTMLElement }  el - node we want to test
 * @returns {Boolean} true if it's an svg node
 */
function isSvg(el) {
  return !!el.ownerSVGElement
}

/**
 * Create a generic DOM node
 * @param   { String } name - name of the DOM node we want to create
 * @param   { Boolean } isSvg - true if we need to use an svg node
 * @returns { Object } DOM node just created
 */
function mkEl(name) {
  return name === 'svg' ? document.createElementNS(SVG_NS, name) : document.createElement(name)
}

/**
 * Set the inner html of any DOM node SVGs included
 * @param { Object } container - DOM node where we'll inject new html
 * @param { String } html - html to inject
 */
/* istanbul ignore next */
function setInnerHTML(container, html) {
  if (!isUndefined(container.innerHTML))
    { container.innerHTML = html; }
    // some browsers do not support innerHTML on the SVGs tags
  else {
    var doc = new DOMParser().parseFromString(html, 'application/xml');
    var node = container.ownerDocument.importNode(doc.documentElement, true);
    container.appendChild(node);
  }
}

/**
 * Toggle the visibility of any DOM node
 * @param   { Object }  dom - DOM node we want to hide
 * @param   { Boolean } show - do we want to show it?
 */

function toggleVisibility(dom, show) {
  dom.style.display = show ? '' : 'none';
  dom['hidden'] = show ? false : true;
}

/**
 * Remove any DOM attribute from a node
 * @param   { Object } dom - DOM node we want to update
 * @param   { String } name - name of the property we want to remove
 */
function remAttr(dom, name) {
  dom.removeAttribute(name);
}

/**
 * Convert a style object to a string
 * @param   { Object } style - style object we need to parse
 * @returns { String } resulting css string
 * @example
 * styleObjectToString({ color: 'red', height: '10px'}) // => 'color: red; height: 10px'
 */
function styleObjectToString(style) {
  return Object.keys(style).reduce(function (acc, prop) {
    return (acc + " " + prop + ": " + (style[prop]) + ";")
  }, '')
}

/**
 * Get the value of any DOM attribute on a node
 * @param   { Object } dom - DOM node we want to parse
 * @param   { String } name - name of the attribute we want to get
 * @returns { String | undefined } name of the node attribute whether it exists
 */
function getAttr(dom, name) {
  return dom.getAttribute(name)
}

/**
 * Set any DOM attribute
 * @param { Object } dom - DOM node we want to update
 * @param { String } name - name of the property we want to set
 * @param { String } val - value of the property we want to set
 */
function setAttr(dom, name, val) {
  var xlink = XLINK_REGEX.exec(name);
  if (xlink && xlink[1])
    { dom.setAttributeNS(XLINK_NS, xlink[1], val); }
  else
    { dom.setAttribute(name, val); }
}

/**
 * Insert safely a tag to fix #1962 #1649
 * @param   { HTMLElement } root - children container
 * @param   { HTMLElement } curr - node to insert
 * @param   { HTMLElement } next - node that should preceed the current node inserted
 */
function safeInsert(root, curr, next) {
  root.insertBefore(curr, next.parentNode && next);
}

/**
 * Minimize risk: only zero or one _space_ between attr & value
 * @param   { String }   html - html string we want to parse
 * @param   { Function } fn - callback function to apply on any attribute found
 */
function walkAttrs(html, fn) {
  if (!html)
    { return }
  var m;
  while (m = RE_HTML_ATTRS.exec(html))
    { fn(m[1].toLowerCase(), m[2] || m[3] || m[4]); }
}

/**
 * Walk down recursively all the children tags starting dom node
 * @param   { Object }   dom - starting node where we will start the recursion
 * @param   { Function } fn - callback to transform the child node just found
 * @param   { Object }   context - fn can optionally return an object, which is passed to children
 */
function walkNodes(dom, fn, context) {
  if (dom) {
    var res = fn(dom, context);
    var next;
    // stop the recursion
    if (res === false) { return }

    dom = dom.firstChild;

    while (dom) {
      next = dom.nextSibling;
      walkNodes(dom, fn, res);
      dom = next;
    }
  }
}

var dom = Object.freeze({
	$$: $$,
	$: $,
	createFrag: createFrag,
	createDOMPlaceholder: createDOMPlaceholder,
	isSvg: isSvg,
	mkEl: mkEl,
	setInnerHTML: setInnerHTML,
	toggleVisibility: toggleVisibility,
	remAttr: remAttr,
	styleObjectToString: styleObjectToString,
	getAttr: getAttr,
	setAttr: setAttr,
	safeInsert: safeInsert,
	walkAttrs: walkAttrs,
	walkNodes: walkNodes
});

var styleNode;
var cssTextProp;
var byName = {};
var remainder = [];
var needsInject = false;

// skip the following code on the server
if (WIN) {
  styleNode = (function () {
    // create a new style element with the correct type
    var newNode = mkEl('style');
    setAttr(newNode, 'type', 'text/css');

    // replace any user node or insert the new one into the head
    var userNode = $('style[type=riot]');
    /* istanbul ignore next */
    if (userNode) {
      if (userNode.id) { newNode.id = userNode.id; }
      userNode.parentNode.replaceChild(newNode, userNode);
    }
    else { document.getElementsByTagName('head')[0].appendChild(newNode); }

    return newNode
  })();
  cssTextProp = styleNode.styleSheet;
}

/**
 * Object that will be used to inject and manage the css of every tag instance
 */
var styleManager = {
  styleNode: styleNode,
  /**
   * Save a tag style to be later injected into DOM
   * @param { String } css - css string
   * @param { String } name - if it's passed we will map the css to a tagname
   */
  add: function add(css, name) {
    if (name) { byName[name] = css; }
    else { remainder.push(css); }
    needsInject = true;
  },
  /**
   * Inject all previously saved tag styles into DOM
   * innerHTML seems slow: http://jsperf.com/riot-insert-style
   */
  inject: function inject() {
    if (!WIN || !needsInject) { return }
    needsInject = false;
    var style = Object.keys(byName)
      .map(function(k) { return byName[k] })
      .concat(remainder).join('\n');
    /* istanbul ignore next */
    if (cssTextProp) { cssTextProp.cssText = style; }
    else { styleNode.innerHTML = style; }
  }
};

/**
 * The riot template engine
 * @version v3.0.8
 */

var skipRegex = (function () { //eslint-disable-line no-unused-vars

  var beforeReChars = '[{(,;:?=|&!^~>%*/';

  var beforeReWords = [
    'case',
    'default',
    'do',
    'else',
    'in',
    'instanceof',
    'prefix',
    'return',
    'typeof',
    'void',
    'yield'
  ];

  var wordsLastChar = beforeReWords.reduce(function (s, w) {
    return s + w.slice(-1)
  }, '');

  var RE_REGEX = /^\/(?=[^*>/])[^[/\\]*(?:(?:\\.|\[(?:\\.|[^\]\\]*)*\])[^[\\/]*)*?\/[gimuy]*/;
  var RE_VN_CHAR = /[$\w]/;

  function prev (code, pos) {
    while (--pos >= 0 && /\s/.test(code[pos])){  }
    return pos
  }

  function _skipRegex (code, start) {

    var re = /.*/g;
    var pos = re.lastIndex = start++;
    var match = re.exec(code)[0].match(RE_REGEX);

    if (match) {
      var next = pos + match[0].length;

      pos = prev(code, pos);
      var c = code[pos];

      if (pos < 0 || ~beforeReChars.indexOf(c)) {
        return next
      }

      if (c === '.') {

        if (code[pos - 1] === '.') {
          start = next;
        }

      } else if (c === '+' || c === '-') {

        if (code[--pos] !== c ||
            (pos = prev(code, pos)) < 0 ||
            !RE_VN_CHAR.test(code[pos])) {
          start = next;
        }

      } else if (~wordsLastChar.indexOf(c)) {

        var end = pos + 1;

        while (--pos >= 0 && RE_VN_CHAR.test(code[pos])){  }
        if (~beforeReWords.indexOf(code.slice(pos + 1, end))) {
          start = next;
        }
      }
    }

    return start
  }

  return _skipRegex

})();

/**
 * riot.util.brackets
 *
 * - `brackets    ` - Returns a string or regex based on its parameter
 * - `brackets.set` - Change the current riot brackets
 *
 * @module
 */

/* global riot */

/* istanbul ignore next */
var brackets = (function (UNDEF) {

  var
    REGLOB = 'g',

    R_MLCOMMS = /\/\*[^*]*\*+(?:[^*\/][^*]*\*+)*\//g,

    R_STRINGS = /"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'|`[^`\\]*(?:\\[\S\s][^`\\]*)*`/g,

    S_QBLOCKS = R_STRINGS.source + '|' +
      /(?:\breturn\s+|(?:[$\w\)\]]|\+\+|--)\s*(\/)(?![*\/]))/.source + '|' +
      /\/(?=[^*\/])[^[\/\\]*(?:(?:\[(?:\\.|[^\]\\]*)*\]|\\.)[^[\/\\]*)*?([^<]\/)[gim]*/.source,

    UNSUPPORTED = RegExp('[\\' + 'x00-\\x1F<>a-zA-Z0-9\'",;\\\\]'),

    NEED_ESCAPE = /(?=[[\]()*+?.^$|])/g,

    S_QBLOCK2 = R_STRINGS.source + '|' + /(\/)(?![*\/])/.source,

    FINDBRACES = {
      '(': RegExp('([()])|'   + S_QBLOCK2, REGLOB),
      '[': RegExp('([[\\]])|' + S_QBLOCK2, REGLOB),
      '{': RegExp('([{}])|'   + S_QBLOCK2, REGLOB)
    },

    DEFAULT = '{ }';

  var _pairs = [
    '{', '}',
    '{', '}',
    /{[^}]*}/,
    /\\([{}])/g,
    /\\({)|{/g,
    RegExp('\\\\(})|([[({])|(})|' + S_QBLOCK2, REGLOB),
    DEFAULT,
    /^\s*{\^?\s*([$\w]+)(?:\s*,\s*(\S+))?\s+in\s+(\S.*)\s*}/,
    /(^|[^\\]){=[\S\s]*?}/
  ];

  var
    cachedBrackets = UNDEF,
    _regex,
    _cache = [],
    _settings;

  function _loopback (re) { return re }

  function _rewrite (re, bp) {
    if (!bp) { bp = _cache; }
    return new RegExp(
      re.source.replace(/{/g, bp[2]).replace(/}/g, bp[3]), re.global ? REGLOB : ''
    )
  }

  function _create (pair) {
    if (pair === DEFAULT) { return _pairs }

    var arr = pair.split(' ');

    if (arr.length !== 2 || UNSUPPORTED.test(pair)) {
      throw new Error('Unsupported brackets "' + pair + '"')
    }
    arr = arr.concat(pair.replace(NEED_ESCAPE, '\\').split(' '));

    arr[4] = _rewrite(arr[1].length > 1 ? /{[\S\s]*?}/ : _pairs[4], arr);
    arr[5] = _rewrite(pair.length > 3 ? /\\({|})/g : _pairs[5], arr);
    arr[6] = _rewrite(_pairs[6], arr);
    arr[7] = RegExp('\\\\(' + arr[3] + ')|([[({])|(' + arr[3] + ')|' + S_QBLOCK2, REGLOB);
    arr[8] = pair;
    return arr
  }

  function _brackets (reOrIdx) {
    return reOrIdx instanceof RegExp ? _regex(reOrIdx) : _cache[reOrIdx]
  }

  _brackets.split = function split (str, tmpl, _bp) {
    // istanbul ignore next: _bp is for the compiler
    if (!_bp) { _bp = _cache; }

    var
      parts = [],
      match,
      isexpr,
      start,
      pos,
      re = _bp[6];

    var qblocks = [];
    var prevStr = '';
    var mark, lastIndex;

    isexpr = start = re.lastIndex = 0;

    while ((match = re.exec(str))) {

      lastIndex = re.lastIndex;
      pos = match.index;

      if (isexpr) {

        if (match[2]) {

          var ch = match[2];
          var rech = FINDBRACES[ch];
          var ix = 1;

          rech.lastIndex = lastIndex;
          while ((match = rech.exec(str))) {
            if (match[1]) {
              if (match[1] === ch) { ++ix; }
              else if (!--ix) { break }
            } else {
              rech.lastIndex = pushQBlock(match.index, rech.lastIndex, match[2]);
            }
          }
          re.lastIndex = ix ? str.length : rech.lastIndex;
          continue
        }

        if (!match[3]) {
          re.lastIndex = pushQBlock(pos, lastIndex, match[4]);
          continue
        }
      }

      if (!match[1]) {
        unescapeStr(str.slice(start, pos));
        start = re.lastIndex;
        re = _bp[6 + (isexpr ^= 1)];
        re.lastIndex = start;
      }
    }

    if (str && start < str.length) {
      unescapeStr(str.slice(start));
    }

    parts.qblocks = qblocks;

    return parts

    function unescapeStr (s) {
      if (prevStr) {
        s = prevStr + s;
        prevStr = '';
      }
      if (tmpl || isexpr) {
        parts.push(s && s.replace(_bp[5], '$1'));
      } else {
        parts.push(s);
      }
    }

    function pushQBlock(_pos, _lastIndex, slash) { //eslint-disable-line
      if (slash) {
        _lastIndex = skipRegex(str, _pos);
      }

      if (tmpl && _lastIndex > _pos + 2) {
        mark = '\u2057' + qblocks.length + '~';
        qblocks.push(str.slice(_pos, _lastIndex));
        prevStr += str.slice(start, _pos) + mark;
        start = _lastIndex;
      }
      return _lastIndex
    }
  };

  _brackets.hasExpr = function hasExpr (str) {
    return _cache[4].test(str)
  };

  _brackets.loopKeys = function loopKeys (expr) {
    var m = expr.match(_cache[9]);

    return m
      ? { key: m[1], pos: m[2], val: _cache[0] + m[3].trim() + _cache[1] }
      : { val: expr.trim() }
  };

  _brackets.array = function array (pair) {
    return pair ? _create(pair) : _cache
  };

  function _reset (pair) {
    if ((pair || (pair = DEFAULT)) !== _cache[8]) {
      _cache = _create(pair);
      _regex = pair === DEFAULT ? _loopback : _rewrite;
      _cache[9] = _regex(_pairs[9]);
    }
    cachedBrackets = pair;
  }

  function _setSettings (o) {
    var b;

    o = o || {};
    b = o.brackets;
    Object.defineProperty(o, 'brackets', {
      set: _reset,
      get: function () { return cachedBrackets },
      enumerable: true
    });
    _settings = o;
    _reset(b);
  }

  Object.defineProperty(_brackets, 'settings', {
    set: _setSettings,
    get: function () { return _settings }
  });

  /* istanbul ignore next: in the browser riot is always in the scope */
  _brackets.settings = typeof riot !== 'undefined' && riot.settings || {};
  _brackets.set = _reset;
  _brackets.skipRegex = skipRegex;

  _brackets.R_STRINGS = R_STRINGS;
  _brackets.R_MLCOMMS = R_MLCOMMS;
  _brackets.S_QBLOCKS = S_QBLOCKS;
  _brackets.S_QBLOCK2 = S_QBLOCK2;

  return _brackets

})();

/**
 * @module tmpl
 *
 * tmpl          - Root function, returns the template value, render with data
 * tmpl.hasExpr  - Test the existence of a expression inside a string
 * tmpl.loopKeys - Get the keys for an 'each' loop (used by `_each`)
 */

/* istanbul ignore next */
var tmpl = (function () {

  var _cache = {};

  function _tmpl (str, data) {
    if (!str) { return str }

    return (_cache[str] || (_cache[str] = _create(str))).call(
      data, _logErr.bind({
        data: data,
        tmpl: str
      })
    )
  }

  _tmpl.hasExpr = brackets.hasExpr;

  _tmpl.loopKeys = brackets.loopKeys;

  // istanbul ignore next
  _tmpl.clearCache = function () { _cache = {}; };

  _tmpl.errorHandler = null;

  function _logErr (err, ctx) {

    err.riotData = {
      tagName: ctx && ctx.__ && ctx.__.tagName,
      _riot_id: ctx && ctx._riot_id  //eslint-disable-line camelcase
    };

    if (_tmpl.errorHandler) { _tmpl.errorHandler(err); }
    else if (
      typeof console !== 'undefined' &&
      typeof console.error === 'function'
    ) {
      console.error(err.message);
      console.log('<%s> %s', err.riotData.tagName || 'Unknown tag', this.tmpl); // eslint-disable-line
      console.log(this.data); // eslint-disable-line
    }
  }

  function _create (str) {
    var expr = _getTmpl(str);

    if (expr.slice(0, 11) !== 'try{return ') { expr = 'return ' + expr; }

    return new Function('E', expr + ';')    // eslint-disable-line no-new-func
  }

  var RE_DQUOTE = /\u2057/g;
  var RE_QBMARK = /\u2057(\d+)~/g;

  function _getTmpl (str) {
    var parts = brackets.split(str.replace(RE_DQUOTE, '"'), 1);
    var qstr = parts.qblocks;
    var expr;

    if (parts.length > 2 || parts[0]) {
      var i, j, list = [];

      for (i = j = 0; i < parts.length; ++i) {

        expr = parts[i];

        if (expr && (expr = i & 1

            ? _parseExpr(expr, 1, qstr)

            : '"' + expr
                .replace(/\\/g, '\\\\')
                .replace(/\r\n?|\n/g, '\\n')
                .replace(/"/g, '\\"') +
              '"'

          )) { list[j++] = expr; }

      }

      expr = j < 2 ? list[0]
           : '[' + list.join(',') + '].join("")';

    } else {

      expr = _parseExpr(parts[1], 0, qstr);
    }

    if (qstr.length) {
      expr = expr.replace(RE_QBMARK, function (_, pos) {
        return qstr[pos]
          .replace(/\r/g, '\\r')
          .replace(/\n/g, '\\n')
      });
    }
    return expr
  }

  var RE_CSNAME = /^(?:(-?[_A-Za-z\xA0-\xFF][-\w\xA0-\xFF]*)|\u2057(\d+)~):/;
  var
    RE_BREND = {
      '(': /[()]/g,
      '[': /[[\]]/g,
      '{': /[{}]/g
    };

  function _parseExpr (expr, asText, qstr) {

    expr = expr
      .replace(/\s+/g, ' ').trim()
      .replace(/\ ?([[\({},?\.:])\ ?/g, '$1');

    if (expr) {
      var
        list = [],
        cnt = 0,
        match;

      while (expr &&
            (match = expr.match(RE_CSNAME)) &&
            !match.index
        ) {
        var
          key,
          jsb,
          re = /,|([[{(])|$/g;

        expr = RegExp.rightContext;
        key  = match[2] ? qstr[match[2]].slice(1, -1).trim().replace(/\s+/g, ' ') : match[1];

        while (jsb = (match = re.exec(expr))[1]) { skipBraces(jsb, re); }

        jsb  = expr.slice(0, match.index);
        expr = RegExp.rightContext;

        list[cnt++] = _wrapExpr(jsb, 1, key);
      }

      expr = !cnt ? _wrapExpr(expr, asText)
           : cnt > 1 ? '[' + list.join(',') + '].join(" ").trim()' : list[0];
    }
    return expr

    function skipBraces (ch, re) {
      var
        mm,
        lv = 1,
        ir = RE_BREND[ch];

      ir.lastIndex = re.lastIndex;
      while (mm = ir.exec(expr)) {
        if (mm[0] === ch) { ++lv; }
        else if (!--lv) { break }
      }
      re.lastIndex = lv ? expr.length : ir.lastIndex;
    }
  }

  // istanbul ignore next: not both
  var // eslint-disable-next-line max-len
    JS_CONTEXT = '"in this?this:' + (typeof window !== 'object' ? 'global' : 'window') + ').',
    JS_VARNAME = /[,{][\$\w]+(?=:)|(^ *|[^$\w\.{])(?!(?:typeof|true|false|null|undefined|in|instanceof|is(?:Finite|NaN)|void|NaN|new|Date|RegExp|Math)(?![$\w]))([$_A-Za-z][$\w]*)/g,
    JS_NOPROPS = /^(?=(\.[$\w]+))\1(?:[^.[(]|$)/;

  function _wrapExpr (expr, asText, key) {
    var tb;

    expr = expr.replace(JS_VARNAME, function (match, p, mvar, pos, s) {
      if (mvar) {
        pos = tb ? 0 : pos + match.length;

        if (mvar !== 'this' && mvar !== 'global' && mvar !== 'window') {
          match = p + '("' + mvar + JS_CONTEXT + mvar;
          if (pos) { tb = (s = s[pos]) === '.' || s === '(' || s === '['; }
        } else if (pos) {
          tb = !JS_NOPROPS.test(s.slice(pos));
        }
      }
      return match
    });

    if (tb) {
      expr = 'try{return ' + expr + '}catch(e){E(e,this)}';
    }

    if (key) {

      expr = (tb
          ? 'function(){' + expr + '}.call(this)' : '(' + expr + ')'
        ) + '?"' + key + '":""';

    } else if (asText) {

      expr = 'function(v){' + (tb
          ? expr.replace('return ', 'v=') : 'v=(' + expr + ')'
        ) + ';return v||v===0?v:""}.call(this)';
    }

    return expr
  }

  _tmpl.version = brackets.version = 'v3.0.8';

  return _tmpl

})();

/* istanbul ignore next */
var observable$1 = function(el) {

  /**
   * Extend the original object or create a new empty one
   * @type { Object }
   */

  el = el || {};

  /**
   * Private variables
   */
  var callbacks = {},
    slice = Array.prototype.slice;

  /**
   * Public Api
   */

  // extend the el object adding the observable methods
  Object.defineProperties(el, {
    /**
     * Listen to the given `event` ands
     * execute the `callback` each time an event is triggered.
     * @param  { String } event - event id
     * @param  { Function } fn - callback function
     * @returns { Object } el
     */
    on: {
      value: function(event, fn) {
        if (typeof fn == 'function')
          { (callbacks[event] = callbacks[event] || []).push(fn); }
        return el
      },
      enumerable: false,
      writable: false,
      configurable: false
    },

    /**
     * Removes the given `event` listeners
     * @param   { String } event - event id
     * @param   { Function } fn - callback function
     * @returns { Object } el
     */
    off: {
      value: function(event, fn) {
        if (event == '*' && !fn) { callbacks = {}; }
        else {
          if (fn) {
            var arr = callbacks[event];
            for (var i = 0, cb; cb = arr && arr[i]; ++i) {
              if (cb == fn) { arr.splice(i--, 1); }
            }
          } else { delete callbacks[event]; }
        }
        return el
      },
      enumerable: false,
      writable: false,
      configurable: false
    },

    /**
     * Listen to the given `event` and
     * execute the `callback` at most once
     * @param   { String } event - event id
     * @param   { Function } fn - callback function
     * @returns { Object } el
     */
    one: {
      value: function(event, fn) {
        function on() {
          el.off(event, on);
          fn.apply(el, arguments);
        }
        return el.on(event, on)
      },
      enumerable: false,
      writable: false,
      configurable: false
    },

    /**
     * Execute all callback functions that listen to
     * the given `event`
     * @param   { String } event - event id
     * @returns { Object } el
     */
    trigger: {
      value: function(event) {
        var arguments$1 = arguments;


        // getting the arguments
        var arglen = arguments.length - 1,
          args = new Array(arglen),
          fns,
          fn,
          i;

        for (i = 0; i < arglen; i++) {
          args[i] = arguments$1[i + 1]; // skip first argument
        }

        fns = slice.call(callbacks[event] || [], 0);

        for (i = 0; fn = fns[i]; ++i) {
          fn.apply(el, args);
        }

        if (callbacks['*'] && event != '*')
          { el.trigger.apply(el, ['*', event].concat(args)); }

        return el
      },
      enumerable: false,
      writable: false,
      configurable: false
    }
  });

  return el

};

/**
 * Specialized function for looping an array-like collection with `each={}`
 * @param   { Array } list - collection of items
 * @param   {Function} fn - callback function
 * @returns { Array } the array looped
 */
function each(list, fn) {
  var len = list ? list.length : 0;
  var i = 0;
  for (; i < len; ++i) {
    fn(list[i], i);
  }
  return list
}

/**
 * Check whether an array contains an item
 * @param   { Array } array - target array
 * @param   { * } item - item to test
 * @returns { Boolean } -
 */
function contains(array, item) {
  return array.indexOf(item) !== -1
}

/**
 * Convert a string containing dashes to camel case
 * @param   { String } str - input string
 * @returns { String } my-string -> myString
 */
function toCamel(str) {
  return str.replace(/-(\w)/g, function (_, c) { return c.toUpperCase(); })
}

/**
 * Faster String startsWith alternative
 * @param   { String } str - source string
 * @param   { String } value - test string
 * @returns { Boolean } -
 */
function startsWith(str, value) {
  return str.slice(0, value.length) === value
}

/**
 * Helper function to set an immutable property
 * @param   { Object } el - object where the new property will be set
 * @param   { String } key - object key where the new property will be stored
 * @param   { * } value - value of the new property
 * @param   { Object } options - set the propery overriding the default options
 * @returns { Object } - the initial object
 */
function defineProperty(el, key, value, options) {
  Object.defineProperty(el, key, extend({
    value: value,
    enumerable: false,
    writable: false,
    configurable: true
  }, options));
  return el
}

/**
 * Extend any object with other properties
 * @param   { Object } src - source object
 * @returns { Object } the resulting extended object
 *
 * var obj = { foo: 'baz' }
 * extend(obj, {bar: 'bar', foo: 'bar'})
 * console.log(obj) => {bar: 'bar', foo: 'bar'}
 *
 */
function extend(src) {
  var obj, args = arguments;
  for (var i = 1; i < args.length; ++i) {
    if (obj = args[i]) {
      for (var key in obj) {
        // check if this property of the source object could be overridden
        if (isWritable(src, key))
          { src[key] = obj[key]; }
      }
    }
  }
  return src
}

var misc = Object.freeze({
	each: each,
	contains: contains,
	toCamel: toCamel,
	startsWith: startsWith,
	defineProperty: defineProperty,
	extend: extend
});

var settings$1 = extend(Object.create(brackets.settings), {
  skipAnonymousTags: true,
  // handle the auto updates on any DOM event
  autoUpdate: true
});

/**
 * Trigger DOM events
 * @param   { HTMLElement } dom - dom element target of the event
 * @param   { Function } handler - user function
 * @param   { Object } e - event object
 */
function handleEvent(dom, handler, e) {
  var ptag = this.__.parent,
    item = this.__.item;

  if (!item)
    { while (ptag && !item) {
      item = ptag.__.item;
      ptag = ptag.__.parent;
    } }

  // override the event properties
  /* istanbul ignore next */
  if (isWritable(e, 'currentTarget')) { e.currentTarget = dom; }
  /* istanbul ignore next */
  if (isWritable(e, 'target')) { e.target = e.srcElement; }
  /* istanbul ignore next */
  if (isWritable(e, 'which')) { e.which = e.charCode || e.keyCode; }

  e.item = item;

  handler.call(this, e);

  // avoid auto updates
  if (!settings$1.autoUpdate) { return }

  if (!e.preventUpdate) {
    var p = getImmediateCustomParentTag(this);
    // fixes #2083
    if (p.isMounted) { p.update(); }
  }
}

/**
 * Attach an event to a DOM node
 * @param { String } name - event name
 * @param { Function } handler - event callback
 * @param { Object } dom - dom node
 * @param { Tag } tag - tag instance
 */
function setEventHandler(name, handler, dom, tag) {
  var eventName,
    cb = handleEvent.bind(tag, dom, handler);

  // avoid to bind twice the same event
  // possible fix for #2332
  dom[name] = null;

  // normalize event name
  eventName = name.replace(RE_EVENTS_PREFIX, '');

  // cache the listener into the listeners array
  if (!contains(tag.__.listeners, dom)) { tag.__.listeners.push(dom); }
  if (!dom[RIOT_EVENTS_KEY]) { dom[RIOT_EVENTS_KEY] = {}; }
  if (dom[RIOT_EVENTS_KEY][name]) { dom.removeEventListener(eventName, dom[RIOT_EVENTS_KEY][name]); }

  dom[RIOT_EVENTS_KEY][name] = cb;
  dom.addEventListener(eventName, cb, false);
}

/**
 * Update dynamically created data-is tags with changing expressions
 * @param { Object } expr - expression tag and expression info
 * @param { Tag }    parent - parent for tag creation
 * @param { String } tagName - tag implementation we want to use
 */
function updateDataIs(expr, parent, tagName) {
  var conf, isVirtual, head, ref;

  if (expr.tag && expr.tagName === tagName) {
    expr.tag.update();
    return
  }

  isVirtual = expr.dom.tagName === 'VIRTUAL';
  // sync _parent to accommodate changing tagnames
  if (expr.tag) {
    // need placeholder before unmount
    if(isVirtual) {
      head = expr.tag.__.head;
      ref = createDOMPlaceholder();
      head.parentNode.insertBefore(ref, head);
    }

    expr.tag.unmount(true);
  }

  if (!isString(tagName)) { return }

  expr.impl = __TAG_IMPL[tagName];
  conf = {root: expr.dom, parent: parent, hasImpl: true, tagName: tagName};
  expr.tag = initChildTag(expr.impl, conf, expr.dom.innerHTML, parent);
  each(expr.attrs, function (a) { return setAttr(expr.tag.root, a.name, a.value); });
  expr.tagName = tagName;
  expr.tag.mount();
  if (isVirtual)
    { makeReplaceVirtual(expr.tag, ref || expr.tag.root); } // root exist first time, after use placeholder

  // parent is the placeholder tag, not the dynamic tag so clean up
  parent.__.onUnmount = function() {
    var delName = expr.tag.opts.dataIs,
      tags = expr.tag.parent.tags,
      _tags = expr.tag.__.parent.tags;
    arrayishRemove(tags, delName, expr.tag);
    arrayishRemove(_tags, delName, expr.tag);
    expr.tag.unmount();
  };
}

/**
 * Nomalize any attribute removing the "riot-" prefix
 * @param   { String } attrName - original attribute name
 * @returns { String } valid html attribute name
 */
function normalizeAttrName(attrName) {
  if (!attrName) { return null }
  attrName = attrName.replace(ATTRS_PREFIX, '');
  if (CASE_SENSITIVE_ATTRIBUTES[attrName]) { attrName = CASE_SENSITIVE_ATTRIBUTES[attrName]; }
  return attrName
}

/**
 * Update on single tag expression
 * @this Tag
 * @param { Object } expr - expression logic
 * @returns { undefined }
 */
function updateExpression(expr) {
  if (this.root && getAttr(this.root,'virtualized')) { return }

  var dom = expr.dom,
    // remove the riot- prefix
    attrName = normalizeAttrName(expr.attr),
    isToggle = contains([SHOW_DIRECTIVE, HIDE_DIRECTIVE], attrName),
    isVirtual = expr.root && expr.root.tagName === 'VIRTUAL',
    parent = dom && (expr.parent || dom.parentNode),
    // detect the style attributes
    isStyleAttr = attrName === 'style',
    isClassAttr = attrName === 'class',
    hasValue,
    isObj,
    value;

  // if it's a tag we could totally skip the rest
  if (expr._riot_id) {
    if (expr.isMounted) {
      expr.update();
    // if it hasn't been mounted yet, do that now.
    } else {
      expr.mount();
      if (isVirtual) {
        makeReplaceVirtual(expr, expr.root);
      }
    }
    return
  }
  // if this expression has the update method it means it can handle the DOM changes by itself
  if (expr.update) { return expr.update() }

  // ...it seems to be a simple expression so we try to calculat its value
  value = tmpl(expr.expr, isToggle ? extend({}, Object.create(this.parent), this) : this);
  hasValue = !isBlank(value);
  isObj = isObject(value);

  // convert the style/class objects to strings
  if (isObj) {
    isObj = !isClassAttr && !isStyleAttr;
    if (isClassAttr) {
      value = tmpl(JSON.stringify(value), this);
    } else if (isStyleAttr) {
      value = styleObjectToString(value);
    }
  }

  // remove original attribute
  if (expr.attr && (!expr.isAttrRemoved || !hasValue || value === false)) {
    remAttr(dom, expr.attr);
    expr.isAttrRemoved = true;
  }

  // for the boolean attributes we don't need the value
  // we can convert it to checked=true to checked=checked
  if (expr.bool) { value = value ? attrName : false; }
  if (expr.isRtag) { return updateDataIs(expr, this, value) }
  if (expr.wasParsedOnce && expr.value === value) { return }

  // update the expression value
  expr.value = value;
  expr.wasParsedOnce = true;

  // if the value is an object we can not do much more with it
  if (isObj && !isToggle) { return }
  // avoid to render undefined/null values
  if (isBlank(value)) { value = ''; }

  // textarea and text nodes have no attribute name
  if (!attrName) {
    // about #815 w/o replace: the browser converts the value to a string,
    // the comparison by "==" does too, but not in the server
    value += '';
    // test for parent avoids error with invalid assignment to nodeValue
    if (parent) {
      // cache the parent node because somehow it will become null on IE
      // on the next iteration
      expr.parent = parent;
      if (parent.tagName === 'TEXTAREA') {
        parent.value = value;                    // #1113
        if (!IE_VERSION) { dom.nodeValue = value; }  // #1625 IE throws here, nodeValue
      }                                         // will be available on 'updated'
      else { dom.nodeValue = value; }
    }
    return
  }


  // event handler
  if (isFunction(value)) {
    setEventHandler(attrName, value, dom, this);
  // show / hide
  } else if (isToggle) {
    toggleVisibility(dom, attrName === HIDE_DIRECTIVE ? !value : value);
  // handle attributes
  } else {
    if (expr.bool) {
      dom[attrName] = value;
    }

    if (attrName === 'value' && dom.value !== value) {
      dom.value = value;
    }

    if (hasValue && value !== false) {
      setAttr(dom, attrName, value);
    }

    // make sure that in case of style changes
    // the element stays hidden
    if (isStyleAttr && dom.hidden) { toggleVisibility(dom, false); }
  }
}

/**
 * Update all the expressions in a Tag instance
 * @this Tag
 * @param { Array } expressions - expression that must be re evaluated
 */
function updateAllExpressions(expressions) {
  each(expressions, updateExpression.bind(this));
}

var IfExpr = {
  init: function init(dom, tag, expr) {
    remAttr(dom, CONDITIONAL_DIRECTIVE);
    this.tag = tag;
    this.expr = expr;
    this.stub = createDOMPlaceholder();
    this.pristine = dom;

    var p = dom.parentNode;
    p.insertBefore(this.stub, dom);
    p.removeChild(dom);

    return this
  },
  update: function update() {
    this.value = tmpl(this.expr, this.tag);

    if (this.value && !this.current) { // insert
      this.current = this.pristine.cloneNode(true);
      this.stub.parentNode.insertBefore(this.current, this.stub);
      this.expressions = [];
      parseExpressions.apply(this.tag, [this.current, this.expressions, true]);
    } else if (!this.value && this.current) { // remove
      unmountAll(this.expressions);
      if (this.current._tag) {
        this.current._tag.unmount();
      } else if (this.current.parentNode) {
        this.current.parentNode.removeChild(this.current);
      }
      this.current = null;
      this.expressions = [];
    }

    if (this.value) { updateAllExpressions.call(this.tag, this.expressions); }
  },
  unmount: function unmount() {
    unmountAll(this.expressions || []);
  }
};

var RefExpr = {
  init: function init(dom, parent, attrName, attrValue) {
    this.dom = dom;
    this.attr = attrName;
    this.rawValue = attrValue;
    this.parent = parent;
    this.hasExp = tmpl.hasExpr(attrValue);
    return this
  },
  update: function update() {
    var old = this.value;
    var customParent = this.parent && getImmediateCustomParentTag(this.parent);
    // if the referenced element is a custom tag, then we set the tag itself, rather than DOM
    var tagOrDom = this.dom.__ref || this.tag || this.dom;

    this.value = this.hasExp ? tmpl(this.rawValue, this.parent) : this.rawValue;

    // the name changed, so we need to remove it from the old key (if present)
    if (!isBlank(old) && customParent) { arrayishRemove(customParent.refs, old, tagOrDom); }
    if (!isBlank(this.value) && isString(this.value)) {
      // add it to the refs of parent tag (this behavior was changed >=3.0)
      if (customParent) { arrayishAdd(
        customParent.refs,
        this.value,
        tagOrDom,
        // use an array if it's a looped node and the ref is not an expression
        null,
        this.parent.__.index
      ); }

      if (this.value !== old) {
        setAttr(this.dom, this.attr, this.value);
      }
    } else {
      remAttr(this.dom, this.attr);
    }

    // cache the ref bound to this dom node
    // to reuse it in future (see also #2329)
    if (!this.dom.__ref) { this.dom.__ref = tagOrDom; }
  },
  unmount: function unmount() {
    var tagOrDom = this.tag || this.dom;
    var customParent = this.parent && getImmediateCustomParentTag(this.parent);
    if (!isBlank(this.value) && customParent)
      { arrayishRemove(customParent.refs, this.value, tagOrDom); }
  }
};

/**
 * Convert the item looped into an object used to extend the child tag properties
 * @param   { Object } expr - object containing the keys used to extend the children tags
 * @param   { * } key - value to assign to the new object returned
 * @param   { * } val - value containing the position of the item in the array
 * @param   { Object } base - prototype object for the new item
 * @returns { Object } - new object containing the values of the original item
 *
 * The variables 'key' and 'val' are arbitrary.
 * They depend on the collection type looped (Array, Object)
 * and on the expression used on the each tag
 *
 */
function mkitem(expr, key, val, base) {
  var item = base ? Object.create(base) : {};
  item[expr.key] = key;
  if (expr.pos) { item[expr.pos] = val; }
  return item
}

/**
 * Unmount the redundant tags
 * @param   { Array } items - array containing the current items to loop
 * @param   { Array } tags - array containing all the children tags
 */
function unmountRedundant(items, tags) {
  var i = tags.length,
    j = items.length;

  while (i > j) {
    i--;
    remove.apply(tags[i], [tags, i]);
  }
}


/**
 * Remove a child tag
 * @this Tag
 * @param   { Array } tags - tags collection
 * @param   { Number } i - index of the tag to remove
 */
function remove(tags, i) {
  tags.splice(i, 1);
  this.unmount();
  arrayishRemove(this.parent, this, this.__.tagName, true);
}

/**
 * Move the nested custom tags in non custom loop tags
 * @this Tag
 * @param   { Number } i - current position of the loop tag
 */
function moveNestedTags(i) {
  var this$1 = this;

  each(Object.keys(this.tags), function (tagName) {
    moveChildTag.apply(this$1.tags[tagName], [tagName, i]);
  });
}

/**
 * Move a child tag
 * @this Tag
 * @param   { HTMLElement } root - dom node containing all the loop children
 * @param   { Tag } nextTag - instance of the next tag preceding the one we want to move
 * @param   { Boolean } isVirtual - is it a virtual tag?
 */
function move(root, nextTag, isVirtual) {
  if (isVirtual)
    { moveVirtual.apply(this, [root, nextTag]); }
  else
    { safeInsert(root, this.root, nextTag.root); }
}

/**
 * Insert and mount a child tag
 * @this Tag
 * @param   { HTMLElement } root - dom node containing all the loop children
 * @param   { Tag } nextTag - instance of the next tag preceding the one we want to insert
 * @param   { Boolean } isVirtual - is it a virtual tag?
 */
function insert(root, nextTag, isVirtual) {
  if (isVirtual)
    { makeVirtual.apply(this, [root, nextTag]); }
  else
    { safeInsert(root, this.root, nextTag.root); }
}

/**
 * Append a new tag into the DOM
 * @this Tag
 * @param   { HTMLElement } root - dom node containing all the loop children
 * @param   { Boolean } isVirtual - is it a virtual tag?
 */
function append(root, isVirtual) {
  if (isVirtual)
    { makeVirtual.call(this, root); }
  else
    { root.appendChild(this.root); }
}

/**
 * Manage tags having the 'each'
 * @param   { HTMLElement } dom - DOM node we need to loop
 * @param   { Tag } parent - parent tag instance where the dom node is contained
 * @param   { String } expr - string contained in the 'each' attribute
 * @returns { Object } expression object for this each loop
 */
function _each(dom, parent, expr) {

  // remove the each property from the original tag
  remAttr(dom, LOOP_DIRECTIVE);

  var mustReorder = typeof getAttr(dom, LOOP_NO_REORDER_DIRECTIVE) !== T_STRING || remAttr(dom, LOOP_NO_REORDER_DIRECTIVE),
    tagName = getTagName(dom),
    impl = __TAG_IMPL[tagName],
    parentNode = dom.parentNode,
    placeholder = createDOMPlaceholder(),
    child = getTag(dom),
    ifExpr = getAttr(dom, CONDITIONAL_DIRECTIVE),
    tags = [],
    oldItems = [],
    hasKeys,
    isLoop = true,
    isAnonymous = !__TAG_IMPL[tagName],
    isVirtual = dom.tagName === 'VIRTUAL';

  // parse the each expression
  expr = tmpl.loopKeys(expr);
  expr.isLoop = true;

  if (ifExpr) { remAttr(dom, CONDITIONAL_DIRECTIVE); }

  // insert a marked where the loop tags will be injected
  parentNode.insertBefore(placeholder, dom);
  parentNode.removeChild(dom);

  expr.update = function updateEach() {
    // get the new items collection
    expr.value = tmpl(expr.val, parent);

    var frag = createFrag(),
      items = expr.value,
      isObject$$1 = !isArray(items) && !isString(items),
      root = placeholder.parentNode;

    // if this DOM was removed the update here is useless
    // this condition fixes also a weird async issue on IE in our unit test
    if (!root) { return }

    // object loop. any changes cause full redraw
    if (isObject$$1) {
      hasKeys = items || false;
      items = hasKeys ?
        Object.keys(items).map(function (key) {
          return mkitem(expr, items[key], key)
        }) : [];
    } else {
      hasKeys = false;
    }

    if (ifExpr) {
      items = items.filter(function(item, i) {
        if (expr.key && !isObject$$1)
          { return !!tmpl(ifExpr, mkitem(expr, item, i, parent)) }

        return !!tmpl(ifExpr, extend(Object.create(parent), item))
      });
    }

    // loop all the new items
    each(items, function(item, i) {
      // reorder only if the items are objects
      var
        doReorder = mustReorder && typeof item === T_OBJECT && !hasKeys,
        oldPos = oldItems.indexOf(item),
        isNew = oldPos === -1,
        pos = !isNew && doReorder ? oldPos : i,
        // does a tag exist in this position?
        tag = tags[pos],
        mustAppend = i >= oldItems.length,
        mustCreate =  doReorder && isNew || !doReorder && !tag;

      item = !hasKeys && expr.key ? mkitem(expr, item, i) : item;

      // new tag
      if (mustCreate) {
        tag = new Tag$1(impl, {
          parent: parent,
          isLoop: isLoop,
          isAnonymous: isAnonymous,
          tagName: tagName,
          root: dom.cloneNode(isAnonymous),
          item: item,
          index: i,
        }, dom.innerHTML);

        // mount the tag
        tag.mount();

        if (mustAppend)
          { append.apply(tag, [frag || root, isVirtual]); }
        else
          { insert.apply(tag, [root, tags[i], isVirtual]); }

        if (!mustAppend) { oldItems.splice(i, 0, item); }
        tags.splice(i, 0, tag);
        if (child) { arrayishAdd(parent.tags, tagName, tag, true); }
      } else if (pos !== i && doReorder) {
        // move
        if (contains(items, oldItems[pos])) {
          move.apply(tag, [root, tags[i], isVirtual]);
          // move the old tag instance
          tags.splice(i, 0, tags.splice(pos, 1)[0]);
          // move the old item
          oldItems.splice(i, 0, oldItems.splice(pos, 1)[0]);
        }

        // update the position attribute if it exists
        if (expr.pos) { tag[expr.pos] = i; }

        // if the loop tags are not custom
        // we need to move all their custom tags into the right position
        if (!child && tag.tags) { moveNestedTags.call(tag, i); }
      }

      // cache the original item to use it in the events bound to this node
      // and its children
      tag.__.item = item;
      tag.__.index = i;
      tag.__.parent = parent;

      if (!mustCreate) { tag.update(item); }
    });

    // remove the redundant tags
    unmountRedundant(items, tags);

    // clone the items array
    oldItems = items.slice();

    // this condition is weird u
    root.insertBefore(frag, placeholder);
  };

  expr.unmount = function() {
    each(tags, function(t) { t.unmount(); });
  };

  return expr
}

/**
 * Walk the tag DOM to detect the expressions to evaluate
 * @this Tag
 * @param   { HTMLElement } root - root tag where we will start digging the expressions
 * @param   { Array } expressions - empty array where the expressions will be added
 * @param   { Boolean } mustIncludeRoot - flag to decide whether the root must be parsed as well
 * @returns { Object } an object containing the root noode and the dom tree
 */
function parseExpressions(root, expressions, mustIncludeRoot) {
  var this$1 = this;

  var tree = {parent: {children: expressions}};

  walkNodes(root, function (dom, ctx) {
    var type = dom.nodeType, parent = ctx.parent, attr, expr, tagImpl;
    if (!mustIncludeRoot && dom === root) { return {parent: parent} }

    // text node
    if (type === 3 && dom.parentNode.tagName !== 'STYLE' && tmpl.hasExpr(dom.nodeValue))
      { parent.children.push({dom: dom, expr: dom.nodeValue}); }

    if (type !== 1) { return ctx } // not an element

    var isVirtual = dom.tagName === 'VIRTUAL';

    // loop. each does it's own thing (for now)
    if (attr = getAttr(dom, LOOP_DIRECTIVE)) {
      if(isVirtual) { setAttr(dom, 'loopVirtual', true); } // ignore here, handled in _each
      parent.children.push(_each(dom, this$1, attr));
      return false
    }

    // if-attrs become the new parent. Any following expressions (either on the current
    // element, or below it) become children of this expression.
    if (attr = getAttr(dom, CONDITIONAL_DIRECTIVE)) {
      parent.children.push(Object.create(IfExpr).init(dom, this$1, attr));
      return false
    }

    if (expr = getAttr(dom, IS_DIRECTIVE)) {
      if (tmpl.hasExpr(expr)) {
        parent.children.push({isRtag: true, expr: expr, dom: dom, attrs: [].slice.call(dom.attributes)});
        return false
      }
    }

    // if this is a tag, stop traversing here.
    // we ignore the root, since parseExpressions is called while we're mounting that root
    tagImpl = getTag(dom);
    if(isVirtual) {
      if(getAttr(dom, 'virtualized')) {dom.parentElement.removeChild(dom); } // tag created, remove from dom
      if(!tagImpl && !getAttr(dom, 'virtualized') && !getAttr(dom, 'loopVirtual'))  // ok to create virtual tag
        { tagImpl = { tmpl: dom.outerHTML }; }
    }

    if (tagImpl && (dom !== root || mustIncludeRoot)) {
      if(isVirtual && !getAttr(dom, IS_DIRECTIVE)) { // handled in update
        // can not remove attribute like directives
        // so flag for removal after creation to prevent maximum stack error
        setAttr(dom, 'virtualized', true);

        var tag = new Tag$1({ tmpl: dom.outerHTML },
          {root: dom, parent: this$1},
          dom.innerHTML);
        parent.children.push(tag); // no return, anonymous tag, keep parsing
      } else {
        var conf = {root: dom, parent: this$1, hasImpl: true};
        parent.children.push(initChildTag(tagImpl, conf, dom.innerHTML, this$1));
        return false
      }
    }

    // attribute expressions
    parseAttributes.apply(this$1, [dom, dom.attributes, function(attr, expr) {
      if (!expr) { return }
      parent.children.push(expr);
    }]);

    // whatever the parent is, all child elements get the same parent.
    // If this element had an if-attr, that's the parent for all child elements
    return {parent: parent}
  }, tree);
}

/**
 * Calls `fn` for every attribute on an element. If that attr has an expression,
 * it is also passed to fn.
 * @this Tag
 * @param   { HTMLElement } dom - dom node to parse
 * @param   { Array } attrs - array of attributes
 * @param   { Function } fn - callback to exec on any iteration
 */
function parseAttributes(dom, attrs, fn) {
  var this$1 = this;

  each(attrs, function (attr) {
    if (!attr) { return false }

    var name = attr.name, bool = isBoolAttr(name), expr;

    if (contains(REF_DIRECTIVES, name)) {
      expr =  Object.create(RefExpr).init(dom, this$1, name, attr.value);
    } else if (tmpl.hasExpr(attr.value)) {
      expr = {dom: dom, expr: attr.value, attr: name, bool: bool};
    }

    fn(attr, expr);
  });
}

/*
  Includes hacks needed for the Internet Explorer version 9 and below
  See: http://kangax.github.io/compat-table/es5/#ie8
       http://codeplanet.io/dropping-ie8/
*/

var reHasYield  = /<yield\b/i;
var reYieldAll  = /<yield\s*(?:\/>|>([\S\s]*?)<\/yield\s*>|>)/ig;
var reYieldSrc  = /<yield\s+to=['"]([^'">]*)['"]\s*>([\S\s]*?)<\/yield\s*>/ig;
var reYieldDest = /<yield\s+from=['"]?([-\w]+)['"]?\s*(?:\/>|>([\S\s]*?)<\/yield\s*>)/ig;
var rootEls = { tr: 'tbody', th: 'tr', td: 'tr', col: 'colgroup' };
var tblTags = IE_VERSION && IE_VERSION < 10 ? RE_SPECIAL_TAGS : RE_SPECIAL_TAGS_NO_OPTION;
var GENERIC = 'div';
var SVG = 'svg';


/*
  Creates the root element for table or select child elements:
  tr/th/td/thead/tfoot/tbody/caption/col/colgroup/option/optgroup
*/
function specialTags(el, tmpl, tagName) {

  var
    select = tagName[0] === 'o',
    parent = select ? 'select>' : 'table>';

  // trim() is important here, this ensures we don't have artifacts,
  // so we can check if we have only one element inside the parent
  el.innerHTML = '<' + parent + tmpl.trim() + '</' + parent;
  parent = el.firstChild;

  // returns the immediate parent if tr/th/td/col is the only element, if not
  // returns the whole tree, as this can include additional elements
  /* istanbul ignore next */
  if (select) {
    parent.selectedIndex = -1;  // for IE9, compatible w/current riot behavior
  } else {
    // avoids insertion of cointainer inside container (ex: tbody inside tbody)
    var tname = rootEls[tagName];
    if (tname && parent.childElementCount === 1) { parent = $(tname, parent); }
  }
  return parent
}

/*
  Replace the yield tag from any tag template with the innerHTML of the
  original tag in the page
*/
function replaceYield(tmpl, html) {
  // do nothing if no yield
  if (!reHasYield.test(tmpl)) { return tmpl }

  // be careful with #1343 - string on the source having `$1`
  var src = {};

  html = html && html.replace(reYieldSrc, function (_, ref, text) {
    src[ref] = src[ref] || text;   // preserve first definition
    return ''
  }).trim();

  return tmpl
    .replace(reYieldDest, function (_, ref, def) {  // yield with from - to attrs
      return src[ref] || def || ''
    })
    .replace(reYieldAll, function (_, def) {        // yield without any "from"
      return html || def || ''
    })
}

/**
 * Creates a DOM element to wrap the given content. Normally an `DIV`, but can be
 * also a `TABLE`, `SELECT`, `TBODY`, `TR`, or `COLGROUP` element.
 *
 * @param   { String } tmpl  - The template coming from the custom tag definition
 * @param   { String } html - HTML content that comes from the DOM element where you
 *           will mount the tag, mostly the original tag in the page
 * @param   { Boolean } isSvg - true if the root node is an svg
 * @returns { HTMLElement } DOM element with _tmpl_ merged through `YIELD` with the _html_.
 */
function mkdom(tmpl, html, isSvg$$1) {
  var match   = tmpl && tmpl.match(/^\s*<([-\w]+)/),
    tagName = match && match[1].toLowerCase(),
    el = mkEl(isSvg$$1 ? SVG : GENERIC);

  // replace all the yield tags with the tag inner html
  tmpl = replaceYield(tmpl, html);

  /* istanbul ignore next */
  if (tblTags.test(tagName))
    { el = specialTags(el, tmpl, tagName); }
  else
    { setInnerHTML(el, tmpl); }

  return el
}

/**
 * Another way to create a riot tag a bit more es6 friendly
 * @param { HTMLElement } el - tag DOM selector or DOM node/s
 * @param { Object } opts - tag logic
 * @returns { Tag } new riot tag instance
 */
function Tag$2(el, opts) {
  // get the tag properties from the class constructor
  var ref = this;
  var name = ref.name;
  var tmpl = ref.tmpl;
  var css = ref.css;
  var attrs = ref.attrs;
  var onCreate = ref.onCreate;
  // register a new tag and cache the class prototype
  if (!__TAG_IMPL[name]) {
    tag$1(name, tmpl, css, attrs, onCreate);
    // cache the class constructor
    __TAG_IMPL[name].class = this.constructor;
  }

  // mount the tag using the class instance
  mountTo(el, name, opts, this);
  // inject the component css
  if (css) { styleManager.inject(); }

  return this
}

/**
 * Create a new riot tag implementation
 * @param   { String }   name - name/id of the new riot tag
 * @param   { String }   tmpl - tag template
 * @param   { String }   css - custom tag css
 * @param   { String }   attrs - root tag attributes
 * @param   { Function } fn - user function
 * @returns { String } name/id of the tag just created
 */
function tag$1(name, tmpl, css, attrs, fn) {
  if (isFunction(attrs)) {
    fn = attrs;

    if (/^[\w\-]+\s?=/.test(css)) {
      attrs = css;
      css = '';
    } else
      { attrs = ''; }
  }

  if (css) {
    if (isFunction(css))
      { fn = css; }
    else
      { styleManager.add(css); }
  }

  name = name.toLowerCase();
  __TAG_IMPL[name] = { name: name, tmpl: tmpl, attrs: attrs, fn: fn };

  return name
}

/**
 * Create a new riot tag implementation (for use by the compiler)
 * @param   { String }   name - name/id of the new riot tag
 * @param   { String }   tmpl - tag template
 * @param   { String }   css - custom tag css
 * @param   { String }   attrs - root tag attributes
 * @param   { Function } fn - user function
 * @returns { String } name/id of the tag just created
 */
function tag2$1(name, tmpl, css, attrs, fn) {
  if (css) { styleManager.add(css, name); }

  __TAG_IMPL[name] = { name: name, tmpl: tmpl, attrs: attrs, fn: fn };

  return name
}

/**
 * Mount a tag using a specific tag implementation
 * @param   { * } selector - tag DOM selector or DOM node/s
 * @param   { String } tagName - tag implementation name
 * @param   { Object } opts - tag logic
 * @returns { Array } new tags instances
 */
function mount$2(selector, tagName, opts) {
  var tags = [];
  var elem, allTags;

  function pushTagsTo(root) {
    if (root.tagName) {
      var riotTag = getAttr(root, IS_DIRECTIVE), tag;

      // have tagName? force riot-tag to be the same
      if (tagName && riotTag !== tagName) {
        riotTag = tagName;
        setAttr(root, IS_DIRECTIVE, tagName);
      }

      tag = mountTo(root, riotTag || root.tagName.toLowerCase(), opts);

      if (tag)
        { tags.push(tag); }
    } else if (root.length)
      { each(root, pushTagsTo); } // assume nodeList
  }

  // inject styles into DOM
  styleManager.inject();

  if (isObject(tagName)) {
    opts = tagName;
    tagName = 0;
  }

  // crawl the DOM to find the tag
  if (isString(selector)) {
    selector = selector === '*' ?
      // select all registered tags
      // & tags found with the riot-tag attribute set
      allTags = selectTags() :
      // or just the ones named like the selector
      selector + selectTags(selector.split(/, */));

    // make sure to pass always a selector
    // to the querySelectorAll function
    elem = selector ? $$(selector) : [];
  }
  else
    // probably you have passed already a tag or a NodeList
    { elem = selector; }

  // select all the registered and mount them inside their root elements
  if (tagName === '*') {
    // get all custom tags
    tagName = allTags || selectTags();
    // if the root els it's just a single tag
    if (elem.tagName)
      { elem = $$(tagName, elem); }
    else {
      // select all the children for all the different root elements
      var nodeList = [];

      each(elem, function (_el) { return nodeList.push($$(tagName, _el)); });

      elem = nodeList;
    }
    // get rid of the tagName
    tagName = 0;
  }

  pushTagsTo(elem);

  return tags
}

// Create a mixin that could be globally shared across all the tags
var mixins = {};
var globals = mixins[GLOBAL_MIXIN] = {};
var mixins_id = 0;

/**
 * Create/Return a mixin by its name
 * @param   { String }  name - mixin name (global mixin if object)
 * @param   { Object }  mix - mixin logic
 * @param   { Boolean } g - is global?
 * @returns { Object }  the mixin logic
 */
function mixin$1(name, mix, g) {
  // Unnamed global
  if (isObject(name)) {
    mixin$1(("__" + (mixins_id++) + "__"), name, true);
    return
  }

  var store = g ? globals : mixins;

  // Getter
  if (!mix) {
    if (isUndefined(store[name]))
      { throw new Error(("Unregistered mixin: " + name)) }

    return store[name]
  }

  // Setter
  store[name] = isFunction(mix) ?
    extend(mix.prototype, store[name] || {}) && mix :
    extend(store[name] || {}, mix);
}

/**
 * Update all the tags instances created
 * @returns { Array } all the tags instances
 */
function update$1() {
  return each(__TAGS_CACHE, function (tag) { return tag.update(); })
}

function unregister$1(name) {
  __TAG_IMPL[name] = null;
}

var version$1 = 'v3.6.1';


var core = Object.freeze({
	Tag: Tag$2,
	tag: tag$1,
	tag2: tag2$1,
	mount: mount$2,
	mixin: mixin$1,
	update: update$1,
	unregister: unregister$1,
	version: version$1
});

// counter to give a unique id to all the Tag instances
var __uid = 0;

/**
 * We need to update opts for this tag. That requires updating the expressions
 * in any attributes on the tag, and then copying the result onto opts.
 * @this Tag
 * @param   {Boolean} isLoop - is it a loop tag?
 * @param   { Tag }  parent - parent tag node
 * @param   { Boolean }  isAnonymous - is it a tag without any impl? (a tag not registered)
 * @param   { Object }  opts - tag options
 * @param   { Array }  instAttrs - tag attributes array
 */
function updateOpts(isLoop, parent, isAnonymous, opts, instAttrs) {
  // isAnonymous `each` tags treat `dom` and `root` differently. In this case
  // (and only this case) we don't need to do updateOpts, because the regular parse
  // will update those attrs. Plus, isAnonymous tags don't need opts anyway
  if (isLoop && isAnonymous) { return }

  var ctx = !isAnonymous && isLoop ? this : parent || this;
  each(instAttrs, function (attr) {
    if (attr.expr) { updateAllExpressions.call(ctx, [attr.expr]); }
    // normalize the attribute names
    opts[toCamel(attr.name).replace(ATTRS_PREFIX, '')] = attr.expr ? attr.expr.value : attr.value;
  });
}


/**
 * Tag class
 * @constructor
 * @param { Object } impl - it contains the tag template, and logic
 * @param { Object } conf - tag options
 * @param { String } innerHTML - html that eventually we need to inject in the tag
 */
function Tag$1(impl, conf, innerHTML) {
  if ( impl === void 0 ) impl = {};
  if ( conf === void 0 ) conf = {};

  var opts = extend({}, conf.opts),
    parent = conf.parent,
    isLoop = conf.isLoop,
    isAnonymous = !!conf.isAnonymous,
    skipAnonymous = settings$1.skipAnonymousTags && isAnonymous,
    item = cleanUpData(conf.item),
    index = conf.index, // available only for the looped nodes
    instAttrs = [], // All attributes on the Tag when it's first parsed
    implAttrs = [], // expressions on this type of Tag
    expressions = [],
    root = conf.root,
    tagName = conf.tagName || getTagName(root),
    isVirtual = tagName === 'virtual',
    isInline = !isVirtual && !impl.tmpl,
    propsInSyncWithParent = [],
    dom;

  // make this tag observable
  if (!skipAnonymous) { observable$1(this); }
  // only call unmount if we have a valid __TAG_IMPL (has name property)
  if (impl.name && root._tag) { root._tag.unmount(true); }

  // not yet mounted
  this.isMounted = false;

  defineProperty(this, '__', {
    isAnonymous: isAnonymous,
    instAttrs: instAttrs,
    innerHTML: innerHTML,
    tagName: tagName,
    index: index,
    isLoop: isLoop,
    isInline: isInline,
    // tags having event listeners
    // it would be better to use weak maps here but we can not introduce breaking changes now
    listeners: [],
    // these vars will be needed only for the virtual tags
    virts: [],
    tail: null,
    head: null,
    parent: null,
    item: null
  });

  // create a unique id to this tag
  // it could be handy to use it also to improve the virtual dom rendering speed
  defineProperty(this, '_riot_id', ++__uid); // base 1 allows test !t._riot_id
  defineProperty(this, 'root', root);
  extend(this, { opts: opts }, item);
  // protect the "tags" and "refs" property from being overridden
  defineProperty(this, 'parent', parent || null);
  defineProperty(this, 'tags', {});
  defineProperty(this, 'refs', {});

  if (isInline || isLoop && isAnonymous) {
    dom = root;
  } else {
    if (!isVirtual) { root.innerHTML = ''; }
    dom = mkdom(impl.tmpl, innerHTML, isSvg(root));
  }

  /**
   * Update the tag expressions and options
   * @param   { * }  data - data we want to use to extend the tag properties
   * @returns { Tag } the current tag instance
   */
  defineProperty(this, 'update', function tagUpdate(data) {
    var nextOpts = {},
      canTrigger = this.isMounted && !skipAnonymous;

    // make sure the data passed will not override
    // the component core methods
    data = cleanUpData(data);
    extend(this, data);
    updateOpts.apply(this, [isLoop, parent, isAnonymous, nextOpts, instAttrs]);

    if (canTrigger && this.isMounted && isFunction(this.shouldUpdate) && !this.shouldUpdate(data, nextOpts)) {
      return this
    }

    // inherit properties from the parent, but only for isAnonymous tags
    if (isLoop && isAnonymous) { inheritFrom.apply(this, [this.parent, propsInSyncWithParent]); }
    extend(opts, nextOpts);
    if (canTrigger) { this.trigger('update', data); }
    updateAllExpressions.call(this, expressions);
    if (canTrigger) { this.trigger('updated'); }

    return this

  }.bind(this));

  /**
   * Add a mixin to this tag
   * @returns { Tag } the current tag instance
   */
  defineProperty(this, 'mixin', function tagMixin() {
    var this$1 = this;

    each(arguments, function (mix) {
      var instance, obj;
      var props = [];

      // properties blacklisted and will not be bound to the tag instance
      var propsBlacklist = ['init', '__proto__'];

      mix = isString(mix) ? mixin$1(mix) : mix;

      // check if the mixin is a function
      if (isFunction(mix)) {
        // create the new mixin instance
        instance = new mix();
      } else { instance = mix; }

      var proto = Object.getPrototypeOf(instance);

      // build multilevel prototype inheritance chain property list
      do { props = props.concat(Object.getOwnPropertyNames(obj || instance)); }
      while (obj = Object.getPrototypeOf(obj || instance))

      // loop the keys in the function prototype or the all object keys
      each(props, function (key) {
        // bind methods to this
        // allow mixins to override other properties/parent mixins
        if (!contains(propsBlacklist, key)) {
          // check for getters/setters
          var descriptor = Object.getOwnPropertyDescriptor(instance, key) || Object.getOwnPropertyDescriptor(proto, key);
          var hasGetterSetter = descriptor && (descriptor.get || descriptor.set);

          // apply method only if it does not already exist on the instance
          if (!this$1.hasOwnProperty(key) && hasGetterSetter) {
            Object.defineProperty(this$1, key, descriptor);
          } else {
            this$1[key] = isFunction(instance[key]) ?
              instance[key].bind(this$1) :
              instance[key];
          }
        }
      });

      // init method will be called automatically
      if (instance.init)
        { instance.init.bind(this$1)(); }
    });
    return this
  }.bind(this));

  /**
   * Mount the current tag instance
   * @returns { Tag } the current tag instance
   */
  defineProperty(this, 'mount', function tagMount() {
    var this$1 = this;

    root._tag = this; // keep a reference to the tag just created

    // Read all the attrs on this instance. This give us the info we need for updateOpts
    parseAttributes.apply(parent, [root, root.attributes, function (attr, expr) {
      if (!isAnonymous && RefExpr.isPrototypeOf(expr)) { expr.tag = this$1; }
      attr.expr = expr;
      instAttrs.push(attr);
    }]);

    // update the root adding custom attributes coming from the compiler
    implAttrs = [];
    walkAttrs(impl.attrs, function (k, v) { implAttrs.push({name: k, value: v}); });
    parseAttributes.apply(this, [root, implAttrs, function (attr, expr) {
      if (expr) { expressions.push(expr); }
      else { setAttr(root, attr.name, attr.value); }
    }]);

    // initialiation
    updateOpts.apply(this, [isLoop, parent, isAnonymous, opts, instAttrs]);

    // add global mixins
    var globalMixin = mixin$1(GLOBAL_MIXIN);

    if (globalMixin && !skipAnonymous) {
      for (var i in globalMixin) {
        if (globalMixin.hasOwnProperty(i)) {
          this$1.mixin(globalMixin[i]);
        }
      }
    }

    if (impl.fn) { impl.fn.call(this, opts); }

    if (!skipAnonymous) { this.trigger('before-mount'); }

    // parse layout after init. fn may calculate args for nested custom tags
    parseExpressions.apply(this, [dom, expressions, isAnonymous]);

    this.update(item);

    if (!isAnonymous && !isInline) {
      while (dom.firstChild) { root.appendChild(dom.firstChild); }
    }

    defineProperty(this, 'root', root);
    defineProperty(this, 'isMounted', true);

    if (skipAnonymous) { return }

    // if it's not a child tag we can trigger its mount event
    if (!this.parent) {
      this.trigger('mount');
    }
    // otherwise we need to wait that the parent "mount" or "updated" event gets triggered
    else {
      var p = getImmediateCustomParentTag(this.parent);
      p.one(!p.isMounted ? 'mount' : 'updated', function () {
        this$1.trigger('mount');
      });
    }

    return this

  }.bind(this));

  /**
   * Unmount the tag instance
   * @param { Boolean } mustKeepRoot - if it's true the root node will not be removed
   * @returns { Tag } the current tag instance
   */
  defineProperty(this, 'unmount', function tagUnmount(mustKeepRoot) {
    var this$1 = this;

    var el = this.root,
      p = el.parentNode,
      ptag,
      tagIndex = __TAGS_CACHE.indexOf(this);

    if (!skipAnonymous) { this.trigger('before-unmount'); }

    // clear all attributes coming from the mounted tag
    walkAttrs(impl.attrs, function (name) {
      if (startsWith(name, ATTRS_PREFIX))
        { name = name.slice(ATTRS_PREFIX.length); }

      remAttr(root, name);
    });

    // remove all the event listeners
    this.__.listeners.forEach(function (dom) {
      Object.keys(dom[RIOT_EVENTS_KEY]).forEach(function (eventName) {
        dom.removeEventListener(eventName, dom[RIOT_EVENTS_KEY][eventName]);
      });
    });

    // remove this tag instance from the global virtualDom variable
    if (tagIndex !== -1)
      { __TAGS_CACHE.splice(tagIndex, 1); }

    if (p || isVirtual) {
      if (parent) {
        ptag = getImmediateCustomParentTag(parent);

        if (isVirtual) {
          Object.keys(this.tags).forEach(function (tagName) {
            arrayishRemove(ptag.tags, tagName, this$1.tags[tagName]);
          });
        } else {
          arrayishRemove(ptag.tags, tagName, this);
          // remove from _parent too
          if(parent !== ptag) {
            arrayishRemove(parent.tags, tagName, this);
          }
        }
      } else {
        // remove the tag contents
        setInnerHTML(el, '');
      }

      if (p && !mustKeepRoot) { p.removeChild(el); }
    }

    if (this.__.virts) {
      each(this.__.virts, function (v) {
        if (v.parentNode) { v.parentNode.removeChild(v); }
      });
    }

    // allow expressions to unmount themselves
    unmountAll(expressions);
    each(instAttrs, function (a) { return a.expr && a.expr.unmount && a.expr.unmount(); });

    // custom internal unmount function to avoid relying on the observable
    if (this.__.onUnmount) { this.__.onUnmount(); }

    if (!skipAnonymous) {
      this.trigger('unmount');
      this.off('*');
    }

    defineProperty(this, 'isMounted', false);

    delete this.root._tag;

    return this

  }.bind(this));
}

/**
 * Detect the tag implementation by a DOM node
 * @param   { Object } dom - DOM node we need to parse to get its tag implementation
 * @returns { Object } it returns an object containing the implementation of a custom tag (template and boot function)
 */
function getTag(dom) {
  return dom.tagName && __TAG_IMPL[getAttr(dom, IS_DIRECTIVE) ||
    getAttr(dom, IS_DIRECTIVE) || dom.tagName.toLowerCase()]
}

/**
 * Inherit properties from a target tag instance
 * @this Tag
 * @param   { Tag } target - tag where we will inherit properties
 * @param   { Array } propsInSyncWithParent - array of properties to sync with the target
 */
function inheritFrom(target, propsInSyncWithParent) {
  var this$1 = this;

  each(Object.keys(target), function (k) {
    // some properties must be always in sync with the parent tag
    var mustSync = !isReservedName(k) && contains(propsInSyncWithParent, k);

    if (isUndefined(this$1[k]) || mustSync) {
      // track the property to keep in sync
      // so we can keep it updated
      if (!mustSync) { propsInSyncWithParent.push(k); }
      this$1[k] = target[k];
    }
  });
}

/**
 * Move the position of a custom tag in its parent tag
 * @this Tag
 * @param   { String } tagName - key where the tag was stored
 * @param   { Number } newPos - index where the new tag will be stored
 */
function moveChildTag(tagName, newPos) {
  var parent = this.parent,
    tags;
  // no parent no move
  if (!parent) { return }

  tags = parent.tags[tagName];

  if (isArray(tags))
    { tags.splice(newPos, 0, tags.splice(tags.indexOf(this), 1)[0]); }
  else { arrayishAdd(parent.tags, tagName, this); }
}

/**
 * Create a new child tag including it correctly into its parent
 * @param   { Object } child - child tag implementation
 * @param   { Object } opts - tag options containing the DOM node where the tag will be mounted
 * @param   { String } innerHTML - inner html of the child node
 * @param   { Object } parent - instance of the parent tag including the child custom tag
 * @returns { Object } instance of the new child tag just created
 */
function initChildTag(child, opts, innerHTML, parent) {
  var tag = new Tag$1(child, opts, innerHTML),
    tagName = opts.tagName || getTagName(opts.root, true),
    ptag = getImmediateCustomParentTag(parent);
  // fix for the parent attribute in the looped elements
  defineProperty(tag, 'parent', ptag);
  // store the real parent tag
  // in some cases this could be different from the custom parent tag
  // for example in nested loops
  tag.__.parent = parent;

  // add this tag to the custom parent tag
  arrayishAdd(ptag.tags, tagName, tag);

  // and also to the real parent tag
  if (ptag !== parent)
    { arrayishAdd(parent.tags, tagName, tag); }

  return tag
}

/**
 * Loop backward all the parents tree to detect the first custom parent tag
 * @param   { Object } tag - a Tag instance
 * @returns { Object } the instance of the first custom parent tag found
 */
function getImmediateCustomParentTag(tag) {
  var ptag = tag;
  while (ptag.__.isAnonymous) {
    if (!ptag.parent) { break }
    ptag = ptag.parent;
  }
  return ptag
}

/**
 * Trigger the unmount method on all the expressions
 * @param   { Array } expressions - DOM expressions
 */
function unmountAll(expressions) {
  each(expressions, function(expr) {
    if (expr instanceof Tag$1) { expr.unmount(true); }
    else if (expr.tagName) { expr.tag.unmount(true); }
    else if (expr.unmount) { expr.unmount(); }
  });
}

/**
 * Get the tag name of any DOM node
 * @param   { Object } dom - DOM node we want to parse
 * @param   { Boolean } skipDataIs - hack to ignore the data-is attribute when attaching to parent
 * @returns { String } name to identify this dom node in riot
 */
function getTagName(dom, skipDataIs) {
  var child = getTag(dom),
    namedTag = !skipDataIs && getAttr(dom, IS_DIRECTIVE);
  return namedTag && !tmpl.hasExpr(namedTag) ?
                namedTag :
              child ? child.name : dom.tagName.toLowerCase()
}

/**
 * With this function we avoid that the internal Tag methods get overridden
 * @param   { Object } data - options we want to use to extend the tag instance
 * @returns { Object } clean object without containing the riot internal reserved words
 */
function cleanUpData(data) {
  if (!(data instanceof Tag$1) && !(data && isFunction(data.trigger)))
    { return data }

  var o = {};
  for (var key in data) {
    if (!RE_RESERVED_NAMES.test(key)) { o[key] = data[key]; }
  }
  return o
}

/**
 * Set the property of an object for a given key. If something already
 * exists there, then it becomes an array containing both the old and new value.
 * @param { Object } obj - object on which to set the property
 * @param { String } key - property name
 * @param { Object } value - the value of the property to be set
 * @param { Boolean } ensureArray - ensure that the property remains an array
 * @param { Number } index - add the new item in a certain array position
 */
function arrayishAdd(obj, key, value, ensureArray, index) {
  var dest = obj[key];
  var isArr = isArray(dest);
  var hasIndex = !isUndefined(index);

  if (dest && dest === value) { return }

  // if the key was never set, set it once
  if (!dest && ensureArray) { obj[key] = [value]; }
  else if (!dest) { obj[key] = value; }
  // if it was an array and not yet set
  else {
    if (isArr) {
      var oldIndex = dest.indexOf(value);
      // this item never changed its position
      if (oldIndex === index) { return }
      // remove the item from its old position
      if (oldIndex !== -1) { dest.splice(oldIndex, 1); }
      // move or add the item
      if (hasIndex) {
        dest.splice(index, 0, value);
      } else {
        dest.push(value);
      }
    } else { obj[key] = [dest, value]; }
  }
}

/**
 * Removes an item from an object at a given key. If the key points to an array,
 * then the item is just removed from the array.
 * @param { Object } obj - object on which to remove the property
 * @param { String } key - property name
 * @param { Object } value - the value of the property to be removed
 * @param { Boolean } ensureArray - ensure that the property remains an array
*/
function arrayishRemove(obj, key, value, ensureArray) {
  if (isArray(obj[key])) {
    var index = obj[key].indexOf(value);
    if (index !== -1) { obj[key].splice(index, 1); }
    if (!obj[key].length) { delete obj[key]; }
    else if (obj[key].length === 1 && !ensureArray) { obj[key] = obj[key][0]; }
  } else
    { delete obj[key]; } // otherwise just delete the key
}

/**
 * Mount a tag creating new Tag instance
 * @param   { Object } root - dom node where the tag will be mounted
 * @param   { String } tagName - name of the riot tag we want to mount
 * @param   { Object } opts - options to pass to the Tag instance
 * @param   { Object } ctx - optional context that will be used to extend an existing class ( used in riot.Tag )
 * @returns { Tag } a new Tag instance
 */
function mountTo(root, tagName, opts, ctx) {
  var impl = __TAG_IMPL[tagName],
    implClass = __TAG_IMPL[tagName].class,
    tag = ctx || (implClass ? Object.create(implClass.prototype) : {}),
    // cache the inner HTML to fix #855
    innerHTML = root._innerHTML = root._innerHTML || root.innerHTML;

  var conf = extend({ root: root, opts: opts }, { parent: opts ? opts.parent : null });

  if (impl && root) { Tag$1.apply(tag, [impl, conf, innerHTML]); }

  if (tag && tag.mount) {
    tag.mount(true);
    // add this tag to the virtualDom variable
    if (!contains(__TAGS_CACHE, tag)) { __TAGS_CACHE.push(tag); }
  }

  return tag
}

/**
 * makes a tag virtual and replaces a reference in the dom
 * @this Tag
 * @param { tag } the tag to make virtual
 * @param { ref } the dom reference location
 */
function makeReplaceVirtual(tag, ref) {
  var frag = createFrag();
  makeVirtual.call(tag, frag);
  ref.parentNode.replaceChild(frag, ref);
}

/**
 * Adds the elements for a virtual tag
 * @this Tag
 * @param { Node } src - the node that will do the inserting or appending
 * @param { Tag } target - only if inserting, insert before this tag's first child
 */
function makeVirtual(src, target) {
  var this$1 = this;

  var head = createDOMPlaceholder(),
    tail = createDOMPlaceholder(),
    frag = createFrag(),
    sib, el;

  this.root.insertBefore(head, this.root.firstChild);
  this.root.appendChild(tail);

  this.__.head = el = head;
  this.__.tail = tail;

  while (el) {
    sib = el.nextSibling;
    frag.appendChild(el);
    this$1.__.virts.push(el); // hold for unmounting
    el = sib;
  }

  if (target)
    { src.insertBefore(frag, target.__.head); }
  else
    { src.appendChild(frag); }
}

/**
 * Move virtual tag and all child nodes
 * @this Tag
 * @param { Node } src  - the node that will do the inserting
 * @param { Tag } target - insert before this tag's first child
 */
function moveVirtual(src, target) {
  var this$1 = this;

  var el = this.__.head,
    frag = createFrag(),
    sib;

  while (el) {
    sib = el.nextSibling;
    frag.appendChild(el);
    el = sib;
    if (el === this$1.__.tail) {
      frag.appendChild(el);
      src.insertBefore(frag, target.__.head);
      break
    }
  }
}

/**
 * Get selectors for tags
 * @param   { Array } tags - tag names to select
 * @returns { String } selector
 */
function selectTags(tags) {
  // select all tags
  if (!tags) {
    var keys = Object.keys(__TAG_IMPL);
    return keys + selectTags(keys)
  }

  return tags
    .filter(function (t) { return !/[^-\w]/.test(t); })
    .reduce(function (list, t) {
      var name = t.trim().toLowerCase();
      return list + ",[" + IS_DIRECTIVE + "=\"" + name + "\"]"
    }, '')
}


var tags = Object.freeze({
	getTag: getTag,
	inheritFrom: inheritFrom,
	moveChildTag: moveChildTag,
	initChildTag: initChildTag,
	getImmediateCustomParentTag: getImmediateCustomParentTag,
	unmountAll: unmountAll,
	getTagName: getTagName,
	cleanUpData: cleanUpData,
	arrayishAdd: arrayishAdd,
	arrayishRemove: arrayishRemove,
	mountTo: mountTo,
	makeReplaceVirtual: makeReplaceVirtual,
	makeVirtual: makeVirtual,
	moveVirtual: moveVirtual,
	selectTags: selectTags
});

/**
 * Riot public api
 */
var settings = settings$1;
var util = {
  tmpl: tmpl,
  brackets: brackets,
  styleManager: styleManager,
  vdom: __TAGS_CACHE,
  styleNode: styleManager.styleNode,
  // export the riot internal utils as well
  dom: dom,
  check: check,
  misc: misc,
  tags: tags
};

// export the core props/methods
var Tag$$1 = Tag$2;
var tag$$1 = tag$1;
var tag2$$1 = tag2$1;
var mount$1 = mount$2;
var mixin$$1 = mixin$1;
var update$$1 = update$1;
var unregister$$1 = unregister$1;
var version$$1 = version$1;
var observable = observable$1;

var riot$1 = extend({}, core, {
  observable: observable$1,
  settings: settings,
  util: util,
});


var riot$2 = Object.freeze({
	settings: settings,
	util: util,
	Tag: Tag$$1,
	tag: tag$$1,
	tag2: tag2$$1,
	mount: mount$1,
	mixin: mixin$$1,
	update: update$$1,
	unregister: unregister$$1,
	version: version$$1,
	observable: observable,
	default: riot$1
});

/**
 * Compiler for riot custom tags
 * @version v3.2.3
 */

// istanbul ignore next
function safeRegex (re) {
  var arguments$1 = arguments;

  var src = re.source;
  var opt = re.global ? 'g' : '';

  if (re.ignoreCase) { opt += 'i'; }
  if (re.multiline)  { opt += 'm'; }

  for (var i = 1; i < arguments.length; i++) {
    src = src.replace('@', '\\' + arguments$1[i]);
  }

  return new RegExp(src, opt)
}

/**
 * @module parsers
 */
var parsers$1 = (function (win) {

  var _p = {};

  function _r (name) {
    var parser = win[name];

    if (parser) { return parser }

    throw new Error('Parser "' + name + '" not loaded.')
  }

  function _req (name) {
    var parts = name.split('.');

    if (parts.length !== 2) { throw new Error('Bad format for parsers._req') }

    var parser = _p[parts[0]][parts[1]];
    if (parser) { return parser }

    throw new Error('Parser "' + name + '" not found.')
  }

  function extend (obj, props) {
    if (props) {
      for (var prop in props) {
        /* istanbul ignore next */
        if (props.hasOwnProperty(prop)) {
          obj[prop] = props[prop];
        }
      }
    }
    return obj
  }

  function renderPug (compilerName, html, opts, url) {
    opts = extend({
      pretty: true,
      filename: url,
      doctype: 'html'
    }, opts);
    return _r(compilerName).render(html, opts)
  }

  _p.html = {
    jade: function (html, opts, url) {
      /* eslint-disable */
      console.log('DEPRECATION WARNING: jade was renamed "pug" - The jade parser will be removed in riot@3.0.0!');
      /* eslint-enable */
      return renderPug('jade', html, opts, url)
    },
    pug: function (html, opts, url) {
      return renderPug('pug', html, opts, url)
    }
  };
  _p.css = {
    less: function (tag, css, opts, url) {
      var ret;

      opts = extend({
        sync: true,
        syncImport: true,
        filename: url
      }, opts);
      _r('less').render(css, opts, function (err, result) {
        // istanbul ignore next
        if (err) { throw err }
        ret = result.css;
      });
      return ret
    }
  };
  _p.js = {

    es6: function (js, opts, url) {
      return _r('Babel').transform( // eslint-disable-line
        js,
        extend({
          plugins: [
            ['transform-es2015-template-literals', { loose: true }],
            'transform-es2015-literals',
            'transform-es2015-function-name',
            'transform-es2015-arrow-functions',
            'transform-es2015-block-scoped-functions',
            ['transform-es2015-classes', { loose: true }],
            'transform-es2015-object-super',
            'transform-es2015-shorthand-properties',
            'transform-es2015-duplicate-keys',
            ['transform-es2015-computed-properties', { loose: true }],
            ['transform-es2015-for-of', { loose: true }],
            'transform-es2015-sticky-regex',
            'transform-es2015-unicode-regex',
            'check-es2015-constants',
            ['transform-es2015-spread', { loose: true }],
            'transform-es2015-parameters',
            ['transform-es2015-destructuring', { loose: true }],
            'transform-es2015-block-scoping',
            'transform-es2015-typeof-symbol',
            ['transform-es2015-modules-commonjs', { allowTopLevelThis: true }],
            ['transform-regenerator', { async: false, asyncGenerators: false }]
          ]
        },
        opts
      )).code
    },
    buble: function (js, opts, url) {
      opts = extend({
        source: url,
        modules: false
      }, opts);
      return _r('buble').transform(js, opts).code
    },
    coffee: function (js, opts) {
      return _r('CoffeeScript').compile(js, extend({ bare: true }, opts))
    },
    livescript: function (js, opts) {
      return _r('livescript').compile(js, extend({ bare: true, header: false }, opts))
    },
    typescript: function (js, opts) {
      return _r('typescript')(js, opts)
    },
    none: function (js) {
      return js
    }
  };
  _p.js.javascript   = _p.js.none;
  _p.js.coffeescript = _p.js.coffee;
  _p._req  = _req;
  _p.utils = {
    extend: extend
  };

  return _p

})(window || commonjsGlobal);

/**
 * @module compiler
 */

var extend$1 = parsers$1.utils.extend;
/* eslint-enable */

var S_LINESTR = /"[^"\n\\]*(?:\\[\S\s][^"\n\\]*)*"|'[^'\n\\]*(?:\\[\S\s][^'\n\\]*)*'/.source;

var S_STRINGS = brackets.R_STRINGS.source;

var HTML_ATTRS = / *([-\w:\xA0-\xFF]+) ?(?:= ?('[^']*'|"[^"]*"|\S+))?/g;

var HTML_COMMS = RegExp(/<!--(?!>)[\S\s]*?-->/.source + '|' + S_LINESTR, 'g');

var HTML_TAGS = /<(-?[A-Za-z][-\w\xA0-\xFF]*)(?:\s+([^"'\/>]*(?:(?:"[^"]*"|'[^']*'|\/[^>])[^'"\/>]*)*)|\s*)(\/?)>/g;

var HTML_PACK = />[ \t]+<(-?[A-Za-z]|\/[-A-Za-z])/g;

var RIOT_ATTRS = ['style', 'src', 'd', 'value'];

var VOID_TAGS = /^(?:input|img|br|wbr|hr|area|base|col|embed|keygen|link|meta|param|source|track)$/;

var PRE_TAGS = /<pre(?:\s+(?:[^">]*|"[^"]*")*)?>([\S\s]+?)<\/pre\s*>/gi;

var SPEC_TYPES = /^"(?:number|date(?:time)?|time|month|email|color)\b/i;

var IMPORT_STATEMENT = /^\s*import(?!\w)(?:(?:\s|[^\s'"])*)['|"].*\n?/gm;

var TRIM_TRAIL = /[ \t]+$/gm;

var RE_HASEXPR = safeRegex(/@#\d/, 'x01');
var RE_REPEXPR = safeRegex(/@#(\d+)/g, 'x01');
var CH_IDEXPR  = '\x01#';
var CH_DQCODE  = '\u2057';
var DQ = '"';
var SQ = "'";

function cleanSource (src) {
  var
    mm,
    re = HTML_COMMS;

  if (~src.indexOf('\r')) {
    src = src.replace(/\r\n?/g, '\n');
  }

  re.lastIndex = 0;
  while ((mm = re.exec(src))) {
    if (mm[0][0] === '<') {
      src = RegExp.leftContext + RegExp.rightContext;
      re.lastIndex = mm[3] + 1;
    }
  }
  return src
}

function parseAttribs (str, pcex) {
  var
    list = [],
    match,
    type, vexp;

  HTML_ATTRS.lastIndex = 0;

  str = str.replace(/\s+/g, ' ');

  while ((match = HTML_ATTRS.exec(str))) {
    var
      k = match[1].toLowerCase(),
      v = match[2];

    if (!v) {
      list.push(k);
    } else {

      if (v[0] !== DQ) {
        v = DQ + (v[0] === SQ ? v.slice(1, -1) : v) + DQ;
      }

      if (k === 'type' && SPEC_TYPES.test(v)) {
        type = v;
      } else {
        if (RE_HASEXPR.test(v)) {

          if (k === 'value') { vexp = 1; }
          if (~RIOT_ATTRS.indexOf(k)) { k = 'riot-' + k; }
        }

        list.push(k + '=' + v);
      }
    }
  }

  if (type) {
    if (vexp) { type = DQ + pcex._bp[0] + SQ + type.slice(1, -1) + SQ + pcex._bp[1] + DQ; }
    list.push('type=' + type);
  }
  return list.join(' ')
}

function splitHtml (html, opts, pcex) {
  var _bp = pcex._bp;

  if (html && _bp[4].test(html)) {
    var
      jsfn = opts.expr && (opts.parser || opts.type) ? _compileJS : 0,
      list = brackets.split(html, 0, _bp),
      expr;

    for (var i = 1; i < list.length; i += 2) {
      expr = list[i];
      if (expr[0] === '^') {
        expr = expr.slice(1);
      } else if (jsfn) {
        expr = jsfn(expr, opts).trim();
        if (expr.slice(-1) === ';') { expr = expr.slice(0, -1); }
      }
      list[i] = CH_IDEXPR + (pcex.push(expr) - 1) + _bp[1];
    }
    html = list.join('');
  }
  return html
}

function restoreExpr (html, pcex) {
  if (pcex.length) {
    html = html.replace(RE_REPEXPR, function (_, d) {

      return pcex._bp[0] + pcex[d].trim().replace(/[\r\n]+/g, ' ').replace(/"/g, CH_DQCODE)
    });
  }
  return html
}

function _compileHTML (html, opts, pcex) {
  if (!/\S/.test(html)) { return '' }

  html = splitHtml(html, opts, pcex)
    .replace(HTML_TAGS, function (_, name, attr, ends) {

      name = name.toLowerCase();

      ends = ends && !VOID_TAGS.test(name) ? '></' + name : '';

      if (attr) { name += ' ' + parseAttribs(attr, pcex); }

      return '<' + name + ends + '>'
    });

  if (!opts.whitespace) {
    var p = [];

    if (/<pre[\s>]/.test(html)) {
      html = html.replace(PRE_TAGS, function (q) {
        p.push(q);
        return '\u0002'
      });
    }

    html = html.trim().replace(/\s+/g, ' ');

    if (p.length) { html = html.replace(/\u0002/g, function () { return p.shift() }); }
  }

  if (opts.compact) { html = html.replace(HTML_PACK, '><$1'); }

  return restoreExpr(html, pcex).replace(TRIM_TRAIL, '')
}

function compileHTML (html, opts, pcex) {

  if (Array.isArray(opts)) {
    pcex = opts;
    opts = {};
  } else {
    if (!pcex) { pcex = []; }
    if (!opts) { opts = {}; }
  }

  pcex._bp = brackets.array(opts.brackets);

  return _compileHTML(cleanSource(html), opts, pcex)
}

var JS_ES6SIGN = /^[ \t]*(((?:async|\*)\s*)?([$_A-Za-z][$\w]*))\s*\([^()]*\)\s*{/m;

var JS_ES6END = RegExp('[{}]|' + brackets.S_QBLOCKS, 'g');

var JS_COMMS = RegExp(brackets.R_MLCOMMS.source + '|//[^\r\n]*|' + brackets.S_QBLOCK2, 'g');

function riotjs (js) {
  var
    parts = [],
    match,
    toes5,
    pos,
    method,
    prefix,
    name,
    RE = RegExp;

  if (~js.indexOf('/')) { js = rmComms(js, JS_COMMS); }

  while ((match = js.match(JS_ES6SIGN))) {

    parts.push(RE.leftContext);
    js  = RE.rightContext;
    pos = skipBody(js, JS_ES6END);

    method = match[1];
    prefix = match[2] || '';
    name  = match[3];

    toes5 = !/^(?:if|while|for|switch|catch|function)$/.test(name);

    if (toes5) {
      name = match[0].replace(method, 'this.' + name + ' =' + prefix + ' function');
    } else {
      name = match[0];
    }

    parts.push(name, js.slice(0, pos));
    js = js.slice(pos);

    if (toes5 && !/^\s*.\s*bind\b/.test(js)) { parts.push('.bind(this)'); }
  }

  return parts.length ? parts.join('') + js : js

  function rmComms (s, r, m) {
    r.lastIndex = 0;
    while ((m = r.exec(s))) {
      if (m[1]) {
        r.lastIndex = brackets.skipRegex(s, m.index);
      } else if (m[0][0] === '/') {
        s = s.slice(0, m.index) + ' ' + s.slice(r.lastIndex);
        r.lastIndex = m.index + 1;
      }
    }
    return s
  }

  function skipBody (s, r) {
    var m, i = 1;

    r.lastIndex = 0;
    while (i && (m = r.exec(s))) {
      if (m[0] === '{') { ++i; }
      else if (m[0] === '}') { --i; }
    }
    return i ? s.length : r.lastIndex
  }
}

function _compileJS (js, opts, type, parserOpts, url) {
  if (!/\S/.test(js)) { return '' }
  if (!type) { type = opts.type; }

  var parser = opts.parser || type && parsers$1._req('js.' + type, true) || riotjs;

  return parser(js, parserOpts, url).replace(/\r\n?/g, '\n').replace(TRIM_TRAIL, '')
}

function compileJS (js, opts, type, userOpts) {
  if (typeof opts === 'string') {
    userOpts = type;
    type = opts;
    opts = {};
  }
  if (type && typeof type === 'object') {
    userOpts = type;
    type = '';
  }
  if (!userOpts) { userOpts = {}; }

  return _compileJS(js, opts || {}, type, userOpts.parserOptions, userOpts.url)
}

var CSS_SELECTOR = RegExp('([{}]|^)[; ]*((?:[^@ ;{}][^{}]*)?[^@ ;{}:] ?)(?={)|' + S_LINESTR, 'g');

function scopedCSS (tag, css) {
  var scope = ':scope';

  return css.replace(CSS_SELECTOR, function (m, p1, p2) {

    if (!p2) { return m }

    p2 = p2.replace(/[^,]+/g, function (sel) {
      var s = sel.trim();

      if (s.indexOf(tag) === 0) {
        return sel
      }

      if (!s || s === 'from' || s === 'to' || s.slice(-1) === '%') {
        return sel
      }

      if (s.indexOf(scope) < 0) {
        s = tag + ' ' + s + ',[data-is="' + tag + '"] ' + s;
      } else {
        s = s.replace(scope, tag) + ',' +
            s.replace(scope, '[data-is="' + tag + '"]');
      }
      return s
    });

    return p1 ? p1 + ' ' + p2 : p2
  })
}

function _compileCSS (css, tag, type, opts) {
  opts = opts || {};

  if (type) {
    if (type !== 'css') {

      var parser = parsers$1._req('css.' + type, true);
      css = parser(tag, css, opts.parserOpts || {}, opts.url);
    }
  }

  css = css.replace(brackets.R_MLCOMMS, '').replace(/\s+/g, ' ').trim();
  if (tag) { css = scopedCSS(tag, css); }

  return css
}

function compileCSS (css, type, opts) {
  if (type && typeof type === 'object') {
    opts = type;
    type = '';
  } else if (!opts) { opts = {}; }

  return _compileCSS(css, opts.tagName, type, opts)
}

var TYPE_ATTR = /\stype\s*=\s*(?:(['"])(.+?)\1|(\S+))/i;

var MISC_ATTR = '\\s*=\\s*(' + S_STRINGS + '|{[^}]+}|\\S+)';

var END_TAGS = /\/>\n|^<(?:\/?-?[A-Za-z][-\w\xA0-\xFF]*\s*|-?[A-Za-z][-\w\xA0-\xFF]*\s+[-\w:\xA0-\xFF][\S\s]*?)>\n/;

function _q (s, r) {
  if (!s) { return "''" }
  s = SQ + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + SQ;
  return r && ~s.indexOf('\n') ? s.replace(/\n/g, '\\n') : s
}

function mktag (name, html, css, attr, js, imports, opts) {
  var
    c = opts.debug ? ',\n  ' : ', ',
    s = '});';

  if (js && js.slice(-1) !== '\n') { s = '\n' + s; }

  return imports + 'riot.tag2(\'' + name + SQ +
    c + _q(html, 1) +
    c + _q(css) +
    c + _q(attr) + ', function(opts) {\n' + js + s
}

function splitBlocks (str) {
  if (/<[-\w]/.test(str)) {
    var
      m,
      k = str.lastIndexOf('<'),
      n = str.length;

    while (~k) {
      m = str.slice(k, n).match(END_TAGS);
      if (m) {
        k += m.index + m[0].length;
        m = str.slice(0, k);
        if (m.slice(-5) === '<-/>\n') { m = m.slice(0, -5); }
        return [m, str.slice(k)]
      }
      n = k;
      k = str.lastIndexOf('<', k - 1);
    }
  }
  return ['', str]
}

function getType (attribs) {
  if (attribs) {
    var match = attribs.match(TYPE_ATTR);

    match = match && (match[2] || match[3]);
    if (match) {
      return match.replace('text/', '')
    }
  }
  return ''
}

function getAttrib (attribs, name) {
  if (attribs) {
    var match = attribs.match(RegExp('\\s' + name + MISC_ATTR, 'i'));

    match = match && match[1];
    if (match) {
      return (/^['"]/).test(match) ? match.slice(1, -1) : match
    }
  }
  return ''
}

function unescapeHTML (str) {
  return str
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#039;/g, '\'')
}

function getParserOptions (attribs) {
  var opts = unescapeHTML(getAttrib(attribs, 'options'));

  return opts ? JSON.parse(opts) : null
}

function getCode (code, opts, attribs, base) {
  var
    type = getType(attribs),
    src  = getAttrib(attribs, 'src'),
    jsParserOptions = extend$1({}, opts.parserOptions.js);

  if (src) { return false }

  return _compileJS(
          code,
          opts,
          type,
          extend$1(jsParserOptions, getParserOptions(attribs)),
          base
        )
}

function cssCode (code, opts, attribs, url, tag) {
  var
    parserStyleOptions = extend$1({}, opts.parserOptions.style),
    extraOpts = {
      parserOpts: extend$1(parserStyleOptions, getParserOptions(attribs)),
      url: url
    };

  return _compileCSS(code, tag, getType(attribs) || opts.style, extraOpts)
}

function compileTemplate (html, url, lang, opts) {

  var parser = parsers$1._req('html.' + lang, true);
  return parser(html, opts, url)
}

var CUST_TAG = RegExp(/^([ \t]*)<(-?[A-Za-z][-\w\xA0-\xFF]*)(?:\s+([^'"\/>]+(?:(?:@|\/[^>])[^'"\/>]*)*)|\s*)?(?:\/>|>[ \t]*\n?([\S\s]*)^\1<\/\2\s*>|>(.*)<\/\2\s*>)/
    .source.replace('@', S_STRINGS), 'gim');
var SCRIPTS = /<script(\s+[^>]*)?>\n?([\S\s]*?)<\/script\s*>/gi;
var STYLES = /<style(\s+[^>]*)?>\n?([\S\s]*?)<\/style\s*>/gi;

function compile$1 (src, opts, url) {
  var
    parts = [],
    included,
    defaultParserptions = {

      template: {},
      js: {},
      style: {}
    };

  if (!opts) { opts = {}; }

  opts.parserOptions = extend$1(defaultParserptions, opts.parserOptions || {});

  included = opts.exclude
    ? function (s) { return opts.exclude.indexOf(s) < 0 } : function () { return 1 };

  if (!url) { url = ''; }

  var _bp = brackets.array(opts.brackets);

  if (opts.template) {
    src = compileTemplate(src, url, opts.template, opts.parserOptions.template);
  }

  src = cleanSource(src)
    .replace(CUST_TAG, function (_, indent, tagName, attribs, body, body2) {
      var
        jscode = '',
        styles = '',
        html = '',
        imports = '',
        pcex = [];

      pcex._bp = _bp;

      tagName = tagName.toLowerCase();

      attribs = attribs && included('attribs')
        ? restoreExpr(
            parseAttribs(
              splitHtml(attribs, opts, pcex),
            pcex),
          pcex) : '';

      if ((body || (body = body2)) && /\S/.test(body)) {

        if (body2) {

          if (included('html')) { html = _compileHTML(body2, opts, pcex); }
        } else {

          body = body.replace(RegExp('^' + indent, 'gm'), '');

          body = body.replace(SCRIPTS, function (_m, _attrs, _script) {
            if (included('js')) {
              var code = getCode(_script, opts, _attrs, url);

              if (code) { jscode += (jscode ? '\n' : '') + code; }
            }
            return ''
          });

          body = body.replace(STYLES, function (_m, _attrs, _style) {
            if (included('css')) {
              styles += (styles ? ' ' : '') + cssCode(_style, opts, _attrs, url, tagName);
            }
            return ''
          });

          var blocks = splitBlocks(body.replace(TRIM_TRAIL, ''));

          if (included('html')) {
            html = _compileHTML(blocks[0], opts, pcex);
          }

          if (included('js')) {
            body = _compileJS(blocks[1], opts, null, null, url);
            if (body) { jscode += (jscode ? '\n' : '') + body; }
            jscode = jscode.replace(IMPORT_STATEMENT, function (s) {
              imports += s.trim() + '\n';
              return ''
            });
          }
        }
      }

      jscode = /\S/.test(jscode) ? jscode.replace(/\n{3,}/g, '\n\n') : '';

      if (opts.entities) {
        parts.push({
          tagName: tagName,
          html: html,
          css: styles,
          attribs: attribs,
          js: jscode,
          imports: imports
        });
        return ''
      }

      return mktag(tagName, html, styles, attribs, jscode, imports, opts)
    });

  if (opts.entities) { return parts }

  return src
}

var version$2 = 'v3.2.3';

var compiler = {
  compile: compile$1,
  compileHTML: compileHTML,
  compileCSS: compileCSS,
  compileJS: compileJS,
  parsers: parsers$1,
  version: version$2
};

var promise;
var ready;       // all the scripts were compiled?

// gets the source of an external tag with an async call
function GET (url, fn, opts) {
  var req = new XMLHttpRequest();

  req.onreadystatechange = function () {
    if (req.readyState === 4 &&
       (req.status === 200 || !req.status && req.responseText.length)) {
      fn(req.responseText, opts, url);
    }
  };
  req.open('GET', url, true);
  req.send('');
}

// evaluates a compiled tag within the global context
function globalEval (js, url) {
  if (typeof js === T_STRING) {
    var
      node = mkEl('script'),
      root = document.documentElement;

    // make the source available in the "(no domain)" tab
    // of Chrome DevTools, with a .js extension
    if (url) { js += '\n//# sourceURL=' + url + '.js'; }

    node.text = js;
    root.appendChild(node);
    root.removeChild(node);
  }
}

// compiles all the internal and external tags on the page
function compileScripts (fn, xopt) {
  var
    scripts = $$('script[type="riot/tag"]'),
    scriptsAmount = scripts.length;

  function done() {
    promise.trigger('ready');
    ready = true;
    if (fn) { fn(); }
  }

  function compileTag (src, opts, url) {
    var code = compiler.compile(src, opts, url);

    globalEval(code, url);
    if (!--scriptsAmount) { done(); }
  }

  if (!scriptsAmount) { done(); }
  else {
    for (var i = 0; i < scripts.length; ++i) {
      var
        script = scripts[i],
        opts = extend({template: getAttr(script, 'template')}, xopt),
        url = getAttr(script, 'src') || getAttr(script, 'data-src');

      url ? GET(url, compileTag, opts) : compileTag(script.innerHTML, opts);
    }
  }
}

var parsers = compiler.parsers;

/*
  Compilation for the browser
*/
var compile = function (arg, fn, opts) {

  if (typeof arg === T_STRING) {

    // 2nd parameter is optional, but can be null
    if (isObject(fn)) {
      opts = fn;
      fn = false;
    }

    // `riot.compile(tag [, callback | true][, options])`
    if (/^\s*</m.test(arg)) {
      var js = compiler.compile(arg, opts);
      if (fn !== true) { globalEval(js); }
      if (isFunction(fn)) { fn(js, arg, opts); }
      return js
    }

    // `riot.compile(url [, callback][, options])`
    GET(arg, function (str, opts, url) {
      var js = compiler.compile(str, opts, url);
      globalEval(js, url);
      if (fn) { fn(js, str, opts); }
    }, opts);

  } else if (isArray(arg)) {
    var i = arg.length;
    // `riot.compile([urlsList] [, callback][, options])`
    arg.forEach(function(str) {
      GET(str, function (str, opts, url) {
        var js = compiler.compile(str, opts, url);
        globalEval(js, url);
        i --;
        if (!i && fn) { fn(js, str, opts); }
      }, opts);
    });
  } else {

    // `riot.compile([callback][, options])`
    if (isFunction(arg)) {
      opts = fn;
      fn = arg;
    } else {
      opts = arg;
      fn = undefined;
    }

    if (ready) {
      return fn && fn()
    }

    if (promise) {
      if (fn) { promise.on('ready', fn); }

    } else {
      promise = observable$1();
      compileScripts(fn, opts);
    }
  }

};

function mount$$1() {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  var ret;
  compile(function () { ret = mount$1.apply(riot$2, args); });
  return ret
}

var riot_compiler = extend({}, riot$2, {
  mount: mount$$1,
  compile: compile,
  parsers: parsers
});

return riot_compiler;

})));
});

let _startIdx = 0;

let todoModule = {
  state: {
    todoList: [],
  },
  mutations: {
    createNew ({state: {todoList}}, newItem) {
      todoList.push(newItem);
      return { todoList }
    },
    toggleCompleted ({state: {todoList}}, todo) {
      for (let i= 0, l = todoList.length; i < l ; ++ i) {
        if (todoList[i].id == todo.id) {
          let it = todoList[i];
          if (it.isCompleted == todo.isCompleted) {
            it.isCompleted = !todo.isCompleted;
            return { todoList }
          }
        }
      }
    },
    removeItemById ({state: {todoList}}, id) {
      for (let i= todoList.length -1; i >=0 ; --i) {
        if (todoList[i].id == id) {
          todoList.splice(i, 1);
          return { todoList }
        }
      }
    },
  },
  actions: {
    createNew ({resolve, commit, dispatch}, title) {
      let newItem = {};
      newItem.title = title;
      newItem.id = ++ _startIdx; 
      newItem.isCompleted = false;
      commit.createNew(newItem);
    },
  }
};

let flux = new Flux({
  strict: true
});

flux.declare(todoModule);

FluxRiot({flux, riot: riot_compiler});

console.log(riot_compiler);

riot_compiler.compile(function() {
  riot_compiler.mount('*');
});

window.riot = riot_compiler;
window.flux = flux;

}());
