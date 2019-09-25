var express = require('express');
var router = express.Router();

router.ws('/echo', function (ws, req) {
    ws.on('message', function (msg) {
        ws.send(msg);
    });
});

router.ws('/', function (ws, req) {
    ws.on('message', function (msg) {
        ws.send("root response");
    });
});

module.exports = router;
