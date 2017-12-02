var request = require('request');

function getQuote(id, callback) {
    let url = "https://v3v10.vitechinc.com/solr/v_quotes/select?indent=on" + "&q=id:" + id + "&wt=json";

    request(url, function(error, response, body) {
        if (!error) {
            if (response.statusCode != 200) {
                console.log("Error occurred with request, aborting");
            }
            let parsedBody = JSON.parse(body);
            let data = parsedBody.response.docs;
            let quote = data[0];
            delete quote.collection_id;
            delete quote._version_;
            //Numerize purchased
            if (quote.PURCHASED === "Bronze") {
                quote.PURCHASED = 0;
            } else if (quote.PURCHASED === "Silver") {
                quote.PURCHASED = 1;
            } else if (quote.PURCHASED === "Gold") {
                quote.PURCHASED = 2;
            } else {
                quote.PURCHASED = 3;
            }
            callback(quote);
        }
    });
}

exports.getQuote = getQuote;
