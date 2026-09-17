// Variable para saber qué tipo de mensaje está abierto en el modal
let currentMessageType = null;

function ShowMessage(string_notification, isGameOver) {
    ResetTime();

    // Guardamos el tipo de mensaje activo
    currentMessageType = isGameOver ? "gameOver" : "victory";

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

    // Formateo dinámico según el idioma seleccionado (currentLang)
    let string_score = "";
    if (currentLang === "en") {
        string_score += `<br><strong>Level ${Level}</strong><br>`;
        string_score += `Time: ${timeStr}<br>`;
        string_score += `Squares: ${hechos}/${total}`;
    } else {
        string_score += `<br><strong>Nivel ${Level}</strong><br>`;
        string_score += `Tiempo: ${timeStr}<br>`;
        string_score += `Casillas: ${hechos}/${total}`;
    }

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
    currentMessageType = "finalCongratulations";

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

function ShowInfoMessage(text, messageKey) {
    if (messageKey) {
        currentMessageType = messageKey;
    } else if (text === translations[currentLang]?.welcome) {
        currentMessageType = "welcome";
    }

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
            continueBtn.onclick = function() {
                hideMessage();
            };
        }
    }
}

// Función unificada para ocultar el mensaje y controlar la secuencia
function hideMessage() {
    const messageBox = document.getElementById("message");
    if (messageBox) messageBox.style.display = "none";

    // Si veníamos del mensaje de bienvenida inicial, lanzamos inmediatamente el tip de bonus
    if (isFirstStart && currentMessageType === "welcome") {
        isFirstStart = false; // Desactivamos la bienvenida para que no vuelva a salir al reintentar
        ShowInfoMessage(translations[currentLang].level2BonusTip, "level2BonusTip");
    }
}

// Alias con mayúscula para compatibilidad con llamadas externas
function HideMessage() {
    hideMessage();
}
