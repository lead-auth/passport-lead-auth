var OAuth2Strategy = require('passport-oauth2');
var util = require('util');
var Profile = require('./profile');


/**
 * `Strategy` constructor.
 *
 * The Lead Auth authentication strategy authenticates requests by delegating to
 * Lead Auth using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `cb`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occurred, `err` should be set.
 *
 * Options:
 *   - `account`       your account in Lead Auth
 *   - `clientID`      your Lead Auth application's App ID
 *   - `clientSecret`  your Lead Auth application's App Secret
 *   - `callbackURL`   URL to which Lead Auth will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new LeadAuthStrategy({
 *         account: 'my-account',
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/lead-auth/callback'
 *       },
 *       function(accessToken, refreshToken, profile, cb) {
 *         User.findOrCreate(..., function (err, user) {
 *           cb(err, user);
 *         });
 *       }
 *     ));
 *
 * @constructor
 * @param {object} options
 * @param {function} verify
 * @access public
 */
function Strategy(options, verify) {
    [
        'account',
        'clientID',
        'clientSecret',
        'callbackURL'
    ]
        .forEach(function(value) {
            if (!options[ value ]) {
                throw new TypeError('LeadAuthStrategy requires ' + value + ' option');
            }
        });

    var url = 'https://' + options.account + '.lead-auth.com';

    this.options = {
        authorizationURL: options.authorizationURL || url + '/authorize',
        tokenURL: options.tokenURL || url + '/api/token',
        profileURL: options.profileURL || url + '/api/users/me',
        clientID: options.clientID,
        clientSecret: options.clientSecret,
        callbackURL: options.callbackURL
    };

    this.name = 'lead-auth';

    OAuth2Strategy.call(this, this.options, verify);
}

// Inherit from `OAuth2Strategy`.
util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.authenticate = function(req, options) {
    if (req.query && req.query.error) {
        return this.fail(req.query.error);
    }
    OAuth2Strategy.prototype.authenticate.call(this, req, options);
};

/**
 * Retrieve user profile from Lead Auth.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`           always set to `lead-auth`
 *   - `id`                 the user's Lead Auth ID
 *   - `username`           the user's Lead Auth username
 *   - `displayName`        the user's full name
 *   - `name`               the user's given and family names
 *   - `photo`              the user's photo
 *   - `emails`             the proxied or contact email address granted by the user
 *   - `providers`          the list of all providers where user is signed in
 *   - `signed_in_provider` the user's signed in provider
 *
 * @param {string} accessToken
 * @param {function} done
 * @access protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
    this._oauth2.get(this.options.profileURL, accessToken, function(err, body, res) {
        if (err) {
            return done(new Error('failed to fetch user profile', err));
        }

        var json;
        var profile;

        try {
            json = JSON.parse(body);
        } catch (e) {
            return done(e);
        }

        profile = new Profile(json, body);

        done(null, profile);
    });
};

// Expose constructor.
module.exports = Strategy;
