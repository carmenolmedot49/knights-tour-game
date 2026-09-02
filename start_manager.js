// VARIABLES GLOBALES
let Level = 1;
let RequiredMoves = 0;
let Moves = 0;
let MovesDone = 0;
let Bonus = 0;
let LevelMoves = 0;
let board = [];
let currentLang = "es"; // Idioma por defecto

// Diccionario i18n
const translations = {
  es: {
    welcome: "¡Bienvenido al Recorrido del Caballo!\n\nREGLAS DEL JUEGO:\n1. Objetivo: Recorre todas las casillas del tablero exigidas en cada nivel pasando solo una vez por cada una.\n2. Movimiento: El caballo se desplaza en forma de 'L'.\n3. Casillas Bonus: Al caer en una estrella o completar suficientes saltos, obtienes movimientos extra.\n4. Victoria: Completa todas las casillas exigidas del nivel antes de quedarte sin movimientos.\n\n¡Haz 'clic' en el tablero para empezar!",
    bonusLanded: "¡Has caído en una casilla bonus y ganas un movimiento extra!",
    bonusUsed: "¡Has usado un bonus para moverte libremente!",
    bonusUnlocked: "¡Bonus desbloqueado!\n¡Has ganado un movimiento extra!",
    victory: "¡Has ganado la partida!",
    gameOver: "¡Has perdido!",
    finalCongratulations: "¡Felicidades! ¡Has completado todos los niveles del juego!",
    understandBtn: "¡Entendido!",
    startFooterHint: "¡Haz clic en una casilla para empezar!",
    themes: {
      tradicional: "Tradicional",
      rosa: "Rosa",
      azul: "Azul",
      verde: "Verde",
      oscuro: "Lavanda",
      rojo: "Rojo"
    }
  },
  en: {
    welcome: "Welcome to the Knight's Tour!\n\nGAME RULES:\n1. Objective: Visit all the required board squares in each level without repeating any.\n2. Movement: The knight moves in an 'L' shape.\n3. Bonus Squares: Land on a star or complete enough jumps to gain extra moves.\n4. Victory: Complete all the required squares for the level before running out of moves.\n\nClick on the board to start playing!",
    bonusLanded: "You landed on a bonus square and earned an extra move!",
    bonusUsed: "You used a bonus to move freely!",
    bonusUnlocked: "Bonus unlocked!\nYou gained an extra move!",
    victory: "You won the game!",
    gameOver: "Game Over!",
    finalCongratulations: "Congratulations! You completed all game levels!",
    understandBtn: "Got it!",
    startFooterHint: "Click on a square to start!",
    themes: {
      tradicional: "Traditional",
      rosa: "Pink",
      azul: "Blue",
      verde: "Green",
      oscuro: "Lavender",
      rojo: "Red"
    }
  }
};

function changeLanguage(lang) {
  currentLang = lang || "es";

  // 1. Cambiar el título principal
  const tituloEl = document.querySelector("header h1");
  if (tituloEl) tituloEl.textContent = (currentLang === "es" ? "Recorrido del Caballo" : "Knight's Tour");

  // 2. Si el mensaje modal está visible, actualizar el mensaje de bienvenida
  const messagePanel = document.getElementById("message");
  if (messagePanel && messagePanel.style.display === "block") {
    if (MovesDone === 0) {
      ShowInfoMessage(translations[currentLang].welcome);
    }
  }

  // 3. Traducir botón "¡Entendido!" / "Got it!"
  const continueBtn = document.getElementById("continueBtn");
  if (continueBtn) continueBtn.textContent = translations[currentLang].understandBtn;

  // 4. Traducir el mensaje bajo el tablero
  const footerMsg = document.getElementById("mensaje");
  if (footerMsg) footerMsg.textContent = translations[currentLang].startFooterHint;

  // 5. Traducir el menú de selección de temas (colores)
  const themeMap = translations[currentLang].themes;
  for (let themeKey in themeMap) {
    const opt = document.getElementById("opt-theme-" + themeKey);
    if (opt) opt.textContent = themeMap[themeKey];
  }

  // 6. Traducir las etiquetas fijas de la interfaz (Menú superior)
  const movEl = document.getElementById("movimientos");
  if (movEl) movEl.childNodes[0].nodeValue = (currentLang === "es" ? "Movimientos: " : "Moves: ");

  const tiempoEl = document.getElementById("tiempo");
  if (tiempoEl) tiempoEl.childNodes[0].nodeValue = (currentLang === "es" ? "Tiempo: " : "Time: ");

  const opcionesEl = document.getElementById("opciones");
  if (opcionesEl) opcionesEl.childNodes[0].nodeValue = (currentLang === "es" ? "Opciones: " : "Options: ");

  const nivelEl = document.getElementById("nivel");
  if (nivelEl) nivelEl.childNodes[0].nodeValue = (currentLang === "es" ? "Nivel: " : "Level: ");
}

function setRequiredMoves() {
  if (Level == 1) RequiredMoves = 5;
  if (Level == 2) RequiredMoves = 8;
  if (Level == 3) RequiredMoves = 10;
  if (Level == 4) RequiredMoves = 15;
}

function setLevelMoves() {
  if (Level == 1) LevelMoves = 44;
  if (Level == 2) LevelMoves = 54;
  if (Level == 3) LevelMoves = 64;
  if (Level == 4) LevelMoves = 64;
}

function setLevelParameters(nextLevel) {
  if (nextLevel) {
    Level++;
  } else {
    retryLevel();
    return;
  }

  const nivelEl = document.getElementById("nivel-value");
  if (nivelEl) nivelEl.innerHTML = Level;

  Bonus = 0;
  const bonusEl = document.getElementById("bonus");
  if (bonusEl) bonusEl.innerHTML = Bonus;

  setLevelMoves();
  setRequiredMoves();
  Moves = LevelMoves;
  
  const movesEl = document.getElementById("moves");
  if (movesEl) movesEl.innerHTML = Moves;

  MovesDone = 0;

  const bf = document.getElementById("bonus-fill");
  if (bf) bf.style.width = "0%";
}