var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var md5 = require('MD5');

app.use('/', express.static(__dirname + '/client'));
app.get('/', function(req, res){
    res.sendfile(__dirname + '/client/index.html');
});

server.listen(3000, function(){
    console.log('listening on *:3000');
});