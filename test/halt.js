var Vanilla = require('../vanilla');var app = Vanilla.listen(8080); app.get('/', function(req, res, next) {  try {    res.halt(403);  } catch(err) {    console.log(err);  }  console.log('this shouldnt get called');});