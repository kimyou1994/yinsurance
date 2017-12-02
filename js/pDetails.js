var request = require('request');

function getConditions(ids, callback) {
    let url = "https://v3v10.vitechinc.com/solr/v_participant_detail/select?indent=on" + "&q=*:*" + "&wt=json" + "&rows=100";

    // Array to store participant's details
    let pDetails = [];

    request(url, function(error, response, body) {
        if (response.statusCode != 200) {
            console.log("Error occurred with request, aborting");
        }
        let parsedBody = JSON.parse(body);
        let data = parsedBody.response.docs;
        for (let i=0; i<data.length; i++) {
            // Check if person has pre_conditions; if not they are v healthy
            if (data[i].PRE_CONDITIONS) {
                let preCon = JSON.parse(data[i].PRE_CONDITIONS);
                for (let j=0; j<preCon.length; j++) {
                    let condition = preCon[j].condition_name;
                    if (!conditions[condition]) {
                        conditions[condition] = "1";
                    }
                }
            }

        }
        callback(pDetails);
    });
}

exports.getConditions = getConditions;
