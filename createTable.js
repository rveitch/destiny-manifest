#!/usr/bin/env node
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var colors = require('colors');
var program = require('commander');
var logSuccess = 'Success: '.green;
var localManifestDB = './manifest/localManifest.db';
var manifestName = fs.readFileSync('manifest/manifestname.txt','utf8');
var tableNamesArray = fs.readFileSync('manifest/tablenames.json','utf8');

// Define Command Line Arguments
program
  .option('-t, --table <value>', 'Manifest table name')
  .parse(process.argv);

var tableName = (program.table) ? program.table : 'DestinyItemCategoryDefinition';
console.log('Importing Table: ' + tableName.magenta);

// Start the scripts
unpackManifestTable(manifestName);

//
// Parses a table from the Bungie Manifest to the Local Manifest db
//
function unpackManifestTable(manifestName) {
	createLocalManifestTable(manifestName);
	transferManifestTableRows(manifestName);
}

//
// Create a manifest table
//
function createLocalManifestTable(manifestName) {
	var file = './manifest/' + manifestName;
	var exists = fs.existsSync(file);
	var bungieManifest = new sqlite3.cached.Database(file)
			.on('open', function() {
				console.log(logSuccess + 'Loading manifest ' + manifestName.cyan);
			});

	bungieManifest.serialize( function () {
		// TODO add ability to iterate over all tables programatically
		bungieManifest.all('SELECT * FROM ' + tableName + ' LIMIT 1', function(err, rows) {
			rows.forEach(function (row) {
					json = JSON.parse(row.json);
					var jsonColumns = [];
					for(var attributename in json){
						jsonColumns.push( attributename );
					}
					var jsonColumns = "'" + jsonColumns.join("', '") + "'";

					var localManifest = new sqlite3.cached.Database(localManifestDB);
					localManifest.serialize(function () {
						localManifest.run( 'CREATE TABLE ' + tableName + ' (' + jsonColumns + ')', [], function () {
							localManifest.close();
							//console.log(logSuccess + 'Created table ' + tableName.magenta + ' in ' + localManifestDB.blue );
							console.log(logSuccess + 'Imported table ' + tableName.magenta + ' into ' + localManifestDB.blue );
						});
					});
        })
	  });
	});
	//bungieManifest.close(); // NOTE: uncomment or trigger '.close' event?
}

//
// Begin the process of processing and exporting tables rows from Bungie manifest to local manifest
// PROCESS FLOW:
// 1. getManifestTableRows
//    2. prepareManifestTableRows
// 		   3. insertManifestTableRows
function transferManifestTableRows(manifestName) {
	getManifestTableRows(manifestName);

}

//
// Selects all rows in a table and sents them for processing
//
function getManifestTableRows(manifestName) {
	var file = './manifest/' + manifestName;
	var exists = fs.existsSync(file);
	var bungieManifest = new sqlite3.cached.Database(file);

	bungieManifest.serialize( function () {
		//bungieManifest.all('SELECT * FROM ' + tableName + ' LIMIT 100', function (err, rows) { // NOTE: FOR DEBUGGING (only 1 row)
		bungieManifest.all('SELECT * FROM ' + tableName, function (err, rows) {
			rows.forEach(function (row) {
					json = JSON.parse(row.json);
					prepareManifestTableRows(json);
					//for(var attributename in json){ console.log(attributename+": "+json[attributename]); } // NOTE: FOR DEBUGGING
        })
	  });
	});
	//bungieManifest.close(); // NOTE: Needed?
	//console.log(logSuccess + 'Table rows inserted into ' + localManifestDB.blue );
}

//
// Prepare the table COLUMNS and ROWS for inserting
//
function prepareManifestTableRows(json) {

	// PROCESS COLUMNS
	var jsonColumns = [];
	for ( var attributename in json ){
		jsonColumns.push( attributename );
		//console.log(attributename+": "+json[attributename]); // output the key/value pair for each attribute/column // NOTE: FOR DEBUGGING
	}
	var jsonColumns = "'" + jsonColumns.join("', '") + "'";
	//console.log(jsonColumns); // outputs an array of the COLUMN name values // NOTE: FOR DEBUGGING

	// PROCESS ROW VALUES
	var jsonValues = [];
	for ( var attributename in json ) {
		jsonValues.push( json[attributename] );
	}
	//console.log(jsonValues); // outputs an array of the ROW values (before) // NOTE: FOR DEBUGGING
	var jsonValues = '"' + jsonValues.join('", "') + '"';
	//console.log(jsonValues); // outputs an array of the ROW values (after) // NOTE: FOR DEBUGGING

	insertManifestTableRows(jsonColumns, jsonValues);
}

//
// Insert prepared table rows into local manifest
//
function insertManifestTableRows(jsonColumns, jsonValues) {
	var localManifest = new sqlite3.cached.Database(localManifestDB);
	localManifest.serialize(function () {
		localManifest.run('INSERT INTO ' + tableName + ' (' + jsonColumns +') VALUES (' + jsonValues +')', [], function () {
			//console.log(logSuccess + 'Created table row' ); // NOTE: FOR DEBUGGING
		});
	});
	//localManifest.close(); // NOTE: Needed?
}
