import expressionParser from './expressionParser';
import isObject from 'lodash/isObject';
import assign from 'extend-assign';

function isExpression(key) {
  return key[0] === '{' && key[key.length - 1] === '}';
}

function convert(json, scope) {
  let keys = Object.keys(json);
  let newJson = Array.isArray(json) ? [] : {};
  keys.forEach((key) => {
    let value = json[key];
    if (!isExpression(key)) {
      newJson[key] = isObject(value) ? convert(value, scope) : value;
      return;
    }
    key = key.slice(1, key.length - 1);
    let result = expressionParser(key, scope);// value, {}, []
    if (!result || !isObject(value)) {
      return;
    }
    assign(newJson, convert(value, scope), true);
    if (!result) {
      return;
    }
    Object.assign(json, value);
  });
  return newJson;
}

module.exports = convert;
