document.getElementById('openCanvas').addEventListener('click', () => {
    // Here you would implement logic to open the canvas
    // For example, you could redirect to canvas.html or open it in a new tab
    chrome.tabs.create({ url: chrome.runtime.getURL('canvas.html') });
});
