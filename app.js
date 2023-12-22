const fs = require('fs');
const http = require('http');
const url = require('url');
const socketio = require('socket.io');

const server = http.createServer(function (req, res) {
    var path = url.parse(req.url).pathname;
    if (path == "/") {
        path = "/index.html";
    }
    fs.readFile(__dirname + path, function (err, data) {
        if (err) {
            res.writeHead(404);
            res.end();
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
    });
}).listen(process.env.PORT || 8080);

const io = new socketio.Server(server);

io.on("connection", (socket) => {
    socket.on("serverTest", function (info, callback) {
        console.log(info);
        callback(true);
    });
});