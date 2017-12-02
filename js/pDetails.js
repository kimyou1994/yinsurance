var request = require('request');

function getDetails(id, callback) {
    let url = "https://v3v10.vitechinc.com/solr/v_participant_detail/select?indent=on" + "&q=id:" + id + "&wt=json";

    request(url, function(error, response, body) {
        if (!error) {
            if (response.statusCode != 200) {
                console.log("Error occurred with request, aborting");
            }
            let parsedBody = JSON.parse(body);
            let data = parsedBody.response.docs;
            let detail = data[0];
            delete detail.EMPLOYMENT_STATUS;
            delete detail.PEOPLE_COVERED;
            delete detail.collection_id;
            delete detail._version_;
            if (detail.TOBACCO === "No") {
                detail.TOBACCO = 0;
            } else {
                detail.TOBACCO = 1;
            }
            if (detail.MARITAL_STATUS === "S") {
                detail.MARITAL_STATUS = 0;
            } else {
                detail.MARITAL_STATUS = 1;
            }
            callback(detail);
        } else {
            console.log(error);
        }
    });
}

exports.getDetails = getDetails;
