const cjson = require('../dist/condition-json'),
      assert = require('assert');
describe('test assign', () => {
  it('JSON-Example-1', () => {
    const json = {
      name: 'mike',
      [`{type === 'adult'}`]: {
        height: 175,
        weight: 100
      },
      [`{type === 'child'}`]: {
        height: 105,
        weight: 100
      }
    };
    const result = cjson(json, {
      type: 'adult'
    });
    assert.deepEqual(result, {
      name: 'mike',
      height: 175,
      weight: 100
    });
  });
  it('JSON-Example-2', () => {
    const json = {
      book: {
        name: 'wow',
        [`{showAuthor}`]: {
          author: {
            name: 'yuchenli',
            age: 22
          }
        }
      }
    };
    const result = cjson(json, {
      showAuthor: true
    });
    assert.deepEqual(result, {
      book: {
        name: 'wow',
        author: {
          name: 'yuchenli',
          age: 22
        }
      }
    });
  });
  it('JSONArray-Example-1', () => {
    const jsonArray = [1, 2, 3, 4];
    const result = cjson(jsonArray);
    assert.deepEqual(result, [1, 2, 3, 4]);
  });
  it('JSONArray-Example-2', () => {
    const a = {
      status: 0,
      msg: '',
      data: [
        {
          name: '男',
          'value|10000-12000': 1
        },
        {
          name: '女',
          'value|10000-12000': 1
        }
      ],
      '{header.regionId === \'220113\'}': {
        '{query.scenicId > 0}:data': [
          {
            name: '男',
            'value|3840-4800': 1
          },
          {
            name: '女',
            'value|8160-10200': 1
          }
        ],
        '{query.scenicId <= 0}:data': [
          {
            name: '男',
            'value|256000-262400': 1
          },
          {
            name: '女',
            'value|544000-557600': 1
          }
        ]
      }
    };
    console.log(cjson(a, {
      header: {
        regionId: '220113'
      },
      query: {
      }
    }), 99999)
    const jsonArray = [{
      name: 'Mike',
      '{mike.ageSecrecy}:age|2-4': 14
    }, {
      name: 'Curry',
      '{curry.ageSecrecy}': {
        type: function ({mike}) {
          return mike.age;
        }
      }
    }];
    const result = cjson(jsonArray, {
      mike: {
        ageSecrecy: true,
        age: 2
      },
      curry: {
        ageSecrecy: true
      }
    });
    console.log(result);
  });
});
