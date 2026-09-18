let Level = 1;
let RequiredMoves = 0;
let Moves = 0;
let MovesDone = 0;
let Bonus = 0;
let LevelMoves = 0;
let board = [];
let currentLang = "es";

const translations = {
  es: {
    welcome: "¡Bienvenido al Recorrido del Caballo!\n\nREGLAS DEL JUEGO:\n1. Objetivo: Recorre todas las casillas del tablero pasando solo una vez por cada una.\n2. Movimiento: El caballo se desplaza en forma de 'L'.\n3. Barra de saltos: Al completar suficientes movimientos, la barra se llena y ganas 1 movimiento extra en el contador.\n4. Estrellas Bonus: Cada vez que llenas la barra, aparece una estrella en el tablero. Si caes en ella, consigues 1 bonus acumulable para hacer saltos especiales cuando te quedes bloqueado.\n5. Victoria: Completa todas las casillas del tablero para ganar.\n\n¡Haz 'clic' en el tablero para empezar!",    bonusLanded: "¡Has caído en una casilla bonus y ganas un movimiento extra!",
    bonusLanded: "¡Has caído en una casilla bonus y ganas un movimiento extra!",
    bonusUsed: "¡Has usado un bonus para moverte libremente!",
    bonusUnlocked: "¡Bonus desbloqueado!\n¡Has ganado un movimiento extra!",
    victory: "¡Has ganado la partida!",
    gameOver: "¡Has perdido!",
    finalCongratulations: "¡Felicidades! ¡Has completado todos los niveles del juego!",
    understandBtn: "¡Entendido!",
    retryBtn: "Reintentar",
    nextLevelBtn: "Siguiente Nivel",
    restartBtn: "Reiniciar Juego",
    startFooterHint: "¡Haz clic en una casilla para empezar!",
    needBonusForStar: "Necesitas tener al menos 1 bonus acumulado para saltar directamente a la estrella.",
    bonusOnlyNoMoves: "Solo puedes usar un bonus para saltar libremente a una casilla vacía cuando no tengas opciones de movimiento.",
    level2BonusTip: "En este nivel, ¡puedes gastar un movimiento extra para saltar a una casilla bonus! El movimiento se consumirá y la casilla contará como visitada, pero ten en cuenta que funcionará como una casilla normal, sin generar ningún movimiento extra.",
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
    welcome: "Welcome to the Knight's Tour!\n\nGAME RULES:\n1. Objective: Visit all the board squares without repeating any.\n2. Movement: The knight moves in an 'L' shape.\n3. Jump Bar: By completing enough moves, the bar fills up and you gain 1 extra move in your counter.\n4. Bonus Stars: Every time you fill the bar, a star appears on the board. Landing on it awards 1 stackable bonus to make special jumps when you run out of legal moves.\n5. Victory: Complete all squares on the board to win.\n\nClick on the board to start playing!",    bonusLanded: "You landed on a bonus square and earned an extra move!",
    bonusLanded: "You landed on a bonus square and earned an extra move!",
    bonusUsed: "You used a bonus to move freely!",
    bonusUnlocked: "Bonus unlocked!\nYou gained an extra move!",
    victory: "You won the game!",
    gameOver: "Game Over!",
    finalCongratulations: "Congratulations! You completed all game levels!",
    understandBtn: "Got it!",
    retryBtn: "Retry",
    nextLevelBtn: "Next Level",
    restartBtn: "Restart Game",
    startFooterHint: "Click on a square to start!",
    needBonusForStar: "You need at least 1 accumulated bonus to jump directly to the star.",
    bonusOnlyNoMoves: "You can only use a bonus to jump freely to an empty square when you have no legal moves left.",
    level2BonusTip: "In this level, you can spend an extra move to jump to a bonus tile! The move will be consumed, and the tile will count as visited, but keep in mind that it will function like a normal tile, without generating any extra moves.",
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

  // 1. Actualizar títulos y cabeceras
  const tituloEl = document.querySelector("header h1");
  if (tituloEl) tituloEl.textContent = (currentLang === "es" ? "Recorrido del Caballo" : "Knight's Tour");

  // 2. Actualizar etiquetas de la barra de estado
  const movEl = document.getElementById("movimientos");
  if (movEl) movEl.childNodes[0].nodeValue = (currentLang === "es" ? "Movimientos: " : "Moves: ");

  const tiempoEl = document.getElementById("tiempo");
  if (tiempoEl) tiempoEl.childNodes[0].nodeValue = (currentLang === "es" ? "Tiempo: " : "Time: ");

  const opcionesEl = document.getElementById("opciones");
  if (opcionesEl) opcionesEl.childNodes[0].nodeValue = (currentLang === "es" ? "Options: " : "Options: ");

  const nivelEl = document.getElementById("nivel");
  if (nivelEl) nivelEl.childNodes[0].nodeValue = (currentLang === "es" ? "Nivel: " : "Level: ");

  // 3. Actualizar menú de temas
  const themeMap = translations[currentLang].themes;
  for (let themeKey in themeMap) {
    const opt = document.getElementById("opt-theme-" + themeKey);
    if (opt) opt.textContent = themeMap[themeKey];
  }

  // 4. Actualizar pie de página
  const footerMsg = document.getElementById("mensaje");
  if (footerMsg) footerMsg.textContent = translations[currentLang].startFooterHint;

  // 5. ACTUALIZACIÓN EN VIVO DEL MODAL (si está visible)
  const messagePanel = document.getElementById("message");
  if (messagePanel && messagePanel.style.display === "block" && currentMessageType) {
    if (currentMessageType === "welcome") {
      ShowInfoMessage(translations[currentLang].welcome, "welcome");
    } else if (currentMessageType === "victory") {
      ShowMessage(translations[currentLang].victory, false);
    } else if (currentMessageType === "gameOver") {
      ShowMessage(translations[currentLang].gameOver, true);
    } else if (currentMessageType === "finalCongratulations") {
      ShowFinalCongratulations();
    } else if (translations[currentLang][currentMessageType]) {
      ShowInfoMessage(translations[currentLang][currentMessageType], currentMessageType);
    }
  }
}

function setRequiredMoves() {
  if (Level == 1) RequiredMoves = 8;
  if (Level == 2) RequiredMoves = 8;
  if (Level == 3) RequiredMoves = 10;
  if (Level == 4) RequiredMoves = 15;
}

function setLevelMoves() {
  if (Level == 1) BoardSize = 8;
  if (Level == 2) BoardSize = 9;
  if (Level == 3) BoardSize = 10;
  if (Level == 4) BoardSize = 11;

  LevelMoves = BoardSize * BoardSize;
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
