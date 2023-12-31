const sqlite = require('sqlite3').verbose();
const immunedb = new sqlite.Database('../.data/sawitt-immune.db');
const notsecuredb = new sqlite.Database('../.data/sawitt-not-secure.db');

immunedb.run(`DROP TABLE Users;
DROP TABLE Posts;`, [], function (err) {
    if (err) throw err;
});
notsecuredb.run(`DROP TABLE Users;
DROP TABLE Posts;`, [], function (err) {
    if (err) throw err;
});