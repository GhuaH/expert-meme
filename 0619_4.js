var http = require("http");
var url = require("url");
http.createServer(function(req,res){
  if(req.url == "/favicon.ico"){
      return;
  }
  var data = req.url;
  console.log(data);
  if(data.substr(0,9) == "/student/"){
    var studentId = data.substr(9);
    if(studentId.match(/^\d{10}$/)){
      res.writeHead(200,{"content-type":"text/html;charset=utf-8"});
      res.end("<p>学生" + studentId +"</p>");
    }
    else{
      res.writeHead(404,{"content-type":"text/html;charset=utf-8"});
      res.end("位数不对");
    }
  }else if(data.substr(0,9) == "/teacher/"){
    var teacherId = data.substr(9);
    if(teacherId.match(/^\d{6}$/)){
      res.writeHead(200,{"content-type":"text/html;charset=utf-8"});
      res.end("<p>老师" + teacherId +"</p>");
    }
    else{
      res.writeHead(404,{"content-type":"text/html;charset=utf-8"});
      res.end("位数不对");
    }
  }else{
    res.writeHead(404,{"content-type":"text/html;charset=utf-8"});
    res.end("不存在");
  }



}).listen(5554,"127.0.0.1");