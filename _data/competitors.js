const fetch = require("node-fetch");
const https = require('https');
const Cache = require("@11ty/eleventy-cache-assets");

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});


module.exports = async function() {
  // let json = await Cache("http://localhost:13124/get_all_competitors", {
  let json = await Cache("https://rest.dogtrekking.cz/get_all_competitors", {
    duration: "1h", // 1 hour
    type: "json", // also supports "text" or "buffer"
    fetchOptions: {
      method: 'GET',
      agent: httpsAgent
    }
  });

  return {
    competitors: json
  };


  /*
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
  */
};