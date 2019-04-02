const express = require('express');
const app = express();
const httpServer = require('http').Server(app);
const io = require('socket.io')(httpServer);
const cors = require('cors');
const port = 1206;

const clients = {};

app.use(cors());
app.use(express.static('public'));
app.use(express.static('client'));
app.use(express.static('client/assets'));

io.on('connection', (socket) => {
    console.log('a user connected: ' + socket.id);

    socket.emit('joined', socket.id);
    socket.broadcast.emit('someone_joined');

    socket.on('disconnect', () => {
        console.log('a user disconnected: ' + socket.id);
        delete clients[socket.id];
        socket.broadcast.emit('someone_left');
    });
    
    clients[socket.id] = socket;

    socket.on('send_message', ({to, text}) => {
        if (clients[to]) {
            clients[to].emit('receive_message', {from: socket.id, text});
            socket.emit('receive_message', {from: socket.id, text});
        }
    });
});

app.get('/clients', (req, res) => {
    const user_id = req.query.user || null;
    res.json({
        success: true,
        code: 200,
        data: {clients: Object.keys(clients).filter(client => client !== user_id) || []}
    });
});

httpServer.listen(port, () => {console.log(`App is listening on port ${port}`)});