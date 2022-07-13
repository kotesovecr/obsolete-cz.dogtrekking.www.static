const { default: fetch } = require("node-fetch");
const moment = require("moment");
const stringify = require('javascript-stringify').stringify;
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");


var globalI = 0;

module.exports = {
    dir: {
        data: "_data",
        output: "dist"
    }
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("docs");

  eleventyConfig.addPlugin(syntaxHighlight, {
    lineSeparator: "\n"
  });

  eleventyConfig.addFilter('log', value => {
    console.log(value)
  });

  eleventyConfig.addFilter("stringify", function(obj) {
    return stringify(obj);
  });

  // limit filter
  eleventyConfig.addFilter("limit", function(array, limit) {
    return array.slice(0, limit);
  });

  eleventyConfig.addFilter("count", function(objs) {
    if (typeof (objs) === 'undefined' || objs === null)
      return 0;

    return objs.length;
  });

  eleventyConfig.addFilter("max", function(objs) {
    if (typeof(objs) === "undefined" || objs === null)
      return 9999;

    let sorted = objs.sort((a, b) => {
      if (a < b) {
        return -1;
      }
      else if (a > b) {
        return 1;
      }
      return 0;
    });

    return sorted[sorted.length - 1];
  });

  eleventyConfig.addFilter("min", function(objs) {
    if (typeof(objs) === "undefined" || objs === null)
      return -1;

    let sorted = objs.sort((a, b) => {
      if (a < b) {
        return 1;
      }
      else if (a > b) {
        return -1;
      }
      return 0;
    });

    return sorted[sorted.length-1];
  });

  eleventyConfig.addFilter("countOfKm", function(actions) {
    if (typeof(actions) === 'undefined' || actions === null)
      return 0;

    let sumOfKm = 0;
    actions.forEach(action => {
      if (typeof (action.distance) !== 'undefined' && action.distance !== null) {
        sumOfKm += action.distance;
      }
    });

    return sumOfKm;
  });

  eleventyConfig.addFilter("countOfElevatedM", function(actions) {
    if (typeof(actions)  === 'undefined' || actions === null)
      return 0;

    let sumOfElevatedM = 0;

    actions.forEach(action => {
      if (typeof (action.elevation) !== 'undefined' && action.elevation !== null) {
        sumOfElevatedM += action.elevation;
      }
    });

    return sumOfElevatedM;
  });

  eleventyConfig.addFilter("onlyValidActions", function(actions) {
    if (typeof(actions) === "undefined" || actions === null)
      return [];

    let tmp = [...actions];

    tmp.sort((a, b) => {
      if (a.action_start > b.action_start) {
        return 1;
      }
      else if (a.action_start < b.action_start) {
        return -1;
      }

      return 0;
    });

    let tmp2 = tmp.filter(action => {
      if (typeof(action.ActionCanceled) !== 'undefined' && action.ActionCanceled !== 0 ) {
        return false;
      }

      if (typeof(action.action_canceled) !== 'undefined' && action.action_canceled !== 0) {
        return false;
      }

      return true;
    });

    return tmp2;
  });

  eleventyConfig.addFilter("averageSpeed", function(actions) {
    if (typeof(actions)  === 'undefined' || actions === null)
      return 0;

    let averageSpeed = 0.0;

    let distance = 0;
    let sumTimes = 0;
    actions.forEach(action => {
      if (typeof(action.distance) !== 'undefined' 
          && typeof(action.action_canceled) !== 'undefined' 
          && action.action_canceled === 0
          && action.distance > 0
          && action.distance !== null 
          && action.start !== null 
          && action.start !== ""
          && action.finish !== null
          && action.finish !== "") {

        distance += action.distance;

        let start = moment(action.start, "YYYY-MM-DD HH:mm:ss");
        let finish = moment(action.finish, "YYYY-MM-DD HH:mm:ss");
        
        var duration = moment.duration(finish.diff(start));
        sumTimes += duration.asHours();
      }
    });

    averageSpeed = distance / sumTimes

    if (! isNaN(averageSpeed))
      return Math.round((averageSpeed + Number.EPSILON) * 100) / 100;
    else
      return "---";
  });

  eleventyConfig.addFilter("avgSpeedPerAction", function(action) {
    if (typeof(action) === "undefined" || action === null)
      return "";

    if (typeof(action.distance) === "undefined" || action.distance === 0)
      return "";

    let start = moment(action.start, "YYYY-MM-DD HH:mm:ss");
    let finish = moment(action.finish, "YYYY-MM-DD HH:mm:ss");

    let duration = moment.duration(finish.diff(start));

    let avgSpeed = action.distance / duration.asHours();

    return Math.round((avgSpeed + Number.EPSILON) * 100) / 100;
  });


  eleventyConfig.addFilter("iconOfFinishing", function(action) {
    if (action.order > 0 && action.order <= 3)
      return "fa fa-trophy";
    
    if (action.order !== 0)
      return "fas fa-bone";
    
    return "fas fa-times";
  });

// --------------------------------------------------------------------------------------------------

  eleventyConfig.addFilter("incInit", function(value) {
    globalI = value;
    return "";
  });

  eleventyConfig.addFilter("incBy", function(value) {
    globalI += value;
    return globalI;
  });

// --------------------------------------------------------------------------------------------------

  eleventyConfig.addFilter("getPointsForRace", function(results, race) {
    let apprResults = results.filter(ele => ele.RaceId == race.Id);
    if (apprResults.length === 0)
      return 0;

    return apprResults[0].Points;
  });

  eleventyConfig.addFilter("theBests_countOfActions", function(competitors, count=-1) {
    let sortedByCountOfActions = competitors.sort((a, b) => {
      if (a.actions === null)
        return 1;

      if (b.actions === null)
        return -1;

      if (a.actions.length < b.actions.length)
         return 1;
      else if (a.actions.length > b.actions.length)
         return -1;

      return 0;
    });

    if (count === -1)
      return sortedByCountOfActions;

    let ret = [];
    for (let i = 0; i < count; i++) {
      ret = [...ret, sortedByCountOfActions[i]];
    }

    return ret;
  });

  eleventyConfig.addFilter("theBests_placed", function(competitors) {
    return competitors;
  });

  eleventyConfig.addFilter("theBests_absolvedKilometres", function(competitors) {
    return competitors;
  });

  eleventyConfig.addFilter("theBests_averageSpeed", function(competitors) {
    return competitors;
  });

// --------------------------------------------------------------------------------------------------
  eleventyConfig.addFilter("seriesCompetitorsForCategory", function(results, idOfCategory) {
    let ret = [];
    
    results.Categories.forEach(category => {
      if (category.Id === idOfCategory) {
        ret = category.Competitors;
      }
    });

    return ret;
  });

  eleventyConfig.addFilter("enterActionName", function(idAction, actions) {
    return actions.filter((action) => action.Id === idAction)[0].Name;
  });

  eleventyConfig.addFilter("enterActionStart", function(idAction, actions) {
    return actions.filter((action) => action.Id === idAction)[0].Start;
  });

  eleventyConfig.addFilter("action", function(idAction, actions) {
    return actions.filter((action) => action.Id == idAction)[0];
  });

  eleventyConfig.addFilter("actionLink", function(action) {
    let ret = action.From + action.Name;
    return ret;
  });

  eleventyConfig.addFilter("dateToString", function(dateToString) {
    return moment(dateToString).format("DD.MM.YYYY HH:mm:ss");
  });

  eleventyConfig.addFilter("actionDateNoYear", function(date) {
    return moment(date).format("D. M.");
  });

  eleventyConfig.addFilter("actionDate", function(date) {
    return moment(date).format("D. M. YYYY");
  });

  eleventyConfig.addFilter("checkActionIsActual", function(date) {
    let mmt = moment(date);

    let now = moment();

    if (mmt >= now) {
      return "arrow-right-green";
    }
    else {
      return "arrow-left-red";
    }
  });

  eleventyConfig.addFilter("colorForMonth", function(date) {
    let mmt = moment(date);

    switch (mmt.month()) {
      case 1: return '#f466ba';
      case 2: return '#e37576';
      case 3: return '#f7a484';
      case 4: return '#f6b679';
      case 5: return '#f2f37e';
      case 6: return '#d2f08e';
      case 7: return '#9fdc96';
      case 8: return '#79c9ca';
      case 9: return '#7675f4';
      case 10: return '#8d71c6';
      case 11: return '#ac77c7';
      case 12: return '#d186be';

      default: return '#ffffff';
    }
  });

  eleventyConfig.addFilter("actionYear", function(date) {
    return moment(date).format("YYYY");
  });

  eleventyConfig.addFilter("wdTime", function(datetime) {
    let ret = "";
    let mmt = moment(datetime);

    if (mmt.isValid() === false) {
      return "---";
    }
    
    switch (mmt.isoWeekday()) {
      case 1: ret = "Po"; break;
      case 2: ret = "Út"; break;
      case 3: ret = "St"; break;
      case 4: ret = "Čt"; break;
      case 5: ret = "Pá"; break;
      case 6: ret = "So"; break;
      case 7: ret = "Ne"; break;
    }

    return ret + " " + mmt.format("HH:mm");
  });

  eleventyConfig.addFilter("simpleTime", function(time) {
    let array = time.split(":");
    if (array.length === 1)
      return time;

    if (array.length > 2 && array[2] > 0) {
      return "" + array[0] + ":" + array[1] + ":" + array[2];
    }
    else {
      return "" + array[0] + ":" + array[1];
    }
  });

  eleventyConfig.addFilter("firstFour", function(value) {
    return value.substring(0, 4);
  });

  eleventyConfig.addFilter("sortedNews", function(news) {
    return news.sort((a, b) => {
      if (a.created < b.created)
        return 1;
      if (a.created > b.created)
        return -1;

      return 0;
    });
  });

  eleventyConfig.addFilter("sortedActions", function(actions) {
    return actions.sort( function(a, b) {
      if (typeof(a.From) == "undefined") {
        console.log(a);
        return -1;
      }

      if (typeof(b.From) == "undefined") {
        console.log(b);
        return 1;
      }

      if (a.From > b.From) {
        return 1;
      }
      if (a.From < b.From) {
        return -1;
      }

      return 0;
    });
  });

  eleventyConfig.addFilter("checkForActionCanceled", function(actionCanceled) {
    return actionCanceled === 1 ? 'canceledAction' : '';
  });

  eleventyConfig.addFilter("translateDayPart", function(daypart) {
    switch (daypart) {
      case "ThursdaySupper": return "Čtvrteční večeře";
      case "FridayBreakfast": return "Páteční snídaně";
      case "FridayLunch": return "Páteční oběd";
      case "FridaySupper": return "Páteční večeře";
      case "SaturdayBreakfast": return "Sobotní snídaně";
      case "SaturdayLunch": return "Sobotní oběd";
      case "SaturdaySupper": return "Sobotní večeře";
      case "SundayBreakfast": return "Nedělní snídaně";
      case "SundayLunch": return "Nedělní oběd";
      
      default: return "Neznámé jídlo";
    }
  });

  eleventyConfig.addFilter("orderByDayPart", function(foods) {
    let result = [];

    result.push(...foods.filter(x => x.day_part === "ThursdaySupper"));
    result.push(...foods.filter(x => x.day_part === "FridayBreakfast"));
    result.push(...foods.filter(x => x.day_part === "FridayLunch"));
    result.push(...foods.filter(x => x.day_part === "FridaySupper"));
    result.push(...foods.filter(x => x.day_part === "SaturdayBreakfast"));
    result.push(...foods.filter(x => x.day_part === "SaturdayLunch"));
    result.push(...foods.filter(x => x.day_part === "SaturdaySupper"));
    result.push(...foods.filter(x => x.day_part === "SundayBreakfast"));
    result.push(...foods.filter(x => x.day_part === "SundayLunch"));

    return result;
  });

  eleventyConfig.addFilter("shuffle", function(array) {
    var currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  });
};
