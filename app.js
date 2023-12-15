const fs = require('fs');
const http = require('http');

http.createServer(function (req, res) {
    fs.readFile(__dirname + '/index.html', function (err, data) {
        if (err) {
            res.writeHead(500);
            res.end();
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
    });
}).listen(process.env.PORT || 8080);