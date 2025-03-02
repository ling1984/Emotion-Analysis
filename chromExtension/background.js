chrome.runtime.onInstalled.addListener(() => {
    console.log("Chatbot Extension Installed");
});

// Listen for messages from popup.js and forward to content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Background received message:", message);

    if (message.action === "scrapeData") {
        // Ensure content script is injected before sending a message
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0) return;
            
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ["content.js"]
            }, () => {
                // Once content.js is injected, send a message
                chrome.tabs.sendMessage(tabs[0].id, { action: "startScraping" });
            });
        });
    }

    if (message.action === "scrapedData") {
        console.log("Scraped Data Received:", message.data);
        chrome.runtime.sendMessage(message);
    }
});
