document.addEventListener("DOMContentLoaded", function () {
    let responseContainer = document.getElementById("responseContainer");

    if (!responseContainer) {
        console.error("Error: responseContainer does not exist in popup.html");
        return;
    }

    // Handle chatbot text submission
    document.getElementById("sendText").addEventListener("click", async () => {
        let userInput = document.getElementById("userInput").value;
        if (!userInput) return;

        try {
            let response = await fetch("http://127.0.0.1:8000/submit", { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: userInput }),
            });

            if (!response.ok) throw new Error("Network response was not ok");

            let data = await response.json();
            responseContainer.innerHTML = ""; // Clear previous responses

            data.result.forEach(([text, labels]) => {
                let messageDiv = document.createElement("div");
                messageDiv.className = "p-3 border rounded-lg bg-gray-50 shadow-md";

                let textElement = document.createElement("p");
                textElement.className = "text-lg font-semibold";
                textElement.innerText = text;
                messageDiv.appendChild(textElement);

                responseContainer.appendChild(messageDiv);
            });

        } catch (error) {
            console.error("Fetch error:", error);
            responseContainer.innerHTML = "<p>⚠️ Error connecting to the server.</p>";
        }
    });

    // Handle Scrape Data button
    document.getElementById("scrapeData").addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0) {
                console.error("No active tab found.");
                return;
            }

            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ["content.js"]
            }, () => {
                if (chrome.runtime.lastError) {
                    console.error("Error injecting content script:", chrome.runtime.lastError);
                } else {
                    console.log("Content script injected successfully.");
                    chrome.tabs.sendMessage(tabs[0].id, { action: "startScraping" });
                }
            });
        });
    });

    // Receive scraped data from `content.js`
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "scrapedData") {
            if (!responseContainer) {
                console.error("Error: responseContainer not found when processing scraped data.");
                return;
            }

            responseContainer.innerHTML = `
                <h3>Scraped Data:</h3>
                <p><strong>Title:</strong> ${message.data.title}</p>
                <p><strong>URL:</strong> ${message.data.url}</p>
                <h4>Headings:</h4>
                <ul>${message.data.headings.map(h => `<li>${h}</li>`).join("")}</ul>
                <h4>Paragraphs:</h4>
                <p>${message.data.paragraphs.join("<br><br>")}</p>
            `;
        }
    });
});
