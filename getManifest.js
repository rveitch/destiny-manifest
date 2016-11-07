#!/usr/bin/env node

var fs = require('fs');
var request = require('request');
var unzip = require('unzip');
var colors = require('colors');
var logSuccess = 'Success: '.green;
var apiKey = require('./apiKey').getKey();

console.log('Fetching Manifest');

request({
  headers: {
    'X-API-Key': apiKey
  },
  uri: 'http://www.bungie.net/platform/Destiny/Manifest/',
  method: 'GET'
}, onManifestRequest);

function onManifestRequest(error, response, body) {
  var parsedResponse = JSON.parse(body);
	var manifestName = parsedResponse.Response.mobileWorldContentPaths.en;
  var manifestFile = fs.createWriteStream("manifest/manifest.zip");

  request
    .get('https://www.bungie.net' + parsedResponse.Response.mobileWorldContentPaths.en)
    .pipe(manifestFile)
    .on('close', onManifestDownloaded);

		onManifestUnzipped(manifestName);
}

function onManifestDownloaded() {
  fs.createReadStream('manifest/manifest.zip')
    .pipe(unzip.Parse())
    .on('entry', function(entry) {
      var ws = fs.createWriteStream('manifest/' + entry.path);
      entry.pipe(ws);
    });
}

function onManifestUnzipped(manifestName) {
	var manifestName = manifestName.split('/');
	var manifestName = manifestName[manifestName.length-1];
	console.log(logSuccess + 'Manifest Downloaded: ' + manifestName.cyan);
	var wstream = fs.createWriteStream('manifest/manifestname.txt');
	wstream.write(manifestName);
	wstream.end();
	console.log(logSuccess + 'Manifest Name stored.\n');
}
