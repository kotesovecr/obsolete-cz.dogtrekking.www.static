const fetch = require("node-fetch");
const https = require('https');

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});


module.exports = async function() {
    return fetch("https://rest.dogtrekking.cz/all_actions_news",
                {
                    method: 'GET',
                    agent: httpsAgent,
                })
            .then(res => res.json())
            .then(json => {
                return {
                    actionNews: json
                };
            });
};