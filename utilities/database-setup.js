const sqlite = require('sqlite3').verbose();
const immunedb = new sqlite.Database('../.data/sawitt-immune.db');
const notsecuredb = new sqlite.Database('../.data/sawitt-not-secure.db');

// Create tables in the immune database
immunedb.run(`CREATE TABLE IF NOT EXISTS Users (
    UserID INTEGER PRIMARY KEY,
    Username TEXT UNIQUE NOT NULL,
    Password TEXT NOT NULL
)`, [], function () {
    var sql = `INSERT INTO Users (Username, Password) VALUES ($num, 'abc123')`;
    for (var i = 0; i < 10; i++) immunedb.run(sql,
        {
            $num: 'user' + Math.floor(Math.random() * 10000)
        },
        function (err) { if (err) console.error(err); }
    );
});
immunedb.run(`CREATE TABLE IF NOT EXISTS Posts (
    PostID INTEGER PRIMARY KEY,
    PosterID INTEGER NOT NULL,
    Time INTEGER DEFAULT (strftime('%s', 'now')),
    Content TEXT NOT NULL,
    Likes INTEGER DEFAULT 0,
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
    Time INTEGER DEFAULT (strftime('%s', 'now')),
    Content TEXT NOT NULL,
    Likes INTEGER DEFAULT 0,
    FOREIGN KEY (PosterID)
    REFERENCES Users (UserID)
        ON UPDATE RESTRICT
        ON DELETE CASCADE
)`);