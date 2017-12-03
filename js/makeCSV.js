const csv = require('csv-stringify');
const fs = require('fs');
const pDetails = require('./pDetails.js');
const participant = require('./participant.js');
const quote = require('./quote.js');

let headers = [ ['id',
        'age',
        'sex',
        'state',
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
        's-b',
        'silver',
        'g-s',
        'gold',
        'p-s',
        'platinum',
        'purchased',
        'stateIncome',
        'diffIncome',
        'bmi'] ];

// csv(headers, function (err, res) {
//     fs.writeFile('data/' + process.argv[3] + '.csv', res);
// });

let data = {};

participant.getParticipant(process.argv[2], function (participants) {
    for (let i=0; i<participants.length; i++) {
        let cur = participants[i];
        let p = Array(31).fill(0);
        p[0] = cur.id;
        p[1] = cur.DOB;
        p[2] = cur.sex;
        p[3] = cur.state;
        p[28] = cur.state;
        data[cur.id] = p;
    }

    for (let pID in data) {
        pDetails.getDetails(pID, function(detail) {
            data[pID][4] = detail.ANNUAL_INCOME;
            data[pID][5] = detail.OPTIONAL_INSURED;
            data[pID][6] = detail.HEIGHT;
            data[pID][7] = detail.WEIGHT;
            data[pID][30] = 703 * detail.WEIGHT / (detail.HEIGHT * detail.HEIGHT);
            data[pID][8] = detail.TOBACCO;
            data[pID][9] = detail.MARITAL_STATUS
            if (detail.PRE_CONDITIONS) {
                let conditions = JSON.parse(detail.PRE_CONDITIONS);
                for (let i=0; i<conditions.length; i++) {
                    let c = conditions[i];
                    if (c.Risk_factor === "Low") {
                        // data[pID].push(-1);
                        data[pID][i+10] = 5;
                    } else if (c.Risk_factor === "Medium") {
                        data[pID][i+10] = 10;
                        // data[pID].push(0);
                    } else {
                        data[pID][i+10] = 15;
                        // data[pID].push(1);
                    }
                }
            } else {
                for (let i=10; i<20; i++) {
                   data[pID][i] = 0;
                }
            }
            quote.getQuote(pID, function(quote) {
                data[pID][20] = quote.BRONZE;
                data[pID][21] = quote.SILVER - quote.BRONZE;
                data[pID][22] = quote.SILVER;
                data[pID][23] = quote.GOLD - quote.SILVER;
                data[pID][24] = quote.GOLD;
                data[pID][25] = quote.PLATINUM - quote.GOLD;
                data[pID][26] = quote.PLATINUM;
                if (quote.PURCHASED === 'Bronze') {
                    data[pID][27] = 0;
                } else if (quote.PURCHASED === 'Silver') {
                    data[pID][27] = 1;
                } else if (quote.PURCHASED === 'Gold') {
                    data[pID][27] = 2;
                } else {
                    data[pID][27] = 3;
                }
                let input = [data[pID]];
                fs.appendFile('data/'+ process.argv[3] + '.csv', data[pID].join(',') + '\n');
            });
        });
    }
});
