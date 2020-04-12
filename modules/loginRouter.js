const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("./db.js");
const router = express.Router();

router.use(express.json());

router.post("/user", (req, res) => {
    db.loginUser(req.body)
      .then((data) => {
        data[0].type = "user";
        res.status(200).send(token(data[0]));
      })
      .catch((err) => res.status(400).send(err.message));
});

router.post("/ngo", (req, res) => {
    db.loginNgo(req.body)
      .then((data) => {

            data[0].type = "ngo";
            res.status(200).send(token(data[0]));
      })
      .catch((err) => res.status(400).send());
});



function token(data)
{
    return jwt.sign(JSON.stringify(data), process.env.KEY);
}



module.exports = router;