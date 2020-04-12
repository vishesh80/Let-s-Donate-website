const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("./db.js");
const router = express.Router();

router.use(express.json());
router.use((req,res,next) => {

    let payload;
    try{
        payload = jwt.verify(req.body.token, process.env.KEY);
        req.body = payload;
        next();
    }catch(err)
    {
        res.status(400).send(err.message);
    }
});


router.post("/user", (req, res) => {
  db.accountUser(req.body)
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(400).send(err.message));
});

router.post("/ngo", (req, res) => {
  db.accountNgo(req.body)
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(400).send(err.message));
});



module.exports = router;
