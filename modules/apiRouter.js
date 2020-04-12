const express = require("express");
const jwt = require("jsonwebtoken");
const bp = require("body-parser");
const db = require("./db.js");
const nm = require("./mailer");
const router = express.Router();

router.use(bp.json({ limit: "3MB" }));

router.use((req, res, next) => {

    let payload;
    try {
        payload = jwt.verify(req.body.token, process.env.KEY);
        req.body.email = payload.email;
        
        delete req.body.token;
        next();
    } catch (err) {
        res.status(401).send(err.message);
    }
});



router.post("/createEvent", (req, res) => {

    db.createEvent(req.body)
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send(err.message));
});

router.delete("/deleteEvent", (req, res) => {

    db.deleteEvent(req.body)
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send(err.message));
});

router.post("/getEvents", (req, res) => {

    db.getEvents(req.body)
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send(err.message));
});


router.post("/sendEmail", (req, res) => {
  nm.mail(req.body)
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(500).send(err.message));
});

router.post("/varified", (req, res) => {
     db.varified(req.body)
       .then(() => res.status(200).send("Done"))
       .catch((err) => res.status(500).send(err.message));
});

router.post("/addlocation", (req,res) => {

    db.addlocation(req.body)
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send(err.message))
});


router.post("/getlocations", (req, res) => {

    db.getlocations()
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send(err.message))
});


router.post("/search", (req, res) => {

    db.search(req.body)
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send(err.message))
});

router.post("/saveImg", (req, res) => {

    db.saveImg(req.body)
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send(err.message))
});


module.exports = router;