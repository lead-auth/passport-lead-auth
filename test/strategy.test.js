var LeadAuthStrategy = require('../lib');
var should = require('chai').should;

describe('Lead Auth strategy', function() {
    var strategy;

    before(function() {
        strategy = new LeadAuthStrategy({
                account: 'my-account',
                clientID: 'CLIENT-ID',
                clientSecret: 'CLIENT-SECRET',
                callbackURL: '/callback'
            },
            function(accessToken, refreshToken, profile, done) {
            }
        );
    });

    it('authorizationURL should have proper account', function() {
        strategy.options.authorizationURL.should.equal('https://my-account.lead-auth.com/authorize');
    });

    it('tokenURL should have proper account', function() {
        strategy.options.tokenURL.should.equal('https://my-account.lead-auth.com/api/token');
    });

    it('profileURL should have proper account', function() {
        strategy.options.profileURL.should.equal('https://my-account.lead-auth.com/api/users/me');
    });

    describe('authenticate', function() {
        it('when there is an error querystring propagate', function(done) {

            strategy.fail = function(challenge, status) {
                challenge.should.equal('some_error');
                done();
            };

            strategy.authenticate({
                query: {
                    error: 'some_error'
                }
            });
        });
    });
});
