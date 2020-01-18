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

module.exports = router;
