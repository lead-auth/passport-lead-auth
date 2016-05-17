# passport-lead-auth


[Passport](http://passportjs.org/) strategy for authenticating with [Lead-Auth](https://lead-auth.com/)

This module lets you authenticate using Lead Auth in your Node.js applications.
By plugging into Passport, Lead Auth authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-lead-auth

## Usage

#### Create an Application

Before using `passport-lead-auth`, you must register an application with
Lead Auth.  If you have not already done so, a new application can be created at
[Lead Auth](https://lead-auth.com/).  Your application will
be issued an app ID and app secret, which need to be provided to the strategy.
You will also need to configure a redirect URI which matches the route in your
application.

#### Configure Strategy

The Lead Auth authentication strategy authenticates users using a Lead Auth
account and OAuth 2.0 tokens.  The app ID and secret obtained when creating an
application are supplied as options when creating the strategy.  The strategy
also requires a `verify` callback, which receives the access token and optional
refresh token, as well as `profile` which contains the authenticated user's 
profile.  The `verify` callback must call `cb` providing a user to
complete authentication.

```js
passport.use(new LeadAuthStrategy({
    account: LEAD_AUTH_ACCOUNT,
    clientID: LEAD_AUTH_APP_ID,
    clientSecret: LEAD_AUTH_APP_SECRET,
    callbackURL: "http://localhost/auth/lead-auth/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ leadAuthId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'lead-auth'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
app.get('/auth/lead-auth',
  passport.authenticate('lead-auth'));

app.get('/auth/lead-auth/callback',
  passport.authenticate('lead-auth', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
```


## Contributing

#### Tests

The test suite is located in the `test/` directory.  All new features are expected to have corresponding test cases.  Ensure that the complete test suite passes by executing:

```
npm test
```

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section.

## Author

[Lead Auth](https://lead-auth.com/)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
