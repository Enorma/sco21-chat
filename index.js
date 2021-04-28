const express = require("express");
const app = express();
const expressWS = require("express-ws")(app);
const WSController = require("./controllers/ws-controller");

app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static("public"));

app.get("/", (req,res) => {
    res.render("index");
});

app.ws("/chat", WSController);

const port = 4000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});

//eof (backend)
