const { broadcast, ignore } = require("../utils/WSS");
const debug = require("debug")("app:WebSocketExample");
const HTTPError = require('http-errors');

let WSSClients = {};

// test: connect to ws://localhost/listen/time
setInterval(() => {
    if (WSSClients.time === undefined || WSSClients.time.length == 0) return;

    let log = broadcast(
        WSSClients.time,
        JSON.stringify({ time: new Date().toString() }),
        "/ws-example/listen"
    );

    debug(log);
}, 1000);

let CLOSE_LOCKED = false;
let closeWSConnection = function () {
    // this object is ws connection to be closed
    let connNo = this.__clientIndex,
        connEndpoint = this.__endpoint;

    if (CLOSE_LOCKED) {
        setTimeout(closeWSConnection().bind(this), 0); // try to close on next event loop
        return;
    } else {
        CLOSE_LOCKED = true;

        WSSClients[connEndpoint].splice(connNo - 1, 1);

        WSSClients[connEndpoint].forEach(client => {
            if (client.__clientIndex > connNo)
                client.__clientIndex--;
        });

        debug(dMsg.closeClient(connEndpoint, connNo));

        CLOSE_LOCKED = false;
    }
}

module.exports = {
    // WebSocket /listen 
    listen: (ws, req) => {
        let endpoint = req.params.endpoint;
        if (endpoint == null) {
            next(HTTPError(400, "No endpoint parameter."));
            return;
        }

        if (!WSSClients[endpoint]) WSSClients[endpoint] = [];

        ws.__clientIndex = WSSClients[endpoint].length;
        ws.__endpoint = endpoint;

        WSSClients[endpoint].push(ws);

        ws.on('message', ignore.bind(ws));
        ws.on('close', closeWSConnection.bind(ws));

        debug(dMsg.newClient(ws.__endpoint, ws.__clientIndex));
    },

    // WebSocket /control 
    control: (ws, req) => {
        debug(dMsg.newClient("control"));
        ws.on('message', message => {
            if (typeof message === "string")
                try {
                    message = JSON.parse(message);
                } catch (error) {
                    debug(dMsg.notJSON);
                    return;
                }

            // Validate body
            let bodyIsValid = validateControlBody(message);
            if (!bodyIsValid) return;

            let log = broadcast(
                WSSClients[message.endpoint],
                JSON.stringify(message.payload),
                "/listen/" + message.endpoint
            );

            debug(log);
        });

    }
}

let validateControlBody = message => {
    let valid = true;
    ["endpoint", "payload"].forEach(key => {
        if (!message.hasOwnProperty(key)) {
            debug(dMsg.keyMissing(key));
            valid = false;
            return;
        }
    });

    return valid;
}

let dMsg = {
    newClient: (endpoint, index) => { return `New client ${index ? `(#${index}) ` : ''}on endpoint ${endpoint}` },
    closeClient: (endpoint, index) => { return `Connection closed for client #${index} on endpoint ${endpoint}` },
    notJSON: "Received a malformated JSON",
    keyMissing: key => { return `Received a control JSON that had no '${key}' property`; }
}