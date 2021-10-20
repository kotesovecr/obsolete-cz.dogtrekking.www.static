const fetch = require("node-fetch");
const https = require('https');
const Cache = require("@11ty/eleventy-cache-assets");


const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

module.exports = async function() {
  // let json = await Cache("http://localhost:13124/serie_all", {
    let json = await Cache("https://rest.dogtrekking.cz/serie_all", {
      duration: "1d", // 1 day
      type: "json", // also supports "text" or "buffer"
      fetchOptions: {
        method: 'GET',
        agent: httpsAgent
      }
    });
  
    return {
      series: json
    };
};