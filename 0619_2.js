var http = require("http");
var url = require("url")
http.createServer(function(req,res){
    res.writeHead(200,{"content-type":"text/html;charset=utf-8"})
    res.write("<p>可惜啊可惜</p>");
    console.log(req.url);
    console.log(url.parse(req.url).query)
    res.end();
}).listen(3535)
