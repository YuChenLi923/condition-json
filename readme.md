# condition-json

[![Build Status](https://www.travis-ci.org/YuChenLi923/condition-json.svg?branch=master)](https://www.travis-ci.org/YuChenLi923/condition-json)
[![Coverage Status](https://coveralls.io/repos/github/YuChenLi923/condition-json/badge.svg?branch=master)](https://coveralls.io/github/YuChenLi923/condition-json?branch=master)
![Downloads](http://img.shields.io/npm/dm/condition-json.svg?style=flat)
![NPM version](https://badge.fury.io/js/condition-json.svg)

拓展json功能,使其key支持条件表达式,condition-json会根据条件,生成对应的json格式。

## 安装

```
npm i condition-json --save
```

## 用法

```js
const cjson = require('condition-json');
const json = {
  name: 'yuchen',
  '{showAge}': {
    age: 22
  },
  '{showBook}:book': {
    name: 'book1'
  }
};
const result = cjson(json, {
  showAge: true,
  showBook: true
});
```

result被转换为:

```
{
  name: 'yuchen',
  age: 22,
  book: {
    name: 'book1'
  }
}
```

## API
### cjson(json[,scope])

- json \<Object>|\<JSON>
- scope \<Object>
