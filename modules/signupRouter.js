const express = require("express");
const db = require("./db.js");
const router = express.Router();

router.use(express.json());

router.post("/user",(req,res) =>
{
    db.createUser(req.body)
      .then(() => res.status(200).send("Sign Up successful."))
      .catch((err) => res.status(400).send(err.message));
});

router.post("/ngo", (req, res) => {
    db.createNgo(req.body)
      .then(() => res.status(200).send("Sign Up successful."))
      .catch((err) => res.status(400).send(err.message));
});


module.exports = router;