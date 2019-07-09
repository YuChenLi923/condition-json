const expressionCache = {};
const noop = () => {};
const saved = [];
const newlineRE = /\n/g;
const restoreRE = /"(\d+)"/g;
const wsRE = /\s/g;
const booleanLiteralRE = /^(?:true|false)$/;
const identRE = /[^\w$\.](?:[A-Za-z_$][\w$]*)/g;
const saveRE = /[\{,]\s*[\w\$_]+\s*:|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`)|new |typeof |void /g;
const pathTestRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/;
const allowedKeywords = 'Math,Date,this,true,false,null,undefined,Infinity,NaN,' +
                        'isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,' +
                        'encodeURIComponent,parseInt,parseFloat';
const improperKeywords = 'break,case,class,catch,const,continue,debugger,default,' +
                         'delete,do,else,export,extends,finally,for,function,if,' +
                         'import,in,instanceof,let,return,super,switch,throw,try,' +
                         'var,while,with,yield,enum,await,implements,package,' +
                         'protected,static,interface,private,public';

const improperKeywordsRE = new RegExp('^(' + improperKeywords.replace(/,/g, '\\b|') + '\\b)');
const allowedKeywordsRE = new RegExp('^(' + allowedKeywords.replace(/,/g, '\\b|') + '\\b)');

function isSimplePath(exp) {
  return pathTestRE.test(exp) && !booleanLiteralRE.test(exp) && exp.slice(0, 5) !== 'Math.';
}

function restore(_, savedIndex) {
  return saved[+savedIndex];
}
function save(str, isString) {
  let i = saved.length;
  saved[i] = isString ? str.replace(newlineRE, '\\n') : str;
  return '"' + i + '"';
}

function rewrite (raw) {
  var c = raw.charAt(0)
  var path = raw.slice(1)
  if (allowedKeywordsRE.test(path)) {
    return raw;
  } else {
    path = path.indexOf('"') > -1 ? path.replace(restoreRE, restore) : path;
    return c + 'scope.' + path;
  }
}

function makeExecFn(body) {
  try {
    return new Function('scope', 'return ' + body + ';');
  } catch (e) {
    return noop;
  }
}

function compile(exp) {
  if (improperKeywordsRE.test(exp)) {
    console.warn('Avoid using reserved keywords in expression: ' + exp);
  }
  saved.length = 0;
  let body = exp.replace(saveRE, save).replace(wsRE, '');
  body = (' ' + body).replace(identRE, rewrite).replace(restoreRE, restore);
  return makeExecFn(body);
}

function parseExpression(exp, scope) {
  exp = exp.trim();
  let hit = expressionCache[exp];
  if (hit) {
    return hit(scope);
  }

  let execFn = isSimplePath(exp) && exp.indexOf('[') < 0 ? makeExecFn('scope.' + exp) : compile(exp);
  expressionCache[exp] = execFn;
  return execFn(scope);
}

module.exports = parseExpression;
