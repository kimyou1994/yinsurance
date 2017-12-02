const csv = require('csv-stringify');
const fs = require('fs');
const pDetails = require('./pDetails.js');
const participant = require('./participant.js');
const quote = require('./quote.js');

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
        'hemorrhage',
        'bronze',
        'silver',
        'gold',
        'platinum',
        'purchased'] ];

csv(headers, function (err, res) {
    console.log(res);
    fs.writeFile('data.csv', res);
});

let data = {};

participant.getParticipant("Washington", function (participants) {
    for (let i=0; i<participants.length; i++) {
        let cur = participants[i];
        // let p = [];
        let p = Array(26).fill(0);
        p[0] = cur.id;
        p[1] = cur.DOB;
        p[2] = cur.sex;
        p[3] = cur.state;
        p[4] = cur.city;
        // p.push(cur.id, cur.DOB, cur.sex, cur.state, cur.city);
        data[cur.id] = p;
    }

    for (let pID in data) {
        pDetails.getDetails(pID, function(detail) {
            // data[pID].push(detail.ANNUAL_INCOME, detail.OPTIONAL_INSURED, detail.HEIGHT, detail.WEIGHT, detail.TOBACCO, detail.MARITAL_STATUS);
            data[pID][5] = detail.ANNUAL_INCOME;
            data[pID][6] = detail.OPTIONAL_INSURED;
            data[pID][7] = detail.HEIGHT;
            data[pID][8] = detail.WEIGHT;
            data[pID][9] = detail.TOBACCO;
            data[pID][10] = detail.MARITAL_STATUS
            if (detail.PRE_CONDITIONS) {
                let conditions = JSON.parse(detail.PRE_CONDITIONS);
                for (let i=0; i<conditions.length; i++) {
                    let c = conditions[i];
                    if (c.Risk_factor === "Low") {
                        // data[pID].push(-1);
                        data[pID][i+11] = -1;
                    } else if (c.Risk_factor === "Medium") {
                        data[pID][i+11] = 0;
                        // data[pID].push(0);
                    } else {
                        data[pID][i+11] = 1;
                        // data[pID].push(1);
                    }
                }
            } else {
                for (let i=11; i<21; i++) {
                   data[pID][i] = -1;
                }
                // data[pID].push(-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
            }
            quote.getQuote(pID, function(quote) {
                data[pID][21] = quote.BRONZE;
                data[pID][22] = quote.SILVER;
                data[pID][23] = quote.GOLD;
                data[pID][24] = quote.PLATINUM;
                data[pID][25] = quote.PURCHASED;
                let input = [data[pID]];
                fs.appendFile('data.csv', data[pID].join(',') + '\n');
            });
        });
    }
});
