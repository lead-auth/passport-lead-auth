function Profile(json, raw) {
    this.provider = 'lead-auth';
    this.id = json._id;
    this.username = json.username;
    this.displayName = json.profile.display_name;
    this.providers = json.providers;
    this.name = {
        familyName: json.profile.name.family_name,
        givenName: json.profile.name.given_name
    };

    if (json.profile.email) {
        this.emails = [ { value: json.profile.email.value } ];
    }

    if (json.photo) {
        this.photos = [ { value: json.photo } ];
    }

    this._json = json;
    this._raw = raw;
}

module.exports = Profile;
