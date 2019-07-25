import expressionParser from './expressionParser';
import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';
import assign from 'extend-assign';
const expressionWithKeyReg = /^\{(.*)\}:(.+)/;

function handleValue(value, scope) {
  if (isFunction(value)) {
    try {
      return value(scope);
    } catch (e) {
      return {};
    }
  } else if (isObject(value)) {
    return convert(value, scope);
  } else {
    return value;
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
        newJson[parseRes.key] = handleValue(value, scope);
      }
      return;
    }
    if (!isExpression(key)) {
      newJson[key] = handleValue(value, scope);
      return;
    }
    key = key.slice(1, key.length - 1);
    let result = expressionParser(key, scope);// value, {}, []
    if (!result || !isObject(value)) {
      return;
    }
    assign(newJson, convert(value, scope), true);
    Object.assign(json, value);
  });
  return newJson;
}

module.exports = convert;
