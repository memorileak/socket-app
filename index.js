const express = require('express');
const app = express();
const httpServer = require('http').Server(app);
const io = require('socket.io')(httpServer);
const port = 1206;

const clients = {};

app.use(express.static('public'));
app.use(express.static('client'));

io.on('connection', (socket) => {
    console.log('a user connected: ' + socket.id);

    socket.on('disconnect', () => {
        console.log('a user disconnected: ' + socket.id);
        delete clients[socket.id];
    });
    
    clients[socket.id] = socket;

    socket.on('send_message', ({to, text}) => {
        clients[to].emit('receive_message', {from: socket.id, text});
    });
});

httpServer.listen(port, () => {console.log(`App is listening on port ${port}`)});