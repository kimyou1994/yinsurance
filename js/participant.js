var request = require('request');

function getParticipant(state, callback) {
    let url = "https://v3v10.vitechinc.com/solr/v_participant/select?indent=on" + "&q=state:" + state + "&wt=json" + "&rows=6000";

    // Array to hold participant objects
    let participants = [];
    // Get current year for age calculation
    let curYear = (new Date()).getFullYear();

    request(url, function(error, response, body) {
        if (!error) {

            if (response.statusCode != 200) {
                console.log("Error occurred with request, aborting");
            }
            let parsedBody = JSON.parse(body);
            let data = parsedBody.response.docs;
            for (let i=0; i<data.length; i++) {
                let participant = data[i];
                delete participant.city;
                delete participant.address;
                delete participant.longitude;
                delete participant.latitude;
                delete participant.collection_id;
                delete participant._version_;
                delete participant.name;
                // Get the person's age
                participant.DOB = curYear - parseInt(participant.DOB.substring(0,4));
                participants.push(participant);
                // Numerate text values
                if (participant.sex === "M") {
                    participant.sex = 0;
                } else {
                    participant.sex = 1;
                }
                //states
                if (participant.state === "Alabama") {
                    participant.state = 0;
                } else if (participant.state === "Alaska") {
                    participant.state = 1;
                } else if (participant.state === "Arizona") {
                    participant.state = 2;
                } else if (participant.state === "Arkansas") {
                    participant.state = 3;
                } else if (participant.state === "California") {
                    participant.state = 4;
                } else if (participant.state === "Colorado") {
                    participant.state = 5;
                } else if (participant.state === "Connecticut") {
                    participant.state = 6;
                } else if (participant.state === "Delaware") {
                    participant.state = 7;
                } else if (participant.state === "Florida") {
                    participant.state = 8;
                } else if (participant.state === "Georgia") {
                    participant.state = 9;
                } else if (participant.state === "Hawaii") {
                    participant.state = 10;
                } else if (participant.state === "Idaho") {
                    participant.state = 11;
                } else if (participant.state === "Illinois") {
                    participant.state = 12;
                } else if (participant.state === "Indiana") {
                    participant.state = 13;
                } else if (participant.state === "Iowa") {
                    participant.state = 14;
                } else if (participant.state === "Kansas") {
                    participant.state = 15;
                } else if (participant.state === "Kentucky") {
                    participant.state = 16;
                } else if (participant.state === "Louisiana") {
                    participant.state = 17;
                } else if (participant.state === "Maine") {
                    participant.state = 18;
                } else if (participant.state === "Maryland") {
                    participant.state = 19;
                } else if (participant.state === "Massachusetts") {
                    participant.state = 20;
                } else if (participant.state === "Michigan") {
                    participant.state = 21;
                } else if (participant.state === "Minnesota") {
                    participant.state = 22;
                } else if (participant.state === "Mississippi") {
                    participant.state = 23;
                } else if (participant.state === "Missouri") {
                    participant.state = 24;
                } else if (participant.state === "Montana") {
                    participant.state = 25;
                } else if (participant.state === "Nebraska") {
                    participant.state = 26;
                } else if (participant.state === "Nevada") {
                    participant.state = 27;
                } else if (participant.state === "New Hampshire") {
                    participant.state = 28;
                } else if (participant.state === "New Jersey") {
                    participant.state = 29;
                } else if (participant.state === "New Mexico") {
                    participant.state = 30
                } else if (participant.state === "New York") {
                    participant.state = 31;
                } else if (participant.state === "North Carolina") {
                    participant.state = 32;
                } else if (participant.state === "North Dakota") {
                    participant.state = 33;
                } else if (participant.state === "Ohio") {
                    participant.state = 34;
                } else if (participant.state === "Oklahoma") {
                    participant.state = 35;
                } else if (participant.state === "Oregon") {
                    participant.state = 36;
                } else if (participant.state === "Pennsylvania") {
                    participant.state = 37;
                } else if (participant.state === "Rhode Island") {
                    participant.state = 38;
                } else if (participant.state === "South Carolina") {
                    participant.state = 39;
                } else if (participant.state === "South Dakota") {
                    participant.state = 40;
                } else if (participant.state === "Tennessee") {
                    participant.state = 41;
                } else if (participant.state === "Texas") {
                    participant.state = 42;
                } else if (participant.state === "Utah") {
                    participant.state = 43;
                } else if (participant.state === "Vermont") {
                    participant.state = 44;
                } else if (participant.state === "Virginia") {
                    participant.state = 45;
                } else if (participant.state === "Washington") {
                    participant.state = 46;
                } else if (participant.state === "West Virginia") {
                    participant.state = 47;
                } else if (participant.state === "Wisconsin") {
                    participant.state = 48;
                } else {
                    participant.state = 49;
                }
            }
            callback(participants);
        } else {
            console.log(error);
        }
    });
}

exports.getParticipant = getParticipant;
