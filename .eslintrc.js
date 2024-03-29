module.exports = {
    "extends": "standard",
    "rules": {
      "semi": ["error", "always"],
      "one-var": 0,
      "no-new-func": 0,
      "no-useless-escape": 0,
      "require-atomic-updates": 0,
      "indent": ["error", 2, { "VariableDeclarator": { "var": 2, "let": 2, "const": 3 } }],
      "space-before-function-paren": ["error", {"anonymous": "always", "named": "never", "asyncArrow": "always"}]
    }
};
