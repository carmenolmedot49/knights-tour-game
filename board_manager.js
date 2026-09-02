// INICIALIZACIÓN DEL TABLERO EN MEMORIA
function InitBoard() {
    board = [];
    for (let i = 0; i < 8; i++) {
        board[i] = [];
        for (let j = 0; j < 8; j++) {
            board[i][j] = 0;
        }
    }
}

// LIMPIEZA DE INTERFAZ HTML Y RESETEO LÓGICO
function ClearBoard() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            board[i][j] = 0;
            let cell = document.getElementById("C" + i + j);
            if (cell) {
                cell.innerHTML = "";
                cell.removeAttribute("style"); // Remueve estilos inline para recuperar los de la hoja CSS
                cell.className = "casilla " + ((i + j) % 2 === 0 ? "blanca" : "negra");
            }
        }
    }
}

// PINTAR CASILLA (RECORRIDA)
function PaintCell(x, y) {
    let cell = document.getElementById("C" + x + y);
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
    let cell = document.getElementById("C" + x + y);
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
    let cell = document.getElementById("C" + x + y);
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