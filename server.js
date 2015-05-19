var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var md5 = require('MD5');

app.use('/', express.static(__dirname + '/client'));
app.get('/', function(req, res){
    res.sendfile(__dirname + '/client/index.html');
});

var color = ['#999999', '#CCCCCC', '#00FF00', '#0000FF', '#FF0000', '#FFFF00'];
var users = {};
var nbParticule = 250;
var particules = [];

for (var i = 0; i < nbParticule; i++)
{
    particules[i] = {
        x: randomIntInc(0, 5000),
        y: randomIntInc(0, 5000),
        color: color[randomIntInc(0, 5)]
    };
}

io.on('connection', function(socket){
    var me = false;

    socket.on('login', function(user){
        hrTime = process.hrtime()
        me = user;
        me.id = parseInt(hrTime[0] * 1000000 + hrTime[1] / 1000);
        socket.emit('logged', me, particules);

        for (var k in users){
            socket.emit('newUser', users[k]);
        }

        users[me.id] = me;
        socket.broadcast.emit('newUser', user);
    });

    socket.on('myPlayer', function(user){
        users[me.id] = user;
        io.emit('emitPlayer', user);

        console.log(user);
    });

    socket.on('disconnect', function(){
        if(!me){
            return false;
        }
        delete users[me.id];
        io.emit('logout', me);
    });

});

server.listen(3000, function(){
    console.log('listening on *:3000');
});

function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}