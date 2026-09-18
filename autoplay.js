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

// GANAR JUEGO: Exige la totalidad de las casillas del tablero actual
function CheckSuccessfulEnd() { 
    const visited = countVisitedCells();
    const target = LevelMoves;

    if (visited >= target) {
        SuccessfullEnd = true;
        ShowMessage(translations[currentLang].victory, false); 
        return true;
    }
    return false;
}

// PERDER JUEGO Y CÁLCULO DE OPCIONES
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

    if (visited >= LevelMoves) {
        CheckSuccessfulEnd();
        return;
    }

    // Si no quedan movimientos en L y tampoco bonus acumulados -> Game Over siempre
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

function SelectCell(x, y, isDirectBonusJump) {
    MovesDone++;
    Moves--;

    updateBonusBar();

    const movesEl = document.getElementById("moves");
    if (movesEl) movesEl.innerHTML = Moves;

    // Si pisó estrella de forma normal, suma bonus. Si fue por salto directo usando bonus, no incrementa.
    if (board[x][y] === 2 && !isDirectBonusJump) {
        Bonus++;
        const bonusEl = document.getElementById("bonus");
        if (bonusEl) bonusEl.innerHTML = Bonus;

        ShowInfoMessage(translations[currentLang].bonusLanded, "bonusLanded");
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
    let isDirectBonusJump = false;

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

    if (board[x][y] == 1) {
        CheckTrue = false;
    }
    
    // CASO 1: Salto directo a la estrella usando 1 bonus acumulado (En todos los niveles)
    if (!CheckTrue && board[x][y] === 2) {
        if (Bonus > 0) {
            CheckTrue = true;
            isDirectBonusJump = true;
            Bonus--; // Se consume efectivamente el bonus

            const bonusEl = document.getElementById("bonus");
            if (bonusEl) bonusEl.innerHTML = Bonus;

            ShowInfoMessage(translations[currentLang].bonusUsed, "bonusUsed");
        } else {
            ShowInfoMessage(translations[currentLang].needBonusForStar, "needBonusForStar");
        }
    }
    // CASO 2: Salto libre a casilla vacía SOLO cuando no hay opciones en L
    else if (!CheckTrue && Bonus > 0 && board[x][y] === 0) {
        if (Options === 0) {
            CheckTrue = true;
            Bonus--;

            const bonusEl = document.getElementById("bonus");
            if (bonusEl) bonusEl.innerHTML = Bonus;

            ShowInfoMessage(translations[currentLang].bonusUsed, "bonusUsed");
        } else {
            ShowInfoMessage(translations[currentLang].bonusOnlyNoMoves, "bonusOnlyNoMoves");
        }
    }

    if (CheckTrue) {
        PaintCell(CellSelected_x, CellSelected_y);
        PaintHorseCell(x, y);

        CellSelected_x = x;
        CellSelected_y = y;

        SelectCell(x, y, isDirectBonusJump);
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
        const visited = countVisitedCells();
        const remainingCells = LevelMoves - visited;

        if (Moves < remainingCells) {
            Moves++;
            const movesEl = document.getElementById("moves");
            if (movesEl) movesEl.innerHTML = Moves;
        }
        
        ShowInfoMessage(translations[currentLang].bonusUnlocked, "bonusUnlocked");

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

    setLevelMoves();
    setRequiredMoves();

    InitBoard();
    ClearBoard();
    setBoard();
    ResetTime();
    StartTime();

    let x = Math.floor(Math.random() * BoardSize);
    let y = Math.floor(Math.random() * BoardSize);

    board[x][y] = 1;

    CellSelected_x = x;
    CellSelected_y = y;

    MovesDone = 1;
    Moves = LevelMoves - 1;
    Bonus = 0;

    const movesEl = document.getElementById("moves");
    if (movesEl) movesEl.innerHTML = Moves;

    const bonusEl = document.getElementById("bonus");
    if (bonusEl) bonusEl.innerHTML = Bonus;

    const bf = document.getElementById("bonus-fill");
    if (bf) bf.style.width = "0%";

    PaintHorseCell(x, y);
    
    // Calcula y actualiza las opciones disponibles al arrancar el nivel de inmediato
    CheckGameOver(x, y); 

    if (isFirstStart) {
    ShowInfoMessage(translations[currentLang].welcome, "welcome");
    } else {
        ShowInfoMessage(translations[currentLang].level2BonusTip, "level2BonusTip");
    }
}

autoplay();
