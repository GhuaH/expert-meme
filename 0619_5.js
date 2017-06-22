var http = require("http");
var url = require("url");
var fs = require("fs");
var i;

var server = http.createServer(function(req,res){
  if(req.url == "/favicon.ico"){
    return;
  }
  fs.readdir("./txt",function(err,data){
    if(err){
      throw err;
    }
    for(i = 0 ; i < data.length ; ){
      console.log(data[i],i);
      i = succ(data[i],i) + 1;
    }
    function succ(i,j){
      console.log("正在加载" + i);
      console.log(i + "加载完毕");
      return (function(k,n){
        fs.stat("./demo/"+k,function(err,file){
          console.log(file);
          return n;
        })
      })(i,j);
    }


    res.writeHead(200,{"content-type":"text/html;charset=utf-8"})
    res.end();
  });
}).listen(5554,"127.0.0.1");