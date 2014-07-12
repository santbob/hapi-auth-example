//Add all the routes related to Auth Plugin here.
var Handler = require('./handlers');
module.exports = [{
    path: "/auth/facebook",
    method: "GET",
    config: {
        auth: 'facebook',
        handler: Handler.sessionManagement
    }

}, {
    path: "/auth/google",
    method: "GET",
    config: {
        auth: 'google',
        handler: Handler.sessionManagement
    }
}, {
    path: "/logout",
    method: "GET",
    config: {
        handler: function(request, reply) {
            request.auth.session.clear();
            return reply.redirect('/');
        }
    }
}];
