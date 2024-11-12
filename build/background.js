// public/background.js
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

chrome.downloads.onCreated.addListener((downloadItem) => {
  console.log("New download started:", downloadItem);
});

chrome.downloads.onChanged.addListener((downloadDelta) => {
  console.log("Download changed:", downloadDelta);
});

chrome.action.onClicked.addListener(() => {
  chrome.windows.create({
    url: chrome.runtime.getURL("index.html"),
    type: "popup",
    width: 800,
    height: 600,
    focused: true,
  });
});
