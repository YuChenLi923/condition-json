(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["cjson"] = factory();
	else
		root["cjson"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _expressionParser = __webpack_require__(1);

var _expressionParser2 = _interopRequireDefault(_expressionParser);

var _isObject = __webpack_require__(2);

var _isObject2 = _interopRequireDefault(_isObject);

var _extendAssign = __webpack_require__(3);

var _extendAssign2 = _interopRequireDefault(_extendAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isExpression(key) {
  return key[0] === '{' && key[key.length - 1] === '}';
}

function convert(json, scope) {
  var keys = Object.keys(json);
  var newJson = Array.isArray(json) ? [] : {};
  keys.forEach(function (key) {
    var value = json[key];
    if (!isExpression(key)) {
      newJson[key] = (0, _isObject2.default)(value) ? convert(value, scope) : value;
      return;
    }
    key = key.slice(1, key.length - 1);
    var result = (0, _expressionParser2.default)(key, scope); // value, {}, []
    if (!result || !(0, _isObject2.default)(value)) {
      return;
    }
    (0, _extendAssign2.default)(newJson, convert(value, scope), true);
    if (!result) {
      return;
    }
    Object.assign(json, value);
  });
  return newJson;
}

module.exports = convert;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var expressionCache = {};
var noop = function noop() {};
var saved = [];
var newlineRE = /\n/g;
var restoreRE = /"(\d+)"/g;
var wsRE = /\s/g;
var booleanLiteralRE = /^(?:true|false)$/;
var identRE = /[^\w$\.](?:[A-Za-z_$][\w$]*)/g;
var saveRE = /[\{,]\s*[\w\$_]+\s*:|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`)|new |typeof |void /g;
var pathTestRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/;
var allowedKeywords = 'Math,Date,this,true,false,null,undefined,Infinity,NaN,' + 'isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,' + 'encodeURIComponent,parseInt,parseFloat';
var improperKeywords = 'break,case,class,catch,const,continue,debugger,default,' + 'delete,do,else,export,extends,finally,for,function,if,' + 'import,in,instanceof,let,return,super,switch,throw,try,' + 'var,while,with,yield,enum,await,implements,package,' + 'protected,static,interface,private,public';

var improperKeywordsRE = new RegExp('^(' + improperKeywords.replace(/,/g, '\\b|') + '\\b)');
var allowedKeywordsRE = new RegExp('^(' + allowedKeywords.replace(/,/g, '\\b|') + '\\b)');

function isSimplePath(exp) {
  return pathTestRE.test(exp) && !booleanLiteralRE.test(exp) && exp.slice(0, 5) !== 'Math.';
}

function restore(_, savedIndex) {
  return saved[+savedIndex];
}
function save(str, isString) {
  var i = saved.length;
  saved[i] = isString ? str.replace(newlineRE, '\\n') : str;
  return '"' + i + '"';
}

function rewrite(raw) {
  var c = raw.charAt(0);
  var path = raw.slice(1);
  if (allowedKeywordsRE.test(path)) {
    return raw;
  } else {
    path = path.indexOf('"') > -1 ? path.replace(restoreRE, restore) : path;
    return c + 'scope.' + path;
  }
}

function makeExecFn(body) {
  try {
    return new Function('scope', 'return ' + body + ';');
  } catch (e) {
    return noop;
  }
}

function compile(exp) {
  if (improperKeywordsRE.test(exp)) {
    console.warn('Avoid using reserved keywords in expression: ' + exp);
  }
  saved.length = 0;
  var body = exp.replace(saveRE, save).replace(wsRE, '');
  body = (' ' + body).replace(identRE, rewrite).replace(restoreRE, restore);
  return makeExecFn(body);
}

function parseExpression(exp, scope) {
  exp = exp.trim();
  var hit = expressionCache[exp];
  if (hit) {
    return hit(scope);
  }

  var execFn = isSimplePath(exp) && exp.indexOf('[') < 0 ? makeExecFn('scope.' + exp) : compile(exp);
  expressionCache[exp] = execFn;
  return execFn(scope);
}

module.exports = parseExpression;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

!function(t,e){ true?module.exports=e():undefined}(this,function(){return function(t){var e={};function r(o){if(e[o])return e[o].exports;var n=e[o]={i:o,l:!1,exports:{}};return t[o].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=t,r.c=e,r.d=function(t,e,o){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(r.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)r.d(o,n,function(e){return t[e]}.bind(null,n));return o},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=0)}([function(t,e,r){"use strict";var o=r(1),n=r(2);function i(t,e){Object.defineProperty(t,e,{enumerable:!1,writable:!1})}function u(t,e,r,o,u){t&&(e&&(n(t,"array")&&t.includes(r)||n(t,"function")&&t(r))?i(o,r):!e&&(n(t,"array")&&t.includes(u.parent?u.parent+"."+r:r)||n(t,"function")&&t(u.parent?u.parent+"."+r:r))&&i(o,r))}t.exports=function t(){for(var e=arguments.length,r=Array(e),i=0;i<e;i++)r[i]=arguments[i];var c=r.shift(),f=r,a=f.length,l=r[a-1],p={parent:""},d=void 0,s=void 0,y=void 0,b=void 0,v=void 0,j=void 0,m=void 0,w=void 0;if(!n(c,"object")&&!n(c,"array")&&!n(c,"function"))throw new Error("the target is not Object, Array or Function");if(!n(l,"object")||!0!==r[a-2]&&!1!==r[a-2])!0===l&&(--a,f.pop());else{p=l,l=r[a-2];var O=p;d=O.filter,b=O.protect,s=O.filterGlobal,y=O.protectGlobal,a-=2}for(v=0;v<a;v++)for(j in w=f[v]){if(d){if(s&&(n(d,"array")&&d.includes(j)||n(d,"function")&&!d(j)))continue;if(!s&&(n(d,"array")&&d.includes(p.parent?p.parent+"."+j:j)||n(d,"function")&&!d(p.parent?p.parent+"."+j:j)))continue}!0===l&&(n(w[j],"object")||n(w[j],"array"))?(m=n(w[j],"object")?c[j]&&o(c[j])?c[j]:{}:c[j]&&Array.isArray(c[j])?c[j]:[],c[j]=t(m,w[j],l,{parent:p.parent?p.parent+"."+j:j,filter:d,protect:b,filterGlobal:s,protectGlobal:y}),u(b,y,j,c,p)):void 0!==w[j]&&(c[j]=w[j],u(b,y,j,c,p))}return c}},function(t,e,r){"use strict";var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};t.exports=function(t){var e=Object.prototype.hasOwnProperty;if(!t||"object"!==(void 0===t?"undefined":o(t))||"undefined"!=typeof window&&window.window===window&&t===window)return!1;try{if(t.constructor&&!e.call(t,"constructor")&&!e.call(t.constructor.prototype,"isPrototypeOf"))return!1}catch(t){return!1}var r=void 0;for(r in t);return void 0===r||e.call(t,r)}},function(t,e,r){"use strict";t.exports=function(t,e){return Object.prototype.toString.call(t).replace("]","").split(" ")[1].toLowerCase()===e.toLowerCase()}}])});

/***/ })
/******/ ]);
});