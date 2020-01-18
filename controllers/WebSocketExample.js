const { broadcast, ignore } = require("../utils/WSS");
const debug = require("debug")("app:WebSocketExampleController");

let WSSClient = [];

setInterval(() => {
    let log = broadcast(
        WSSClient,
        JSON.stringify({ time: new Date().toString() }),
        "/ws-example/listen"
    );

    debug(log);
}, 3000);

module.exports = {
    // WebSocket /listen 
    listen: (ws, req) => {
        WSSClient.push(ws);

        debug("New listener #", WSSClient.length);
        ws.on('message', ignore.bind(ws));
    },

    // GET /say-hi/name
    sayHi: (req, res, next) => {
        let name = req.params.name;
        if (key == null) {
            next(new Error("No name parameter."));
            return;
        }

        res.send(`Hello ${name}!`);
    }
}