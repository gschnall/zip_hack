//include modules
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

//routes include
var api = require('./routes/api')

//setup express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(express.static(path.join(__dirname, 'public')));

//use routes
app.use('/api', api);

//start app
app.listen(3000, function(){
  console.log('app listening on port 3000!');
});
