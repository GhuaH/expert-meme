var http = require("http");
var querystring = require("querystring");
http.createServer(function(req,res){
  if(req.url == "/favicon.ico"){
    return;
  }
  res.writeHead(200,{"content-type":"text/html;charset=utf-8"});
  var a = {};
  a = querystring.parse(req.url);
  console.log(a);
  res.write("<p>"+ a.query.user + a.query.pwd +"</p>")
  res.end();
}).listen(5555,"127.0.0.1");