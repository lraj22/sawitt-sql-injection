const sqlite = require('sqlite3').verbose();
const immunedb = new sqlite.Database('./.data/sawitt-immune.db');
const notsecuredb = new sqlite.Database('./.data/sawitt-not-secure.db');

// Create tables in the immune database
immunedb.run(`CREATE TABLE IF NOT EXISTS Users (
    UserID INTEGER PRIMARY KEY,
    Username TEXT UNIQUE NOT NULL,
    Password TEXT NOT NULL
)`, [], function () {
    var sql = `INSERT INTO Users (Username, Password) VALUES ($num, 'abc123')`;
    for (var i = 0; i < 10; i++) immunedb.run(sql,
        {
            $num: (function () {
                var r = Math.floor(Math.random() * 10000);
                return 'user' + r;
            })()
        },
        function (err) { if (err) throw err; }
    );
});
immunedb.run(`CREATE TABLE IF NOT EXISTS Posts (
    PostID INTEGER PRIMARY KEY,
    PosterID INTEGER NOT NULL,
    Time TEXT NOT NULL,
    Content TEXT NOT NULL,
    FOREIGN KEY (PosterID)
    REFERENCES Users (UserID)
        ON UPDATE RESTRICT
        ON DELETE CASCADE
)`);

// Create tables in the not secure database
notsecuredb.run(`CREATE TABLE IF NOT EXISTS Users (
    UserID INTEGER PRIMARY KEY,
    Username TEXT UNIQUE NOT NULL,
    Password TEXT NOT NULL
)`);
notsecuredb.run(`CREATE TABLE IF NOT EXISTS Posts (
    PostID INTEGER PRIMARY KEY,
    PosterID INTEGER NOT NULL,
    Time TEXT NOT NULL,
    Content TEXT NOT NULL,
    FOREIGN KEY (PosterID)
    REFERENCES Users (UserID)
        ON UPDATE RESTRICT
        ON DELETE CASCADE
)`);