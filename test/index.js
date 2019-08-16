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
    cjson(json, {
      type: 'adult'
    }).then((result) => {
      assert.deepEqual(result, {
        name: 'mike',
        height: 175,
        weight: 100
      });
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
    cjson(json, {
      showAuthor: true
    }).then((result) => {
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
  });
  it('JSONArray-Example-1', () => {
    const jsonArray = [1, 2, 3, 4];
    cjson(jsonArray).then((result) => {
      assert.deepEqual(result, [1, 2, 3, 4]);
    });
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
    const testPromise = function () {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(1);
        }, 2000);
      });
    };
    const jsonArray = [{
      name: 'Mike',
      '{mike.ageSecrecy}:age|2-4': 14
    }, {
      name: 'Curry',
      book: function () {
        return 321;
      },
      '{curry.ageSecrecy}': {
        type: async function () {
          const result = await testPromise();
          console.log(result);
          return result;
        },
        a: 2
      }
    }];
    cjson(jsonArray, {
      mike: {
        ageSecrecy: true,
        age: 2
      },
      curry: {
        ageSecrecy: true
      }
    }).then((result) => {
      assert.deepEqual(result[1], {
        name: 'Curry',
        a: 2,
        type: 1,
        book: 321
      });
    });
  });
});
describe('test function error', () => {
  it('error', () => {
    const json = {
      name: {
        body: async function() {
          return a;
        }
      }
    };
    cjson(json, {}, {
      error:  (e) => {
        console.log(e.message, 3213213213);
      }
    });
  });
})
