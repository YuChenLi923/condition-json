# condition-json
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
  }
};
const result = cjson(json, {
  showAge: true
});
```

result被转换为:

```
{
  name: 'yuchen',
  age: 22
}
```

## API
### cjson(json[,scope])

- json \<Object>|\<JSON>
- scope \<Object>
