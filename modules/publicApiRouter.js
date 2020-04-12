const express = require("express");
const nm = require("./mailer");
const router = express.Router();

router.use(express.json());

router.post("/contact", (req, res) => {

    nm.getmail(req.body)
        .then(data => res.status(200).send("Message sent."))
        .catch(err => res.status(500).send(err.message));
});

module.exports = router;