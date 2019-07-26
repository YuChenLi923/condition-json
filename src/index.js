import expressionParser from './expressionParser';
import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';
import assign from 'extend-assign';
const expressionWithKeyReg = /^\{(.*)\}:(.+)/;

function isPromise(promise) {
  return Object.prototype.toString.call(promise) === '[object Promise]';
}
function handleValue(value, scope, newJson, key) {
  if (isFunction(value)) {
    try {
      let valueParse = value(scope);
      if (isPromise(valueParse)) {
        valueParse.then((result) => {
          newJson[key] = result;
        });
      } else {
        newJson[key] = valueParse;
      }
    } catch (e) {
      newJson[key] = {};
    }
  } else if (isObject(value)) {
    newJson[key] = convert(value, scope);
  } else {
    newJson[key] = value;
  }
}

function isExpression(key) {
  return key[0] === '{' && key[key.length - 1] === '}';
}

function isExpressionWithKey(key) {
  return expressionWithKeyReg.test(key);
}

function parseExpressionWithKey(key) {
  const result = expressionWithKeyReg.exec(key);
  return {
    key: result[2],
    expression: result[1]
  };
}

function convert(json, scope) {
  let keys = Object.keys(json);
  let newJson = Array.isArray(json) ? [] : {};
  keys.forEach((key) => {
    key = key.trim();
    let value = json[key];
    if (isExpressionWithKey(key)) {
      const parseRes = parseExpressionWithKey(key);
      const result = expressionParser(parseRes.expression, scope);
      if (result) {
        handleValue(value, scope, newJson, parseRes.key);
      }
      return;
    }
    if (!isExpression(key)) {
      handleValue(value, scope, newJson, key);
      return;
    }
    key = key.slice(1, key.length - 1);
    let result = expressionParser(key, scope);// value, {}, []
    if (!result || !isObject(value)) {
      return;
    }
    assign(newJson, convert(value, scope), true);
  });
  return newJson;
}

module.exports = convert;
