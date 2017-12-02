var request = require('request');

/**
 * v_participant/v_participant_detail/v_quotes/v_plan_detail: FROM
 * q: WHERE
 * fl; fields in the collection to retrieve (SELECT)
 *     id, name, city, DOB, address, state, longitude, latitude, sex, collection_id, _version_
 * fq: use the above fields to filter for specfics (HAVING)
 */

/**
 * Search the v_participant API for 'participant information'
 * @state    {string}   state   [The US state to search in]
 * @numRows  {integer}  numRows [Number of results to return]
 * @param    {[string]} fields  [Info per patricipant; see 'fl' above]
 */
function searchParticipants(state, numRows, fields) {
    url = "https://v3v10.vitechinc.com/solr/v_participant/select?indent=on&wt=json" + "&q=state:" + state + "&rows=" + numRows + "&fl=" + fields.join(",");
    request(url, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body', body);
    });
}

searchParticipants("Alabama", "1", ["city, DOB, sex"]);
