module.exports = {
    broadcast: (clients, msg, endpoint) => {
        let returnLog = "";

        if (clients == null) {
            returnLog = "clients parameter is null";
            return returnLog;
        }

        let aliveClients = 0;

        for(let i = 0; i < clients.length; i++) {
            let client = clients[i];
            if (client !== undefined) {
                try {
                    client.send(msg);
                    aliveClients++;
                } catch (err) {
                    if (client.readyState == 3) {
                        returnLog += `detected closed connection by client # ${i}`;
                        clients.splice(i, 1);
                        i--;
                    } else
                        returnLog += err;
                }
            }
        }

        if (aliveClients === 0) {
            clients.length = 0;
        }

        return `WS broadcast on ${endpoint} to ${aliveClients} clients`;
    },

    // websocket client should be binded to echo method
    echo: function (msg) { this.send(msg); },

    // websocket client should be binded to echo method
    ignore: function (msg) { this.send("Not expecting messages from clients."); }
};