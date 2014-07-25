//Handler functions used by the routes.
exports.sessionManagement = function(request, reply) {
    /*session management using hapi-cookie*/
    var account = request.auth.credentials;
    var sid = account.profile.id;
    //cache object bounded to the plugin is available here.
    this.cache.set(sid, {
        account: account
    }, 0, function(err) {
        if (err) {
            reply(err);
        }
        request.auth.session.set({
            sid: sid
        });
        return reply.redirect('/');
    });
};
