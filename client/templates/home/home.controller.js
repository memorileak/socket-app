SocketIOApp.controller('homeController', function($scope) {
    const sc = this;
    const BASE_URL = 'http://' + window.location.host;
    sc.user = '';
    sc.client = '';
    sc.clients = [];
    sc.message_text = '';
    sc.all_channels = {};
    const socket = io();

    socket.on('joined', (user) => {
        sc.user = user;
        console.log("Your id: ", sc.user);
        sc.getListClients(user);
    });

    socket.on('receive_message', ({from, text}) => {
        $scope.$apply(() => {
            const client_channel = (from === sc.user) ? sc.client : from;
            if (Array.isArray(sc.all_channels[client_channel])) {
                sc.all_channels[client_channel].push({from, text});
            } else {
                sc.all_channels[client_channel] = [{from, text}];
            }
        });
    });

    socket.on('someone_joined', (joined_client) => {sc.getListClients(sc.user, sc.mappingChannels)});
    socket.on('someone_left', (left_client) => {
        delete sc.all_channels[left_client];
        sc.client = (sc.client === left_client) ? '' : sc.client; 
        sc.getListClients(sc.user, sc.mappingChannels);
    });

    sc.getListClients = function(user, callback) {
        $.get(`${BASE_URL}/clients?user=${user}`, (res) => {
            $scope.$apply(sc.clients = res.data.clients);
            if (callback) callback(res.data.clients);
        });
    };

    sc.mappingChannels = function(clients) {
        clients.forEach(client => {
            $scope.$apply(sc.all_channels[client] = sc.all_channels[client] || []);
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