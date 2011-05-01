var Vanilla = require('../vanilla');var app = Vanilla.listen(8080); // from underscore.js:// JavaScript micro-templating, similar to John Resig's implementation.// Underscore templating handles arbitrary delimiters, preserves whitespace,// and correctly escapes quotes within interpolated code.var template = (function() {  var c = {    evaluate    : /<%([\s\S]+?)%>/g,    interpolate : /<%=([\s\S]+?)%>/g  };  return function(str, data) {    var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +      'with(obj||{}){__p.push(\'' +      str.replace(/\\/g, '\\\\')         .replace(/'/g, "\\'")         .replace(c.interpolate, function(match, code) {           return "'," + code.replace(/\\'/g, "'") + ",'";         })         .replace(c.evaluate || null, function(match, code) {           return "');" + code.replace(/\\'/g, "'")                              .replace(/[\r\n\t]/g, ' ') + "__p.push('";         })         .replace(/\r/g, '\\r')         .replace(/\n/g, '\\n')         .replace(/\t/g, '\\t')         + "');}return __p.join('');";    var func = new Function('obj', tmpl);    return data ? func(data) : func;  };})();app.set('template', template);app.set('views', __dirname + '/views');app.get('/', function(req, res, next) {  console.log('benchmarking compile...');  for (var s = Date.now(), i = 5000; i--;) {    var out = app._compile('message_func.html')({      title: 'Look, a view.',      content: 'Hello world!'    });  }  console.log('DONE', Date.now() - s);  res.serve(out);});app.get('/1', function(req, res, next) {  res.render('message_statement.html', {    title: 'Look, a view.',    content: 'Hello world!'  });});app.get('/2', function(req, res, next) {  res.view     //.name('message.html')    .inherits('layout.html')    .inherits('section.html')    .inherits('message.html')    .local({      title: 'Look, a view.',      content: 'Hello world!'    })    .render();});app.get('/3', function(req, res, next) {  res.view    .name('basic.html')    .local({      title: 'Quite a view.',      message: 'Hello world!'    })    .render();});app.get('/4', function(req, res, next) {  res.view    .name('partial.html')    .local({      title: 'A partial',      body: 'Hello world!'    })    .render();});