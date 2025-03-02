chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "startScraping") {
        let pageData = {
            title: document.title,
            url: window.location.href,
            headings: [...document.querySelectorAll("h1, h2, h3")].map(h => h.innerText),
            paragraphs: [...document.querySelectorAll("p")].map(p => p.innerText).slice(0, 5) // Limit to 5 paragraphs
        };

        // Send the scraped data back to background.js
        chrome.runtime.sendMessage({ action: "scrapedData", data: pageData });
    }
});
