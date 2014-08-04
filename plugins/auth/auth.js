var Hoek = require("hoek");
var Routes = require("./routes");
var Providers = require("./config").get('/provider');

exports.register = function(plugin, options, next) {

    //app cache to store user information once logged in.
    var cache = plugin.cache({
        expiresIn: 3 * 24 * 60 * 60 * 1000
    });
    plugin.app.cache = cache;

    //Bind the object to the plugin to be accessible in handlers
    plugin.bind({
        cache: plugin.app.cache
    });
    
    //Add Multiple strategies here and we have used confidence to pick up the configuration.
    plugin.auth.strategy('facebook', 'bell', Providers.facebook);

    plugin.auth.strategy('google', 'bell', Providers.google);

    plugin.auth.strategy('session', 'cookie', {
        password: 'hapiauth', // give any string you think is right password to encrypted
        cookie: 'sid-hapiauth', // cookie name to use, usually sid-<appname>
        redirectTo: '/',
        isSecure: false,
        validateFunc: function(session, callback) {
            cache.get(session.sid, function(err, cached) {

                if (err) {
                    return callback(err, false);
                }

                if (!cached) {
                    return callback(null, false);
                }

                return callback(null, true, cached.item.account);
            });
        }
    });
    //Added a separate file for just routes.
    plugin.route(Routes);
    next();
};

exports.register.attributes = {
    pkg: require("./package.json")
};
