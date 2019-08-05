import expressionParser from './expressionParser';
import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';
import assign from 'extend-assign';
const expressionWithKeyReg = /^\{(.*)\}:(.+)/;

function isAsyncFunction(func) {
  return Object.prototype.toString.call(func) === '[object AsyncFunction]';
}

async function handleValue(value, scope, newJson, key) {
  if (isFunction(value)) {
    try {
      if (isAsyncFunction(value)) {
        newJson[key] = await value(scope);
      } else {
        newJson[key] = value(scope);
      }
    } catch (e) {
      newJson[key] = {};
    }
  } else if (isObject(value)) {
    newJson[key] = await convert(value, scope);
  } else {
    newJson[key] = value;
  }
  return true;
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

async function convert(json, scope) {
  let keys = Object.keys(json);
  let newJson = Array.isArray(json) ? [] : {};
  await Promise.all(keys.map(async (key) => {
    key = key.trim();
    let value = json[key];
    if (isExpressionWithKey(key)) {
      const parseRes = parseExpressionWithKey(key);
      const result = expressionParser(parseRes.expression, scope);
      if (result) {
        await handleValue(value, scope, newJson, parseRes.key);
      }
      return;
    }
    if (!isExpression(key)) {
      await handleValue(value, scope, newJson, key);
      return;
    }
    key = key.slice(1, key.length - 1);
    let result = expressionParser(key, scope);// value, {}, []
    if (!result || !isObject(value)) {
      return;
    }
    let childJSON = await convert(value, scope);
    assign(newJson, childJSON, true);
  }));
  return newJson;
}

module.exports = convert;
