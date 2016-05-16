var should = require('chai').should();
var leadAuthProfile = require('./fixtures/profile');
var Profile = require('../lib/profile');

describe('Profile', function() {
    var profile;

    before(function() {
        profile = new Profile(leadAuthProfile);
    });


    it('should parse profile', function() {
        profile.provider.should.equal('lead-auth');
        profile.username.should.equal('email@example.com');
        profile.name.givenName.should.equal('Name');
        profile.name.familyName.should.equal('Surname');
    });

    it('should map emails', function() {
        profile.emails[ 0 ].value.should.equal('email@example.com');
    });

    it('should map providers', function() {
        profile.should.have.property('providers');
        profile.providers.should.have.length(2);
        profile.providers[ 0 ].name.should.equal('username-password');
        profile.providers[ 1 ].name.should.equal('facebook');
        profile.providers[ 1 ].should.have.property('access_token');
        profile.providers[ 1 ].should.have.property('profile');
    });
});
