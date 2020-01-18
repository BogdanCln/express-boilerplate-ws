const debug = require("debug")("app:indexController");
const path = require("path");

module.exports = {
    // Get / 
    index: (req, res) => {
        res.render('index', { title: 'Demo' });
    },

    // GET /docs
    docs: (req, res) => {
        debug(__dirname)
        res.sendFile(path.join(__dirname, "../") + "/public/docs.html");
    }
}