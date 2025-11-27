chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    
    if (!window.location.href.includes("obs") && !window.location.href.includes("OBS")) {
        sendResponse({ hasSurvey: false, error: "Not OBS" });
        return;
    }

    if (request.action === "CHECK_STATUS") {
        const radios = document.querySelectorAll("input[type='radio']");
        sendResponse({ hasSurvey: radios.length > 0 });
    }

    if (request.action === "FILL_SURVEY") {
        const rows = document.querySelectorAll("tr");
        const mode = request.mode;

        rows.forEach(function(row) {
            const radios = row.querySelectorAll("input[type='radio']");
            
            if (radios.length > 0) {
                let indexToClick = -1;

                if (mode === "random") {
                    indexToClick = Math.floor(Math.random() * radios.length);
                } else {
                    let targetIndex = parseInt(mode);
                    if (targetIndex < radios.length) {
                        indexToClick = targetIndex;
                    }
                }

                if (indexToClick !== -1 && radios[indexToClick]) {
                    radios[indexToClick].click();
                }
            }
        });
        
        console.log("Anket doldurma işlemi tamamlandı. Mod:", mode);
    }
});