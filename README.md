# Destiny Manifest

**Note:** This project is a work in progress and is not yet fully functional.

## Setup

Clone the repo:

* `git clone https://github.com/rveitch/destiny-manifest`

Install dependencies:

* `npm install`

Add an Api Key:

* Obtain an API key from [Bungie](https://www.bungie.net/en/Application).
* Add your bungie.net API key into the apikey variable in the `apiKey.js` file.

## Commands
- `node getManifest.js` Download and unzips the current manifest.
- `node createTable.js --table <tablename>` Extracts the specified table from the Bungie manifest JSON blobs into a flat corresponding table in localManifest.db

## Screenshots
Example of extracted `DestinyInventoryBucketDefinition` table:

![Exported SQLITE Table Example](https://cloud.githubusercontent.com/assets/12876929/20043288/45311308-a450-11e6-88d3-2c82c91e5631.png)
