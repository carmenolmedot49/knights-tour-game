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
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
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

    // Derrota: Sin movimientos restantes O sin opciones normales y sin bonus acumulados
    if (Moves <= 0 || (Options === 0 && bonusNum === 0)) {
        ShowMessage(translations[currentLang].gameOver, true);
    }
} 

function CheckMoves(x, y, mov_x, mov_y) {
    let option_x = x + mov_x;
    let option_y = y + mov_y;

    if (option_x < 8 && option_y < 8 && option_x >= 0 && option_y >= 0) {
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
    
    // Uso de salto libre por bonus acumulado
    if (!CheckTrue && Bonus > 0 && board[x][y] == 0) {
        CheckTrue = true;
        Bonus--;

        const bonusEl = document.getElementById("bonus");
        if (bonusEl) bonusEl.innerHTML = Bonus;

        ShowInfoMessage(translations[currentLang].bonusUsed);
    }

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
        Moves++;
        const movesEl = document.getElementById("moves");
        if (movesEl) movesEl.innerHTML = Moves;
        
        ShowInfoMessage(translations[currentLang].bonusUnlocked);

        let emptyCells = [];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
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

    InitBoard();
    ClearBoard();
    setBoard();
    ResetTime();
    StartTime();

    let x = Math.floor(Math.random() * 8);
    let y = Math.floor(Math.random() * 8);
    
    while (board[x][y] !== 0) {
        x = Math.floor(Math.random() * 8);
        y = Math.floor(Math.random() * 8);
    }

    CellSelected_x = x;
    CellSelected_y = y;

    board[x][y] = 1;
    
    PaintHorseCell(x, y);
    CheckGameOver(x, y); 
}

autoplay();