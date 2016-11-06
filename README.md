# Destiny Manifest

## Commands
- `node getManifest.js` Download and unzips the current manifest.
- `node createTable.js --table <tablename>` Extracts the specified table from the Bungie manifest JSON blobs into a flat corresponding table in localManifest.db

### Note on Manifest IDs and Hashes
itemHash appears to be an unsigned 32bit integer, but SQLite is interpreting the value as a signed int. If you're using a C-like language with casts, just make your itemHash an unsigned 32 bit int, cast it to a signed int, and then use that value as the id. If you're using a weakly-typed language like PHP, or if your language doesn't allow you to specify 32-bit ints, you can just convert it manually:
- `SELECT * FROM DestinyInventoryItemDefinition WHERE id + 4294967296 = <ItemHash> OR id = <itemHash>`

#### References
- [How to Read the Manifest (Reference)](https://www.bungie.net/en-US/Clan/Post/39966/105901734/0/0)
