/* eslint-disable */
import axios from 'axios';
import htmlToJson from 'html-to-json';

export const POPULATE_USER_STATS = 'POPULATE_USER_STATS';

/* helper function to scrape user FCC stats while we design a better solution: */
export const scrapeFccStats = user => dispatch => {
  axios.get(`https://www.freecodecamp.org/${user}`).then(html => {

    // FIRST CHALLENGE COMPLETED
    const firstChallenge = htmlToJson.parse(html.data, {
      'text': (doc) => {
        return doc.find('div').text();
      }
    }).then(result => {
      if (!/Challenges\s*Completed/.test(result.text)) {
        return "Sorry, no data";
      } else {
        result = result.text.match(/Challenges\s*Completed.*?\d{4}/)[0];
        return result.slice(-12);
      }
    }).catch(err => {
      return null;
    });

    // TOTAL CHALLENGES COMPLETED
    const totalChallenges = htmlToJson.parse(html.data, function() {
      return this.map('tr .col-xs-5', (item) => {
        return item.text();
      });
    }).then(items => {
      return items.length;
    }).catch(err => {
      return null;
    });

    // LONGEST STREAK
    const longestStreak = htmlToJson.parse(html.data, {
      'text': function(doc) {
        return doc.find('h4').text();
      }
    }).then(result => {
      result = result.text.match(/Longest\sStreak:\s\d+/)[0];
      var dayOrDays = result.slice(16) === "1"
        ? " Day"
        : " Days";
      return result.slice(16) + dayOrDays;
    }).catch(err => {
      return null;
    });

    // CURRENT STREAK
    const currentStreak = htmlToJson.parse(html.data, {
      'text': function(doc) {
        return doc.find('h4').text();
      }
    }).then(result => {
      result = result.text.match(/Current\sStreak:\s\d+/)[0];
      var dayOrDays = result.slice(16) === "1"
        ? " Day"
        : " Days";
      return result.slice(16) + dayOrDays;
    }).catch(err => {
      return null;
    });

    // BROWNIE POINTS
    const browniePoints = htmlToJson.parse(html.data, {
      'text': function(doc) {
        return doc.find('h1').text();
      }
    }).then(result => {
      result = result.text.match(/\[\s\d*\s\]/)[0];
      return result.slice(2, -2);
    }).catch(err => {
      return null;
    });

    Promise.all([
      firstChallenge,
      totalChallenges,
      longestStreak,
      currentStreak,
      browniePoints
    ]).then((values) => {
      dispatch({
        type: POPULATE_USER_STATS,
        payload: {
          user,
          stats: {
            browniePoints: values[4],
            currentStreak: values[3],
            firstChallenge: values[0],
            longestStreak: values[2],
            totalChallenges: values[1],
          }
        }
      })
    }).catch(err => console.warn(
      'Something went wrong fetching user FCC stats...')
    );
  });
}
