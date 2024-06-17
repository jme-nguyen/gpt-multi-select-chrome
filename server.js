const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config(); // Load environment variables from.env file

const app = express();
const port = 8080;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const systemPrompt = "You are a highly intelligent assistant. The user will provide you with multiple-choice questions along with possible answers. Your task is to analyze the question and the provided answers, then return the correct answer in the exact format it is given (e.g., if the correct answer is pOtAtO, return pOtAtO, not potato). If there are letters before the answers (i.e. a. answer1 b. answer2) return the correct answer without the letter"

const corsOptions = {
    methods: ["POST"],
}

app.use(cors(corsOptions));

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})

app.use(express.json());

app.post('/multi', async (req, res) => {
    const data = req.body.question;
    // const parsedata = parseMCQ(data);
    const reply = await askGPT(data);

    // Respond to the request
    resjson = JSON.stringify(reply);
    res.status(200).send(resjson);
})

async function askGPT(question) {
    const completion = await openai.chat.completions.create({
        messages: [
            {role: "system", content: systemPrompt},
            {role: "user", content: question}
        ],
        model: "gpt-3.5-turbo"
    })

    return completion.choices[0].message.content;
}

/*
    Function may not be used as flexibility in chrome extension is limited using this method.
    If ChatGPT formatting is not as inticipated this method may be used.
*/
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

    return { question, answers };
  }