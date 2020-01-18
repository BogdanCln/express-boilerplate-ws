const express = require('express');
const WebSocketExampleController = require("../controllers/WebSocketExample");
const debug = require("debug")("app:WebSocketExampleRouter");

let router = express.Router();

/**
 * @swagger
 * /ws/listen:
 *   get:
 *     summary: "[WEBSOCKET UPGRADE] Subscribe to some events"
 *     description: "Used by something to listen for some events"
 *     tags:
 *       - "ws example routes: /ws-example"
 */
router.ws("/listen", WebSocketExampleController.listen);

/**
 * @swagger
 * /say-hi/name:
 *   get:
 *     summary: GET method test
 *     description: Responds with Hello, <name>!
 *     tags:
 *       - "ws example routes: /ws-example"
 *     parameters:
 *       - in: path
 *         name: name
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Greeting
 *       400:
 *         description: No name URL parameter specified
 */
router.get("/say-hi/:name", WebSocketExampleController.sayHi);

function sendError(err, req, res, next) {
    debug(err)
    if (req.app.get('env') === 'development') {
        res.set('Content-Type', 'application/json');
        res.status(400).send(err.stack || err)
    } else {
        res.status(400).send();
    }
}

router.use(sendError);

module.exports = router;