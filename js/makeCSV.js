const csv = require('csv-stringify');
const fs = require('fs');
const pDetails = require('./pDetails.js');
const participant = require('./participant.js');

// let preCons = conditions.getConditions();

let headers = [ ['id',
        'age',
        'sex',
        'state',
        'city',
        'income',
        'insuredAmount',
        'height',
        'weight',
        'smoke',
        'married',
        'hepB',
        'cPalsy',
        'diarrhea',
        'tachycardia',
        'apnea',
        'fracture',
        'heartBeat',
        'type2',
        'hiv',
        'hemorrhage'] ];

csv(headers, function (err, res) {
    console.log(res);
    fs.writeFile('data.csv', res);
});

let data = {};

participant.getParticipant("Washington", function (participants) {
    for (let i=0; i<participants.length; i++) {
        let cur = participants[i];
        let p = [];
        p.push(cur.id, cur.DOB, cur.sex, cur.state, cur.city);
        data[cur.id] = p;
    }

    for (let pID in data) {
        pDetails.getDetails(pID, function(detail) {
            data[pID].push(detail.ANNUAL_INCOME, detail.OPTIONAL_INSURED, detail.HEIGHT, detail.WEIGHT, detail.TOBACCO, detail.MARITAL_STATUS);
            if (detail.PRE_CONDITIONS) {
                let conditions = JSON.parse(detail.PRE_CONDITIONS);
                for (let i=0; i<conditions.length; i++) {
                    let c = conditions[i];
                    if (c.Risk_factor === "Low") {
                        data[pID].push(-1);
                    } else if (c.Risk_factor === "Medium") {
                        data[pID].push(0);
                    } else {
                        data[pID].push(1);
                    }
                }
            } else {
                data[pID].push(-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
            }
            let input = [data[pID]];
            fs.appendFile('data.csv', data[pID].join(',') + '\n');
        });
    }
});
