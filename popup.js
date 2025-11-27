document.addEventListener('DOMContentLoaded', function() {
    checkSurveyStatus();

    document.getElementById('checkBtn').addEventListener('click', function() {
        checkSurveyStatus();
    });


    document.getElementById('fillBtn').addEventListener('click', function() {
        const selectedMode = document.querySelector('input[name="mode"]:checked').value;
        sendMessageToContent({ action: "FILL_SURVEY", mode: selectedMode });
        window.close();
    });
});

function checkSurveyStatus() {
    const statusDiv = document.getElementById('status');
    const fillBtn = document.getElementById('fillBtn');

    statusDiv.textContent = "Kontrol ediliyor...";
    statusDiv.className = "status-box status-wait";
    fillBtn.disabled = true;

    sendMessageToContent({ action: "CHECK_STATUS" }, (response) => {
        if (chrome.runtime.lastError || !response) {
            statusDiv.textContent = "OBS Sayfası Bulunamadı";
            statusDiv.className = "status-box status-err";
            return;
        }

        if (response.hasSurvey) {
            statusDiv.textContent = "Anket Tespit Edildi! ✅";
            statusDiv.className = "status-box status-ok";
            fillBtn.disabled = false;
        } else {
            statusDiv.textContent = "Anket Tespit Edilemedi! ❌";
            statusDiv.className = "status-box status-err";
        }
    });
}

function sendMessageToContent(message, callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, message, callback);
        }
    });
}