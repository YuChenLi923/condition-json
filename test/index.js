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
    const jsonArray = [{
      name: 'Mike',
      '{!mike.ageSecrecy}': {
        age: 15
      }
    }, {
      name: 'Curry',
      '{!curry.ageSecrecy}': {
        age: 15
      }
    }];
    const result = cjson(jsonArray, {
      mike: {
        ageSecrecy: true
      },
      curry: {
        ageSecrecy: false
      }
    });
    assert.deepEqual(result, [{
      name: 'Mike'
    }, {
      name: 'Curry',
      age: 15
    }]);
  });
});
