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
    const parsedata = parseMCQ(data);

    // Respond to the request
    resjson = JSON.stringify(parsedata);
    res.status(200).send(resjson);
})

function parseMCQ(input) {
    // Regular expressions for each style
    const style1 = /^(.*?)\nGroup of answer choices\n\n(.+?)$/s;
    const style2 = /^(.*?)\n\nQuestion \d+Select one:\n\n(.+?)$/s;
  
    let question, answers;
  
    if (style1.test(input)) {
        const matches = input.match(style1);
        if (matches) {
            question = matches[1].trim();
            answers = matches[2].split('\n\n').map(answer => answer.trim());
        }
    } else if (style2.test(input)) {
        const matches = input.match(style2);
        if (matches) {
            question = matches[1].trim();
            answers = matches[2].split('\n\n').map(answer => answer.replace(/[a-z]\.\n/, '').trim());
        }
    }
  
    console.log(question, answers);
    return { question, answers };
  }