var request = require('request');

function getParticipant(callback) {
    let url = "https://v3v10.vitechinc.com/solr/v_participant/select?indent=on" + "&q=*:*" + "&wt=json" + "&rows=100";

    // Array to hold participant objects
    let participants = [];
    // Get current year for age calculation
    let curYear = (new Date()).getFullYear();

    request(url, function(error, response, body) {
        if (response.statusCode != 200) {
            console.log("Error occurred with request, aborting");
        }
        let parsedBody = JSON.parse(body);
        let data = parsedBody.response.docs;
        for (let i=0; i<data.length; i++) {
            let participant = data[i];
            delete participant.address;
            delete participant.longitude;
            delete participant.latitude;
            delete participant.collection_id;
            delete participant._version_;
            delete participant.name;
            // Get the person's age
            participant.DOB = curYear - parseInt(participant.DOB.substring(0,4));
            participants.push(participant);
        }
        callback(participants);
    });
}

exports.getParticipant = getParticipant;
