const fs = require('fs');
const http = require('http');
const url = require('url');
const socketio = require('socket.io');
const pathfunc = require('path');
const sqlite = require('sqlite3').verbose();
const immunedb = new sqlite.Database('./.data/sawitt-immune.db');
const notsecuredb = new sqlite.Database('./.data/sawitt-not-secure.db');

const server = http.createServer(function (req, res) {
    var path = url.parse(req.url).pathname;
    if (path.slice(-1) == '/') {
        path += '/index.html';
    }
    var i;
    const paths403 = [/\/\.data\/.*/];
    for (i = 0; i < paths403.length; i++) {
        if (path.replace(paths403[i], '') === '') {
            res.writeHead(403);
            res.end();
        }
    }
    fs.readFile(__dirname + path, function (err, data) {
        if (err) {
            res.writeHead(404);
            res.end();
        } else {
            res.writeHead(200, { 'Content-Type': 'text/' + pathfunc.extname(path).substring(1) });
            res.end(data);
        }
    });
}).listen(process.env.PORT || 8080);

const io = new socketio.Server(server);

io.on('connection', (socket) => {
    var isImmune = !!socket.handshake.query.immune;
    // TODO: make functionality to read token for user signed-in detection
    var signedInAs = 0;
    var db = isImmune ? immunedb : notsecuredb;
    function doQuery(queryfunction, immunequery, notsecurequery, parameters, callback) { db[queryfunction](isImmune ? immunequery : (notsecurequery || immunequery), isImmune ? (parameters || []) : [], callback || function () { }); }
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
                case 'signedIn':
                    if (!signedInAs) {
                        returninfo.signedIn = 0;
                        replyifdone();
                    }
                    else {
                        returninfo.signedIn = signedInAs;
                        /* TODO: use actual reasonable queries to return information
                        doQuery('all', 'SELECT * FROM Users', false, [], function (err, rows) {
                            if (err) throw err;
                            console.log(rows);
                            replyifdone();
                        });
                        */
                    }
                    break;
            }
        }
        callback(returninfo);
    });
});