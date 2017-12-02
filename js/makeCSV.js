const csv = require('csv-stringify');
const fs = require('fs');
const conditions = require('./conditions.js');
const participant = require('./participant.js');

// let preCons = conditions.getConditions();

let headers = [ ['id',
        'age',
        'sex',
        'state',
        'city',
        'income',
        'bmi',
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

participant.getParticipant(function (participants) {
        for (let i=0; i<participants.length; i++) {
            let cur = participants[i];
            let p = [];
            p.push(cur.id, cur.DOB, cur.sex, cur.state, cur.city);
            let data = [p];
            csv(data, function (err, res) {
                console.log(res);
                fs.appendFile('data.csv', res);
            });
        }
    }
);
