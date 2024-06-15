const express = require("express");
const cors = require("cors");

const app = express();
const port = 8080;

const corsOptions = {
    methods: ["POST"],
}

app.use(cors(corsOptions));

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})

app.use(express.json());

app.post('/multi', (req, res) => {
    const data = req.body.question;
    console.log("Received data: ", data);

    // Respond to the request
    resjson = JSON.stringify("Success!");
    res.status(200).send(resjson);
})