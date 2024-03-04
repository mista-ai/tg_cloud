chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    chrome.storage.sync.get(['chat_id', 'extensionEnabled'], function(data) {
        if (data.extensionEnabled) { // Only proceed if the extension is enabled
            if (request.action == "downloadMedia") {
                let chat_id = data.chat_id || 'default'; // Use 'default' if no ID is set
                let url = request.mediaSrc;
                let filename = chat_id + "_" + url.substring(url.lastIndexOf('/') + 1);
                // Execute the download
                chrome.downloads.download({
                    url: url,
                    filename: filename // Prepend the custom ID to the filename
                }, function(downloadId) {
                    console.log("Media is being downloaded: ", downloadId);
                });
            }
        }
    });
});
