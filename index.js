const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const jwtAuthz = require('express-jwt-authz');
const checkScopes = permissions => jwtAuthz(permissions);
app.use(jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 25,
    jwksUri: 'https://dev-ew42azyb.us.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://node-js-api.com',
  issuer: 'https://dev-ew42azyb.us.auth0.com/',
  algorithms: ['RS256']
}));

app.get('/authtest', (req, res) => {
  res.json({ loggedin: true });
});

app.get('/blogs', checkScopes(['read:blog']), (req, res) => {
    res.json({ readBlogAccess: true });
});

app.post('/blogs', checkScopes(['create:blog']), (req, res) => {
    res.json({ createBlogAccess: true });
});

app.listen(3000);