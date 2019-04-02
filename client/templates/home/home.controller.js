SocketIOApp.controller('homeController', function($scope) {
    const sc = this;
    const BASE_URL = 'http://' + window.location.host;
    sc.user = '';
    sc.client = '';
    sc.message_text = '';
    sc.clients = [];
    sc.messages = [];
    const socket = io();

    socket.on('joined', (user) => {
        sc.user = user;
        console.log("Your id: ", sc.user);
        sc.getListClients(user);
    });

    socket.on('receive_message', ({from, text}) => {
        $scope.$apply(sc.messages.push({from, text}));
    });

    socket.on('someone_joined', () => {sc.getListClients(sc.user)});
    socket.on('someone_left', () => {sc.getListClients(sc.user)});

    sc.getListClients = function(user) {
        $.get(`${BASE_URL}/clients?user=${user}`, (res) => {
            $scope.$apply(sc.clients = res.data.clients);
        });
    };

    sc.sendMessage = function() {
        if (sc.client) {
            socket.emit('send_message', {to: sc.client, text: sc.message_text});
            sc.message_text = "";
        } else {
            alert('No user selected!');
        }
    };

    sc.handleUserClick = function(client) {
        sc.client = client;
    };

});