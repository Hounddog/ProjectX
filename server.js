var connect = require('connect');
var app = connect.createServer(
    connect.static(__dirname + "/public/")
).listen(8080);

console.log(__dirname);
