var http = require("http");
var fs = require("fs");
var server = http.createServer(function(req,res){
  if(req.url == "/hao"){
    fs.readFile("./demo/demo1.html",function(err,data){
      if(err)
        throw err;
      res.writeHead(200,{"content-type":"text/html"});
      res.end(data);
    });
  }else if(req.url == "/hua"){
    fs.readFile("./demo/demo2.html",function(err,data){
      if(err)
        throw err;
      res.writeHead(200,{"content-type":"text/html"});
      res.end(data);
    });
  }else if(req.url == "/111"){
    fs.readFile("./demo/img/111.png",function(err,data){
      if(err)
        throw err;
      res.writeHead(200,{"content-type":"img/png"})
      res.end(data);
    })
  }else if(req.url == "/aaa"){
    fs.readFile("./demo/css/kkk.css",function(err,data){
      if(err)
        throw err;
      res.writeHead(200,{"content-type":"text/css"})
      res.end(data);
    })
  }else if(req.url == "/222"){
    fs.readFile("./demo/img/222.png",function(err,data){
      if(err)
        throw err;
      res.writeHead(200,{"content-type":"img/png"})
      res.end(data);
    })
  }else{
    res.writeHead(404,{"content-type":"text/html"});
    res.end("<p>对不起，没有这个界面</p>");
  }
});
server.listen(3333);