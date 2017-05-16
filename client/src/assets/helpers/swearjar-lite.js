import badWords from './offensive-content/prohibited-lang';

// swearjar-node-lite => modified from OG package by no-stack-dub-sack
var swearjar = {

  _badWords: {},

  scan: function (text, callback) {
    var word, key, match;
    var regex = /\w+/g

    while (match = regex.exec(text)) {
      word = match[0];
      key  = word.toLowerCase();

      if (key in this._badWords && Array.isArray(this._badWords[key])) {
        if (callback(word, match.index, this._badWords[key]) === false) {
          break;
        }
      } else {
        /******* added else statement to catch compound bad words and plurals such as
        "no fu*ks given" and "fu*ksh*t" without having to add each to default list */
        for (let badWord in this._badWords) {
          if (key.search(badWord) > -1) {
            if (callback(key, match.index, this._badWords[badWord]) === false) {
              break;
            }
          }
        }
      }
    }
  },

  profane: function (text) {
    var profane = false;

    this.scan(text, function (word, index, categories) {
      profane = true;
      return false; // Stop on first match
    });

    return profane;
  },

  censor: function (text) {
    var censored = text;

    this.scan(text, function (word, index, categories) {
      censored = censored.substr(0, index) +
                  word.replace(/\S/g, '*') +
                  censored.substr(index + word.length);
    });

    return censored;
  },

  setBadWords: function (badWords) {
    this._badWords = badWords || {};
  }
};

swearjar._badWords = badWords;

export default swearjar;
