const fetch = require("node-fetch");
const actionYears = require('./years');

const https = require('https');

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});


module.exports = async function() {
  let allActions = [];

  return Promise.all(actionYears.map(aY => fetch(`https://rest.dogtrekking.cz/actions/${aY}`
                                          , {
                                            method: 'GET',
                                            agent: httpsAgent,
                                          })))
         .then(actions =>
                Promise.all(actions.map(action => action.json())))
                .then(jsons => {
                            jsons.map(json => {
                              json.ActionsInfo.map(action => {
                                allActions = [...allActions, action];
                              });
                            });

                            return allActions;
                          }
                  )
                  .then(allActions => {
                    Promise.all(allActions.map(actionInfo => fetch(`https://rest.dogtrekking.cz/results/${actionInfo.Id}`, {
                      method: 'GET',
                      agent: httpsAgent,
                    })))
                    .then(actionsResults => 
                      Promise.all(actionsResults.map(actionResult => actionResult.json()))
                      .then(jsons => {
                        return jsons;
                      })
                    )
                    .then(jsons => {
                      jsons.map(json => {
                        let theAction = allActions.find(ele => ele.Id === json.IdAction);
                        theAction.Results = json;
                      });
                    });

                    Promise.all(allActions.map(actionInfo => fetch(`https://rest.dogtrekking.cz/news/${actionInfo.Id}/aaa`, {
                      method: 'GET',
                      agent: httpsAgent,
                    })))
                    .then(actionsResults => 
                      Promise.all(actionsResults.map(actionResult => actionResult.json()))
                      .then(jsons => {
                        return jsons;
                      })
                    )
                    .then(jsons => {
                      jsons.map(json => {
                        let theAction = allActions.find(ele => ele.Id === json.IdAction);
                        theAction.News = json;
                      });
                    });
                  })
                  .then(actionResults => {
                    return allActions;
                  });
};