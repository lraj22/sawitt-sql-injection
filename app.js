const fs = require('fs');
const http = require('http');
const url = require('url');
const socketio = require('socket.io');
const pathfunc = require('path');
const sqlite = require('sqlite3').verbose();
const crypto = require('crypto');

const immunedb = new sqlite.Database('./.data/sawitt-immune.db');
const notsecuredb = new sqlite.Database('./.data/sawitt-not-secure.db');
const privateKey = Buffer.from(fs.readFileSync('./.data/private-key.pem', 'utf-8'));
const publicKey = Buffer.from(fs.readFileSync('./public-key.pem', 'utf-8'));
const millisecperweek = 7 * 24 * 60 * 60 * 1000;

function prenc(data) { return crypto.privateEncrypt({ key: privateKey, padding: crypto.constants.RSA_PKCS1_PADDING }, Buffer.from(data)).toString('base64'); }
function pudec(data) { return crypto.publicDecrypt({ key: publicKey, padding: crypto.constants.RSA_PKCS1_PADDING }, Buffer.from(data, 'base64')).toString(); }

const server = http.createServer(function (req, res) {
    var path = url.parse(req.url).pathname;
    if (path.slice(-1) == '/') {
        path += 'index.html';
    }
    var i;
    const paths403 = [
        /\/+\.data\/+.*/,
        /\/+mutual\/+.*/
    ];
    const mutualpaths = [
        'post.html',
        'feed.html',
        'login.html',
        'signup.html'
    ]
    for (i = 0; i < paths403.length; i++) {
        if (path.replace(paths403[i], '') === '') {
            res.writeHead(403);
            res.end();
        }
    }
    if (mutualpaths.includes(path.replace(/\/+(un)?stable\/+(.*)/, '$2'))) {
        path = path.replace(/\/+(un)?stable\/+(.*)/, '/mutual/$2');
    }
    fs.readFile(__dirname + path, function (err, data) {
        if (err) {
            res.writeHead(404);
            res.end();
        } else {
            var type = pathfunc.extname(path).substring(1);
            if (type == 'js') type = 'javascript';
            res.writeHead(200, { 'Content-Type': 'text/' + type });
            res.end(data);
        }
    });
}).listen(process.env.PORT || 8080);

const io = new socketio.Server(server);

io.on('connection', (socket) => {
    var isImmune = socket.handshake.query.immune == 'true';
    var token = socket.handshake.query.accessToken;
    var signedInAs;
    try {
        var decryptedData = pudec(token).split(';');
        if (((decryptedData[0] == 's') && (isImmune)) || ((decryptedData[0] == 'u') && (!isImmune))) {
            if (Date.now() > parseInt(decryptedData[2])) {
                signedInAs = false;
                socket.emit('signedInState', 0);
            } else {
                signedInAs = parseInt(decryptedData[1]);
                socket.emit('signedInState', signedInAs);
            }
        }
    } catch (e) {
        signedInAs = false;
        socket.emit('signedInState', 0);
    }
    var db = isImmune ? immunedb : notsecuredb;
    function doQuery(func, safequery, unsafequery, params, callback) { db[func](isImmune ? safequery : (unsafequery || safequery), isImmune ? (params || []) : [], callback || function () { }); }
    function logIn(info, callback) {
        if ((!info.username) || (!info.password))
            callback({ 'token': false, 'error': 'Provide Username & Password' });
        doQuery('get', 'SELECT UserID FROM Users WHERE Username = $un AND Password = $pwd', `SELECT UserID FROM Users WHERE Username = '${info.username}' AND Password = '${info.password}'`, {
            $un: info.username,
            $pwd: info.password
        }, function (err, row) {
            if (err) {
                callback({ 'token': false, 'error': '500 Server Error' });
                console.error(err);
            }
            else {
                if (!row) {
                    callback({ 'token': false, 'error': 'Incorrect Login Information' });
                } else {
                    var token = prenc((isImmune ? 's' : 'u') + ';' + row.UserID + ';' + (Date.now() + millisecperweek));
                    callback({ 'token': token });
                }
            }
        });
    }
    socket.on('information', function (query, callback) {
        var returninfo = {};
        var i;
        function replyifdone() {
            if (i >= query.length - 1) {
                callback(returninfo);
            }
        }
        for (i = 0; i < query.length; i++) {
            switch (query[i]) {
                /*
                 * Currently, this socket.on is not useful. The only possible
                 * query that had existed was called 'signedIn', where the
                 * client asked whether or not they were signed in and as who.
                 * Since the server sends this information on its own, that
                 * was rendered useless. There are no other possible queries,
                 * but the remaining uncommented & undeleted part of this
                 * socket.on is in the syntax that it would be, with specific
                 * queries having their own case as a string.
                 */
            }
        }
    });
    socket.on('signUp', function (info, callback) {
        doQuery('run', 'INSERT INTO Users (Username, Password) VALUES ($un, $pwd)', `INSERT INTO Users (Username, Password) VALUES ('${info.username}', '${info.password}'`, {
            $un: info.username,
            $pwd: info.password
        }, function (err) {
            if (err) {
                if (err.code == 'SQLITE_CONSTRAINT')
                    callback({ 'token': false, 'error': 'That username is taken.' });
                else {
                    callback({ 'token': false, 'error': '500 Server Error' });
                    console.error(err);
                }
            }
            else {
                logIn(info, callback);
            }
        });
    });
    socket.on('logIn', logIn);
    socket.on('post', function (info, callback) {
        if (signedInAs == info.poster) {
            if (info.content.length > 1000) {
                callback({ 'success': false, 'error': 'Content Too Long; Exceeds 1000 Characters' });
            } else if (info.content.length == 0) {
                callback({ 'success': false, 'error': 'Provide content for the Post' });
            } else {
                doQuery('run', 'INSERT INTO Posts (PosterID, Time, Content) VALUES ($poster, $now, $content)', `INSERT INTO Posts (PosterID, Time, Content) VALUES (${info.poster}, ${Math.round(Date.now()/1000)} ${info.content})`, {
                    $poster: info.poster,
                    $now: Math.round(Date.now()/1000),
                    $content: info.content
                }, function (err) {
                    if (err) {
                        callback({ 'success': false, 'error': '500 Server Error' });
                        console.error(err);
                    } else {
                        callback({ 'success': true });
                    }
                });
            }
        } else if (!signedInAs) {
            callback({ 'success': false, 'error': 'Not Signed In' });
        } else {
            callback({ 'success': false, 'error': 'Go Away Hacker!' });
        }
    });
});