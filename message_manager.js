function ShowMessage(string_notification, isGameOver) {
    ResetTime();

    const messagePanel = document.getElementById("message");
    const notification = document.getElementById("notification");
    const messageButtons = document.getElementById("messageButtons");
    const retryBtn = document.getElementById("retryBtn");
    const nextLevelBtn = document.getElementById("nextLevelBtn");
    const continueBtn = document.getElementById("continueBtn");

    let mins = (typeof Total_mins !== "undefined") ? Total_mins : 0;
    let secs = (typeof Total_secs !== "undefined") ? Total_secs : 0;
    
    let timeStr = (mins < 10 ? "0" + mins : mins) + ":" + (secs < 10 ? "0" + secs : secs);
    const total = Number(LevelMoves) || 64;
    const hechos = typeof countVisitedCells === "function" ? countVisitedCells() : 0;

    let string_score = `<br><strong>Level / Nivel ${Level}</strong><br>`;
    string_score += `Tiempo / Time: ${timeStr}<br>`;
    string_score += `Casillas / Squares: ${hechos}/${total}`;

    if (messagePanel && notification) {
        messagePanel.style.display = "block";
        notification.innerHTML = string_notification + "<br>" + string_score;

        if (messageButtons) messageButtons.style.display = "block";

        if (isGameOver) {
            if (retryBtn) {
                retryBtn.style.display = "inline-block";
                retryBtn.textContent = translations[currentLang]?.retryBtn || "Reintentar";
            }
            if (nextLevelBtn) nextLevelBtn.style.display = "none";
            if (continueBtn) continueBtn.style.display = "none";
        } else {
            if (retryBtn) retryBtn.style.display = "none";
            if (nextLevelBtn) {
                nextLevelBtn.style.display = "inline-block";
                nextLevelBtn.textContent = translations[currentLang]?.nextLevelBtn || "Siguiente Nivel";
            }
            if (continueBtn) continueBtn.style.display = "none";
        }
    }
}

function retryLevel() {
    hideMessage();
    autoplay();
}

function continueToNextLevel() {
    hideMessage();
    if (Level >= 4) {
        ShowFinalCongratulations();
    } else {
        setLevelParameters(true);
        autoplay();
    }
}

function ShowFinalCongratulations() {
    const messagePanel = document.getElementById("message");
    const notification = document.getElementById("notification");
    const dataMessage = document.getElementById("dataMessage");
    const messageButtons = document.getElementById("messageButtons");
    const retryBtn = document.getElementById("retryBtn");
    const nextLevelBtn = document.getElementById("nextLevelBtn");
    const continueBtn = document.getElementById("continueBtn");

    if (messagePanel && notification) {
        messagePanel.style.display = "block";
        notification.innerHTML = translations[currentLang].finalCongratulations;
        if (dataMessage) dataMessage.innerHTML = "";
        if (messageButtons) messageButtons.style.display = "block";

        if (retryBtn) retryBtn.style.display = "none";
        if (nextLevelBtn) nextLevelBtn.style.display = "none";
        
        if (continueBtn) {
            continueBtn.style.display = "inline-block";
            continueBtn.textContent = translations[currentLang]?.restartBtn || "Reiniciar Juego";
            continueBtn.onclick = function() {
                hideMessage();
                restartGame();
            };
        }
    }
}

function restartGame() {
    Level = 1;
    const nivelEl = document.getElementById("nivel-value");
    if (nivelEl) nivelEl.innerHTML = Level;
    
    autoplay();
}

function ShowInfoMessage(text) {
    const messagePanel = document.getElementById("message");
    const notification = document.getElementById("notification");
    const dataMessage = document.getElementById("dataMessage");
    const messageButtons = document.getElementById("messageButtons");
    const retryBtn = document.getElementById("retryBtn");
    const nextLevelBtn = document.getElementById("nextLevelBtn");
    const continueBtn = document.getElementById("continueBtn");

    if (messagePanel && notification) {
        messagePanel.style.display = "block";
        notification.innerHTML = text;
        if (dataMessage) dataMessage.innerHTML = "";
        if (messageButtons) messageButtons.style.display = "block";

        if (retryBtn) retryBtn.style.display = "none";
        if (nextLevelBtn) nextLevelBtn.style.display = "none";
        if (continueBtn) {
            continueBtn.style.display = "inline-block";
            continueBtn.textContent = translations[currentLang]?.understandBtn || "¡Entendido!";
            continueBtn.onclick = hideMessage;
        }
    }
}

function hideMessage() {
    const messagePanel = document.getElementById("message");
    if (messagePanel) messagePanel.style.display = "none";
}
