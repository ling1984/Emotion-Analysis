document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("sendText").addEventListener("click", async () => {
        let userInput = document.getElementById("userInput").value;
        if (!userInput) return;

        let response = await fetch("http://localhost:8000/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: userInput }),
        });

        let data = await response.json();
        let responseContainer = document.getElementById("responseContainer");
        responseContainer.innerHTML = ""; // Clear previous response

        const labelColors = {
            neutral: "bg-gray-200 text-gray-800",
            curiosity: "bg-blue-200 text-blue-800",
            admiration: "bg-green-200 text-green-800",
            excitement: "bg-yellow-200 text-yellow-800",
            sadness: "bg-gray-400 text-gray-900",
        };

        data.result.forEach(([text, labels]) => {
            let messageDiv = document.createElement("div");
            messageDiv.className = "p-3 border rounded-lg bg-gray-50 shadow-md";

            let textElement = document.createElement("p");
            textElement.className = "text-lg font-semibold";
            textElement.innerText = text;
            messageDiv.appendChild(textElement);

            let labelContainer = document.createElement("div");
            labelContainer.className = "flex flex-wrap gap-2 mt-2";

            labels.forEach(labelObj => {
                let labelSpan = document.createElement("span");
                labelSpan.className = `px-2 py-1 rounded-lg text-sm font-medium ${
                    labelColors[labelObj.label] || "bg-gray-200 text-gray-800"
                }`;
                labelSpan.innerText = `${labelObj.label} (${(labelObj.score * 100).toFixed(1)}%)`;
                labelContainer.appendChild(labelSpan);
            });

            messageDiv.appendChild(labelContainer);
            responseContainer.appendChild(messageDiv);
        });
    });
});

// Handle audio recording & sending
document.getElementById("recordAudio").addEventListener("click", async () => {
    let stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    let mediaRecorder = new MediaRecorder(stream);
    let chunks = [];

    mediaRecorder.ondataavailable = event => chunks.push(event.data);
    mediaRecorder.onstop = async () => {
        let audioBlob = new Blob(chunks, { type: "audio/mp3" });
        let formData = new FormData();
        formData.append("file", audioBlob, "audio.mp3");

        let response = await fetch("http://localhost:8000/recording", {
            method: "POST",
            body: formData,
        });

        let data = await response.json();
        document.getElementById("response").innerText = "Bot: " + data.emotions[0];
    };

    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), 5000);  // Record for 5 seconds
});
