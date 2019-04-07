chrome.runtime.onInstalled.addListener((details) => {
	console.bg("I won't be displayed since I am already in background script")
})
