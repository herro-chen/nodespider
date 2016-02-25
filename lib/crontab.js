var express = require('express');
var path = require('path');
var fs = require('fs');
var crontab = require('node-crontab');

var Spider = require('./spider');

var app = express();
var rootPath = path.join(__dirname, '../');
var dbPath = rootPath + 'db/';

var Crontab = function() {
  
}

//定时爬虫
Crontab.prototype.spider = function(){

  var fn = function() {
    //定时任务具体逻辑
    var filesinfo = [];
    var res = {
      'send': function(msg){
        console.log(msg);
      } 
    }
    fs.readdirSync(dbPath).forEach(function(file){
      var fileSon = dbPath + file;
      fs.readFile(fileSon, {encoding: 'utf8'}, function(err, data){
        if(err){
          console.error(err);
        }
        var item = JSON.parse(data);
        if (item) {
          new Spider(item).start(res);
        }
        
      });
    })
  }
  
  // 1 小时执行一次
  var jobId = crontab.scheduleJob("0 */1 * * *", fn);
  
  if (app.get('env') === 'development') {
    //fn();
  }
  
}

module.exports = Crontab;
