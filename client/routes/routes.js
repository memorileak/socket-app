function routeConfig($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/templates/home/home.view.html',
            controller: 'homeController',
            controllerAs: 'sc',
        })
        .otherwise({redirectTo: '/'});
};

SocketIOApp.config(['$routeProvider', routeConfig]);