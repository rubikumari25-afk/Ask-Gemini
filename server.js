require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.post("/api/ask", async (req, res) => {
    try {
        const question = req.body.question;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `Answer the following question: ${question}

                                           Rules:
                                          - Keep the answer short, simple, and easy to understand.
                                          - Use a short paragraph by default.
                                          - Use bullet points or numbered steps only when necessary.
                                          - Avoid unnecessary details, long introductions, and conclusions.
                                          - Do not use emojis or decorative special characters.
                                          - Use simple English.
                                          - Keep the answer within 80 words unless the question genuinely requires more detail.`
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: "Gemini API request failed"
            });
        }

        const answer = data.candidates[0].content.parts[0].text;

        res.json({
            answer: answer
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Something went wrong"
        });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});