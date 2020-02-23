const express = require('express');
const WebSocketExampleController = require("../controllers/WebSocketExample");
const debug = require("debug")("app:WebSocketExample");

let router = express.Router();

/**
 * @swagger
 * /ws/listen/{endpoint}:
 *   get:
 *     schemes: [ws]
 *     summary: "[WEBSOCKET UPGRADE] Subscribe to some events"
 *     description: "Used to listen for events broadcasted on a endpoint"
 *     tags:
 *       - "WebSocketExample: /ws"
 *     parameters:
 *       - in: path
 *         name: endpoint
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Connected
 *       400:
 *         description: No endpoint URL parameter specified
 *     x-code-samples:
 *      - lang: 'RobustWebSocket'
 *        source: |
 *          (
 *              new RobustWebSocket(
 *                  "ws://127.0.0.1/listen/time",
 *                  null,
 *                  { automaticOpen: true })
 *          )
 *              .addEventListener('message', event => {
 *                  console.warn(event.data);
 *              });
 */
router.ws("/listen/:endpoint", WebSocketExampleController.listen);
router.ws("/listen/:controlType/:endpoint", WebSocketExampleController.listen);

/**
 * @swagger
 * /ws/control:
 *   get:
 *     schemes: [ws]
 *     summary: "[WEBSOCKET UPGRADE] Broadcast events"
 *     description: "Used to broadcast messages to listen endpoints"
 *     tags:
 *       - "WebSocketExample: /ws"
 *     responses:
 *       200:
 *         description: Connected
 *     x-code-samples:
 *      - lang: 'RobustWebSocket'
 *        source: |
 *          // listen client
 *          (
 *              new RobustWebSocket(
 *                  "ws://127.0.0.1/listen/test",
 *                  null,
 *                  { automaticOpen: true })
 *          )
 *              .addEventListener('message', event => {
 *                  console.warn("Received: " + event.data);
 *              });
 * 
 *          // control client
 *          (
 *              new RobustWebSocket(
 *                  "ws://127.0.0.1/control",
 *                  null,
 *                  { automaticOpen: true })
 *          )
 *              .addEventListener('open', function (event) {
 *                  setInterval(() => {
 *                      this.send(`{"endpoint": "test", "payload": "hello world"}`)
 *                  }, 500);
 *              });
 */
router.ws("/control", WebSocketExampleController.control);

function sendError(err, req, res, next) {
    debug(JSON.stringify(err))
    res.set('Content-Type', 'application/json');
    res.status(err.status || 500).send(err.message || err.stack)
}

router.use(sendError);

module.exports = router;