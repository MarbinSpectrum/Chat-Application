const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const port = process.env.PORT || 3000;

let clientNames = new Map();

app.get('/', (req,res) =>
{
    res.sendFile(__dirname + '/index.html');
});

io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' });

io.on('connection', (socket) => 
{
    socket.on('disconnect', () =>
    {
        let name = clientNames.get(socket.id);
        console.log('user disconnected: '+ socket.id);
        io.emit('chat message', name + '님이 퇴장했습니다.');
        clientNames.delete(socket.id);
    });
    socket.on('chat message',(msg) =>
    {
        let name = clientNames.get(socket.id);
        let chat = name + ' : ' + msg;
        io.emit('chat message', chat);
        console.log(chat);
    });
    socket.on('login complete',(name) =>
    {
        console.log('login: ' + name);
        io.emit('chat message', name + '님이 입장했습니다.');
        clientNames.set(socket.id , name);
        //clientNames[socket.id] = name;
    });
});


server.listen(port, () =>
{
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});