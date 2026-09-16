// VARIABLES GLOBALES DE ESTADO DE JUEGO
var SuccessfullEnd = false; 
var CellSelected_x;
var CellSelected_y;
var Options = 0;
var nextLevel = false;
var isFirstStart = true;

// Cuenta cuántas casillas únicas han sido visitadas (valor 1 en board)
function countVisitedCells() {
    let count = 0;
    for (let i = 0; i < BoardSize; i++) {
        for (let j = 0; j < BoardSize; j++) {
            if (board[i][j] === 1) count++;
        }
    }
    return count;
}

// GANAR JUEGO: Verifica si se completaron las casillas objetivo del nivel
function CheckSuccessfulEnd() { 
    const visited = countVisitedCells();
    const target = LevelMoves || 64;

    if (visited >= target) {
        SuccessfullEnd = true;
        ShowMessage(translations[currentLang].victory, false); 
        return true;
    }
    return false;
}

// PERDER JUEGO
function CheckGameOver(x, y) {
    Options = 0;

    CheckMoves(x, y, 1, 2);
    CheckMoves(x, y, 2, 1);
    CheckMoves(x, y, 1, -2);
    CheckMoves(x, y, 2, -1);

    CheckMoves(x, y, -1, 2);
    CheckMoves(x, y, -2, 1);
    CheckMoves(x, y, -1, -2);
    CheckMoves(x, y, -2, -1);

    const optionsEl = document.getElementById("options");
    if (optionsEl) optionsEl.innerHTML = Options;

    const bonusNum = parseInt(Bonus, 10) || 0;
    const visited = countVisitedCells();
    const target = LevelMoves || 64;

    // Si ya completó las casillas objetivo
    if (visited >= target) {
        CheckSuccessfulEnd();
        return;
    }

    // Derrota: Sin opciones normales y sin bonus acumulados para saltar
    if (Options === 0 && bonusNum === 0) {
        ShowMessage(translations[currentLang].gameOver, true);
    }
} 

function CheckMoves(x, y, mov_x, mov_y) {
    let option_x = x + mov_x;
    let option_y = y + mov_y;

    if (option_x < BoardSize && option_y < BoardSize && option_x >= 0 && option_y >= 0) {
        if (board[option_x][option_y] === 0 || board[option_x][option_y] === 2) {
            Options++;
        }
    }
}

function SelectCell(x, y) {
    MovesDone++;
    Moves--;

    updateBonusBar();

    const movesEl = document.getElementById("moves");
    if (movesEl) movesEl.innerHTML = Moves;

    if (board[x][y] === 2) {
        Bonus++;
        const bonusEl = document.getElementById("bonus");
        if (bonusEl) bonusEl.innerHTML = Bonus;

        ShowInfoMessage(translations[currentLang].bonusLanded);
    }

    board[x][y] = 1;
    CellSelected_x = x;
    CellSelected_y = y;

    if (CheckSuccessfulEnd()) {
        return;
    }

    CheckNewBonus();
    CheckGameOver(x, y);
}

function CheckCell(x, y) { 
    let CheckTrue = false;

    let dif_x = x - CellSelected_x;
    let dif_y = y - CellSelected_y;

    // Validación de movimiento normal en 'L'
    if (dif_x == 1 && dif_y == -2) CheckTrue = true;
    if (dif_x == 2 && dif_y == -1) CheckTrue = true;
    if (dif_x == 1 && dif_y == 2) CheckTrue = true;
    if (dif_x == 2 && dif_y == 1) CheckTrue = true;
    
    if (dif_x == -1 && dif_y == -2) CheckTrue = true;
    if (dif_x == -2 && dif_y == -1) CheckTrue = true;
    if (dif_x == -1 && dif_y == 2) CheckTrue = true;
    if (dif_x == -2 && dif_y == 1) CheckTrue = true;

    // No se puede volver a pisar una casilla ya visitada
    if (board[x][y] == 1) {
        CheckTrue = false;
    }
    
    // CASO 1: En niveles 1 y 2 permite ir directo a la casilla bonus (board[x][y] == 2)
    if (!CheckTrue && (Level === 1 || Level === 2) && board[x][y] === 2) {
        if (Bonus > 0) {
            CheckTrue = true;
            ShowInfoMessage(translations[currentLang].bonusUsed);
        } else {
            // TRADUCCIÓN APLICADA AQUÍ:
            ShowInfoMessage(translations[currentLang].needBonusForStar || "Necesitas tener al menos 1 bonus acumulado para saltar directamente a la estrella.");
        }
    }
    
    // CASO 2: Salto libre a casilla vacía cuando no hay opciones
    else if (!CheckTrue && Bonus > 0 && board[x][y] == 0) {
        if (Options === 0) {
            CheckTrue = true;
            Bonus--;

            const bonusEl = document.getElementById("bonus");
            if (bonusEl) bonusEl.innerHTML = Bonus;

            ShowInfoMessage(translations[currentLang].bonusUsed);
        } else {
            // TRADUCCIÓN APLICADA AQUÍ:
            ShowInfoMessage(translations[currentLang].bonusOnlyNoMoves || "Solo puedes usar un bonus para saltar libremente a una casilla vacía cuando no tengas opciones de movimiento.");
        }
    }

    // Ejecuta el movimiento si la casilla seleccionada fue validada
    if (CheckTrue) {
        PaintCell(CellSelected_x, CellSelected_y);
        PaintHorseCell(x, y);

        CellSelected_x = x;
        CellSelected_y = y;

        SelectCell(x, y);
    }
}

function updateBonusBar() {
    if (!RequiredMoves) return;
    let percentage = (MovesDone % RequiredMoves) / RequiredMoves * 100;
    const bonusFill = document.getElementById("bonus-fill");
    if (bonusFill) bonusFill.style.width = percentage + "%";
} 

function CheckNewBonus() {
    if (MovesDone > 0 && RequiredMoves > 0 && MovesDone % RequiredMoves === 0) {
        const total = LevelMoves || 64;
        const visited = countVisitedCells();
        const remainingCells = total - visited;

        if (Moves < remainingCells) {
            Moves++;
            const movesEl = document.getElementById("moves");
            if (movesEl) movesEl.innerHTML = Moves;
        }
        
        ShowInfoMessage(translations[currentLang].bonusUnlocked);

        let emptyCells = [];
        for (let i = 0; i < BoardSize; i++) {
            for (let j = 0; j < BoardSize; j++) {
                if (board[i][j] === 0) {
                    emptyCells.push({x: i, y: j});
                }
            }
        }

        if (emptyCells.length > 0) {
            let randomIndex = Math.floor(Math.random() * emptyCells.length);
            let bonusCell = emptyCells[randomIndex];
            
            board[bonusCell.x][bonusCell.y] = 2; 
            PaintBonusCell(bonusCell.x, bonusCell.y);
        }
    }
}

function autoplay() {
    SuccessfullEnd = false;
    Options = 0;
    
    const messageBox = document.getElementById("message");
    if (messageBox) messageBox.style.display = "none";

    if (isFirstStart) {
        ShowInfoMessage(translations[currentLang].welcome);
        isFirstStart = false;
    }

    setLevelMoves();
    setRequiredMoves();

    Moves = LevelMoves || 64;
    MovesDone = 0;
    Bonus = 0;

    // --- ACTUALIZACIÓN DIRECTA EN LA INTERFAZ ---
    const movesEl = document.getElementById("moves");
    if (movesEl) movesEl.innerHTML = Moves;

    const bonusEl = document.getElementById("bonus");
    if (bonusEl) bonusEl.innerHTML = Bonus;

    const bf = document.getElementById("bonus-fill");
    if (bf) bf.style.width = "0%";
    // --------------------------------------------

    InitBoard();
    ClearBoard();
    setBoard();
    ResetTime();
    StartTime();

    let x = Math.floor(Math.random() * BoardSize);
    let y = Math.floor(Math.random() * BoardSize);
    
    while (board[x][y] !== 0) {
        x = Math.floor(Math.random() * BoardSize);
        y = Math.floor(Math.random() * BoardSize);
    }

    CellSelected_x = x;
    CellSelected_y = y;

    board[x][y] = 1;
    
    PaintHorseCell(x, y);
    CheckGameOver(x, y); 
}

autoplay();
