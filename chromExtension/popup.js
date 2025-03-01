document.getElementById("sendText").addEventListener("click", async () => {
    let userInput = document.getElementById("userInput").value;
    if (!userInput) return;

    // Send text input to FastAPI backend
    let response = await fetch("http://localhost:8000/submit/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userInput }),
    });

    let data = await response.json();
    document.getElementById("response").innerText = "Bot: " + data.result[0].label;
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

        let response = await fetch("http://localhost:8000/submit/audio", {
            method: "POST",
            body: formData,
        });

        let data = await response.json();
        document.getElementById("response").innerText = "Bot: " + data.emotions[0].label;
    };

    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), 5000);  // Record for 5 seconds
});
