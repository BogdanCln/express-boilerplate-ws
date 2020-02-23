var express = require('express');
const indexController = require("../controllers/index");
var router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: GET the homepage
 *     description: Homepage
 *     tags:
 *       - "index routes: /"
 *     responses:
 *       200:
 *         description: Homepage
 */
router.get('/', indexController.index);

/**
 * @swagger
 * /docs:
 *   get:
 *     summary: GET the swagger docs page
 *     description: Swagger docs page
 *     tags:
 *       - "index routes: /"
 *     responses:
 *       200:
 *         description: API Documentation
 */
router.get("/docs", indexController.docs);


/**
 * @swagger
 * /dirname:
 *   get:
 *     summary: Get __dirname from backend
 *     description: Get __dirname from backend. Never go into production with something like this, wrote just for example showcasing purpose.
 *     tags:
 *       - "index routes: /"
 *     parameters:
 *     responses:
 *       200:
 *         description: __dirname
 *     x-code-samples:
 *      - lang: 'jQuery'
 *        source: |
 *          $.ajax({
 *             url: "http://127.0.0.1/dirname",
 *             success: console.log,
 *             fail: console.error
 *          });
 */
router.get("/dirname", indexController.dirname);

module.exports = router;
