const express = require("express");
const signupRouter = require("./modules/signupRouter.js");
const loginRouter = require("./modules/loginRouter.js");
const accountRouter = require("./modules/accountRouter.js");
const apiRouter = require("./modules/apiRouter.js");
const publicApiRouter = require("./modules/publicApiRouter.js");
const server = express();

server.use(express.static("./site/"));
server.use("/signUp",signupRouter);
server.use("/login", loginRouter);
server.use("/account",accountRouter);

server.use("/api",apiRouter);
server.use("/pApi",publicApiRouter);


if (!process.env.KEY) {
    console.error("Key is not set");
    process.exit(1);
}
if (!process.env.PASS) {
    console.error("PASS is not set");
    process.exit(1);
}

if(process.env.PORT)server.listen(Number(process.env.PORT),()=>console.log("listening to port "+process.env.PORT + "..."));
else server.listen(3000, () => console.log("listening to port 3000...."));
