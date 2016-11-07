var colors = require('colors');
var apikey = ''; // NOTE: <-- Add your Bungie API Key here.

module.exports = {
  getKey: function() {
		if (apikey) {
			return apikey;
		} else {
			console.log('ERROR: '.red + 'Missing or invalid API key in apiKey.js');
			return;
		}
  }
};
