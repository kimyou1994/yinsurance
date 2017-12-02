const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const request = require('request');

const app = express();
const PORT = process.env.PORT || 5000;

const ML_URL = '';

// Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Get the predicted premium price for the user
app.post('/api/premium', function (req, res) {
    let urlParams = {

    };
    // turn params object into a proper query string and create the URL
    queryString = Object.keys(urlParams).map(val =>
        encodeURIComponent(val) + '=' + encodeURIComponent(urlParams[val])
    ).join('&');
    let searchURL = ML_URL + queryString;
    // send parameters to classifier and return result
    request(searchURL, function(error, resp, body) {
        let parsedBody = JSON.parse(body);
        parsedBody.message = parsedBody.list.q;
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(parsedBody));
    });
});

// Serve the front-end web form for users
app.get('*', function(req, res) {
    response.sendFile(path.resolve(__dirname, '../client', 'index.html'));
});

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});
