const sqlite = require('sqlite3').verbose();
const immunedb = new sqlite.Database('../.data/sawitt-immune.db');
const notsecuredb = new sqlite.Database('../.data/sawitt-not-secure.db');
const droptables = [
	'Users',
	'Posts',
	'Follows',
	'UsersBAK'
];

droptables.forEach(function (tablename) {
	immunedb.run(`DROP TABLE ${tablename};`, [], function (err) {
		if (err) console.error(err);
	});
	notsecuredb.run(`DROP TABLE ${tablename};`, [], function (err) {
		if (err) console.error(err);
	});
});