'use strict';
var Hapi = require('hapi');

var serverOptions = {
    views: {
        engines: {
            html: require('handlebars')
        },
        path: __dirname + '/templates',
        partialsPath: __dirname + '/templates',
        //helpersPath: __dirname + '/hb_helpers',
        layout: true
    },
    cors: true
};

var server = new Hapi.Server(3000, 'localhost', serverOptions);


server.pack.register([
    { plugin: require('lout') },
    { plugin: require('bell') },
    { plugin: require('hapi-auth-cookie') },
    { plugin: require('./plugins/auth')}], function(err) {
    if (err) throw err;
    server.route([{
        path: '/myprofile',
        method: 'GET',
        config: {
            auth: 'session',
            handler: function(request, reply) {
                reply('<html><head><title>Login page</title></head><body><h3>Welcome '
                  + JSON.stringify(request.auth.credentials, null, 4)
                  + '!</h3><br/><form method="get" action="/logout">'
                  + '<input type="submit" value="Logout">'
                  + '</form></body></html>');
            }
        }
    }, {
        path: '/',
        method: 'GET',
        config: {  // try with redirectTo disabled makes isAuthenticated usefully available
            auth: {
                strategy: 'session',
                mode: 'try'
            },
            plugins: { 'hapi-auth-cookie': { redirectTo: false } }
        },
        handler: function(request, reply) {
            reply.view('index', {
                auth: JSON.stringify(request.auth),
                session: JSON.stringify(request.session),
                isLoggedIn: request.auth.isAuthenticated
            });
        }
    }, {
        path: '/{path*}',
        method: 'GET',
        handler: {
            directory: {
                path: './public',
                listing: false,
                index: true
            }
        }
    }]);
    server.start(function(err) {
        if (err) {
            console.log('error message ' + err);
        }
        console.log('Hapi server started @ ' + server.info.uri);
        console.log('server started on port: ', server.info.port);
    });
});

// Make the server available as the top-level export of this module.
module.exports = server;
