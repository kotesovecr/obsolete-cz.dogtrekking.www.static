const fetch = require("node-fetch");
const https = require('https');

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});


module.exports = async function() {
    //return fetch("http://localhost:13124/get_all_competitors")
    return fetch("https://rest.dogtrekking.cz/get_all_competitors", {
        method: 'GET',
        agent: httpsAgent,
      })
            .then(res => res.json())
            .then(json => {
                return {
                    competitors: json
                };
            });
};