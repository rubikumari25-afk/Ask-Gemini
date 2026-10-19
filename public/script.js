const questionInput = document.getElementById("question");
const submitButton = document.getElementById("submit-btn");
const answerDiv = document.getElementById("answer");

submitButton.addEventListener("click", async () => {
    const question = questionInput.value.trim();

    if (question === "") {
        answerDiv.innerText = "Please enter a question!";
        return;
    }

    answerDiv.innerText = "Thinking...";

    try {
        const response = await fetch("/api/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question: question
            })
        });

        const data = await response.json();

        if (!response.ok) {
            answerDiv.innerText = data.error || "Something went wrong!";
            return;
        }

        answerDiv.innerText = data.answer;

    } catch (error) {
        console.error(error);
        answerDiv.innerText = "Could not connect to the server!";
    }
});

const newChatButton = document.getElementById("new-chat-btn");

newChatButton.addEventListener("click", () => {
    questionInput.value = "";
    answerDiv.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">✧</div>
            <h3>Ready when you are</h3>
            <p>Enter your question above to start a conversation with Gemini.</p>
        </div>
    `;
});