const difficulty_level = {
    easy: { row: 9, col: 9, mines: 10, timer: 10 * 60 },
    medium: { row: 16, col: 16, mines: 40, timer: 40 * 60 },
    hard: { row: 16, col: 30, mines: 99, timer: 99 * 60 },
    custom: { row: 1, col: 1, mines: 1, timer: 10 * 60 }
};

let rows, cols, mines, timer;
let minePositions = [];
let gameActive = false;
let interval = null;
let timeLeft = 0;

document.addEventListener('DOMContentLoaded', () => {
    const defaultDifficulty = "easy";
    const defaultSettings = difficulty_level[defaultDifficulty];

    rows = defaultSettings.row;
    cols = defaultSettings.col;
    mines = defaultSettings.mines;
    timer = defaultSettings.timer;
    timeLeft = timer;
    document.getElementById("timer").textContent = timeLeft;

    clearPlayfield();
    game(rows, cols, mines, timer);

    document.querySelector('main section p:nth-of-type(2)').innerText = `Miny: ${mines}`;

    displayRanking();
});

const select = document.getElementById("difficultySelect");
select.addEventListener("change", () => {
    const selectedValue = select.value;
    const selectedSettings = difficulty_level[selectedValue];

    rows = selectedSettings.row;
    cols = selectedSettings.col;
    mines = selectedSettings.mines;
    timer = selectedSettings.timer;
    timeLeft = timer;
    document.getElementById("timer").textContent = timeLeft;

    clearPlayfield();
    game(rows, cols, mines, timer);

    document.querySelector('main section p:nth-of-type(2)').innerText = `Miny: ${mines}`;
});

document.getElementById("newGame").addEventListener("click", (e) => {
    e.preventDefault();

    const selectedValue = select.value;
    const selectedSettings = difficulty_level[selectedValue];

    rows = selectedSettings.row;
    cols = selectedSettings.col;
    mines = selectedSettings.mines;
    timer = selectedSettings.timer;
    timeLeft = timer;
    document.getElementById("timer").textContent = timeLeft;

    clearPlayfield();
    game(rows, cols, mines, timer);

    document.querySelector('main section p:nth-of-type(2)').innerText = `Miny: ${mines}`;
});

function clearPlayfield() {
    const playField = document.getElementById("playField");
    playField.innerHTML = "";
    gameActive = false;
    minePositions = [];
    if (interval) {
        clearInterval(interval);
        interval = null;
    }
}

function game(rows, cols, mines, timer) {
    gameActive = true;
    let firstClick = true;
    let positions = [];
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            positions.push([i, j]);
        }
    }

    for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    minePositions = positions.slice(0, mines);

    const playField = document.getElementById("playField");
    for (let i = 0; i < rows; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j < cols; j++) {
            let td = document.createElement("td");
            td.dataset.row = i;
            td.dataset.col = j;

            td.addEventListener("click", () => {

                if (firstClick){
                    firstClick = false;
                    startTimer(timer);
                }

                if (!gameActive) return;

                if (check_if_bomb(i, j)) {
                    td.innerText = "💣";
                    td.classList.add("revealed-bomb");
                    gameOver(false, select.value, timeLeft);
                }
                else {
                    check_further_fields(i, j);
                    checkWinCondition();
                }
            });

            td.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                if (!gameActive) return;

                if (!td.classList.contains("revealed")) {
                    if (td.classList.contains("flagged")) {
                        td.classList.remove("flagged");
                        td.innerText = "";
                    } else {
                        td.classList.add("flagged");
                        td.innerText = "🚩";
                    }
                }
            });

            tr.appendChild(td);
        }
        playField.appendChild(tr);
    }
}

function startTimer(startTime) {
    timeLeft = startTime;
    document.getElementById("timer").textContent = timeLeft;
    interval = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(interval);
            interval = null;
            alert("Czas minął!");
            gameOver(false, select.value, timeLeft);
        }
    }, 1000);
}

function check_if_bomb(x, y) {
    return minePositions.some(pos => pos[0] === x && pos[1] === y);
}

function count_bombs_around(x, y) {
    let count = 0;
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) continue;
            let newX = x + dx;
            let newY = y + dy;
            if (
                newX >= 0 && newX < rows &&
                newY >= 0 && newY < cols &&
                check_if_bomb(newX, newY)
            ) {
                count++;
            }
        }
    }
    return count;
}

function check_further_fields(x, y) {
    if (x < 0 || x >= rows || y < 0 || y >= cols) {
        return;
    }

    let cell = document.querySelector(`#playField tr:nth-child(${x + 1}) td:nth-child(${y + 1})`);

    if (cell.classList.contains("revealed") || cell.classList.contains("flagged") || check_if_bomb(x, y)) {
        return;
    }

    const bombsAround = count_bombs_around(x, y);

    cell.classList.add("revealed");
    cell.classList.remove("flagged");

    if (bombsAround > 0) {
        cell.innerText = bombsAround;
        cell.classList.add(`bombs-${bombsAround}`);
        return;
    }

    cell.innerText = "";

    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) continue;
            check_further_fields(x + dx, y + dy);
        }
    }
}

function gameOver(isWin, difficulty, timeLeft) {
    gameActive = false;
    clearInterval(interval);
    interval = null;

    if (!isWin) {
        for (let [x, y] of minePositions) {
            let bombTd = document.querySelector(`#playField tr:nth-child(${x + 1}) td:nth-child(${y + 1})`);
            if (!bombTd.classList.contains("revealed-bomb")) {
                bombTd.innerText = "💣";
                bombTd.classList.add("revealed-bomb");
            }
        }
        setTimeout(() => {
            alert("BUM! Koniec gry!");
        }, 100);
    } else {
        for (let [x, y] of minePositions) {
            let bombTd = document.querySelector(`#playField tr:nth-child(${x + 1}) td:nth-child(${y + 1})`);
            bombTd.innerText = "🚩";
            bombTd.classList.add("flagged");
        }

        setTimeout(() => {
            alert("Gratulacje! Wygrałeś!");

            const savedRanking = JSON.parse(localStorage.getItem("ranking")) || {
                best_easy: { time: 0, user: null },
                best_medium: { time: 0, user: null },
                best_hard: { time: 0, user: null }
            };

            const key = `best_${difficulty}`;

            if (timeLeft > savedRanking[key].time) {
                const name = prompt("Nowy rekord! Jak się nazywasz?");
                savedRanking[key] = {
                    time: timeLeft,
                    user: name || "Anonim"
                };

                localStorage.setItem("ranking", JSON.stringify(savedRanking));
                displayRanking();
                alert("Rekord zapisany!");
            }
        }, 100);
    }
}

function checkWinCondition() {
    const totalCells = rows * cols;
    const revealedCells = document.querySelectorAll("#playField td.revealed").length;

    if (revealedCells === totalCells - mines) {
        gameOver(true, select.value, timeLeft);
    }
}

function displayRanking() {
    const savedRanking = JSON.parse(localStorage.getItem("ranking")) || {
        best_easy: { time: 0, user: null },
        best_medium: { time: 0, user: null },
        best_hard: { time: 0, user: null }
    };

    for (let level of ["easy", "medium", "hard"]) {
        const timeEl = document.getElementById(`best_${level}_time`);
        const userEl = document.getElementById(`best_${level}_user`);

        if (savedRanking[`best_${level}`].time !== 0) {
            timeEl.innerText = savedRanking[`best_${level}`].time;
            userEl.innerText = savedRanking[`best_${level}`].user;
        }
    }
}
