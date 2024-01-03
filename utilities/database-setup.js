const sqlite = require('sqlite3').verbose();
const immunedb = new sqlite.Database('../.data/sawitt-immune.db');
const notsecuredb = new sqlite.Database('../.data/sawitt-not-secure.db');

// Create tables in the immune database
immunedb.run(`CREATE TABLE IF NOT EXISTS Users (
	UserID INTEGER PRIMARY KEY,
	Username TEXT UNIQUE NOT NULL,
	Password TEXT NOT NULL,
	AboutME TEXT
)`, [], function (err) {
	immunedb.run(`CREATE TRIGGER IF NOT EXISTS backup_users
	AFTER INSERT ON Users
	BEGIN
		INSERT INTO UsersBAK (
			UserID,
			Username,
			Password,
			AboutME
		)
		VALUES (
			new.UserID,
			new.Username,
			new.Password,
			new.AboutME
		);
	END`, [], function (err) {
		if (err) console.error(err);
	});
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
immunedb.run(`CREATE TABLE IF NOT EXISTS Follows (
	FollowedID INTEGER NOT NULL,
	FollowerID INTEGER NOT NULL,
	FOREIGN KEY (FollowedID)
	REFERENCES Users (UserID)
		ON UPDATE RESTRICT
		ON DELETE CASCADE,
	FOREIGN KEY (FollowerID)
	REFERENCES Users (UserID)
		ON UPDATE RESTRICT
		ON DELETE CASCADE
)`);
immunedb.run(`CREATE TABLE IF NOT EXISTS UsersBAK (
	UserID INTEGER PRIMARY KEY,
	Username TEXT UNIQUE NOT NULL,
	Password TEXT NOT NULL,
	AboutME TEXT
)`);

// Create tables in the not secure database
notsecuredb.run(`CREATE TABLE IF NOT EXISTS Users (
			UserID INTEGER PRIMARY KEY,
			Username TEXT UNIQUE NOT NULL,
			Password TEXT NOT NULL,
	AboutME TEXT
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
notsecuredb.run(`CREATE TABLE IF NOT EXISTS Follows (
	FollowedID INTEGER NOT NULL,
	FollowerID INTEGER NOT NULL,
	FOREIGN KEY (FollowedID)
	REFERENCES Users (UserID)
		ON UPDATE RESTRICT
		ON DELETE CASCADE,
	FOREIGN KEY (FollowerID)
	REFERENCES Users (UserID)
		ON UPDATE RESTRICT
		ON DELETE CASCADE
)`);