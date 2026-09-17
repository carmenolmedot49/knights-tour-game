// INICIALIZACIÓN DEL TABLERO EN MEMORIA
function InitBoard() {
    board = [];
    for (let i = 0; i < BoardSize; i++) {
        board[i] = [];
        for (let j = 0; j < BoardSize; j++) {
            board[i][j] = 0;
        }
    }
}

// Generar dinámicamente el HTML del tablero con las casillas más pequeñas según el nivel
function GenerateBoardHTML() {
    const tablero = document.getElementById("tablero");
    if (!tablero) return;

    tablero.innerHTML = "";
    // Ajusta las columnas y filas según BoardSize usando fr (fracciones iguales)
    tablero.style.gridTemplateColumns = `repeat(${BoardSize}, 1fr)`;
    tablero.style.gridTemplateRows = `repeat(${BoardSize}, 1fr)`;

    for (let j = 0; j < BoardSize; j++) {
        for (let i = 0; i < BoardSize; i++) {
            let cell = document.createElement("div");
            cell.id = "C" + i + "_" + j;
            cell.className = "casilla " + ((i + j) % 2 === 0 ? "blanca" : "negra");
            cell.onclick = function() { CheckCell(i, j); };
            tablero.appendChild(cell);
        }
    }
}

// LIMPIEZA DE INTERFAZ HTML Y RESETEO LÓGICO
// Limpiar y regenerar el tablero
function ClearBoard() {
    InitBoard();
    GenerateBoardHTML();
}

// PINTAR CASILLA (RECORRIDA)
function PaintCell(x, y) {
    let cell = document.getElementById("C" + x + "_" + y);
    if (cell) {
        cell.removeAttribute("style");
        cell.classList.remove("caballo");
        cell.classList.add("recorrida");
        // Si quieres mantener la imagen del caballo en las casillas transitadas:
        cell.innerHTML = '<img src="horse.png" alt="Caballo" style="width:100%; height:100%; opacity:1;">';
    }
}

// PINTAR CASILLA CON CABALLO
function PaintHorseCell(x, y) {
    let cell = document.getElementById("C" + x + "_" + y);
    if (cell) {
        cell.removeAttribute("style");
        cell.classList.remove("recorrida");
        cell.classList.add("caballo");
        // Mantiene/inserta la imagen del caballo
        cell.innerHTML = '<img src="horse.png" alt="Caballo" style="width:100%; height:100%;">';
    }
}

// PINTAR CASILLA DE ESTRELLA BONUS
function PaintBonusCell(x, y) {
    let cell = document.getElementById("C" + x + "_" + y);
    if (cell) {
        cell.style.background = "#FFD166";
        cell.innerHTML = '<img src="estrellablanca.png" alt="Bonus" style="width:100%; height:100%;">';
    }
}

// PINTAR CONFIGURACIÓN DE NIVELES
function setBoard() {
    // Tablero limpio para todos los niveles (la dificultad se define por los movimientos)
    return;
}

