const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 3000;
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

const api = require("./routes/api");
app.use("/api",api);


app.get("/", (req, res) => {
    res.send("Hello from Quizapi");
})

app.listen(process.env.port| port, () => {
    console.log(`server started at ${port}`);
});