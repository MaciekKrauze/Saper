
const difficulty_level = {
    easy : {row : 9, col : 9, mines : 5, timer : 10},
    medium : {row : 16, col : 16, mines : 10, timer : 20},
    hard : {row: 16, col : 30, mines : 15, timer : 10}
    ,custom : {row : 1, col : 1, mines : 1, timer : 10}
}

const ranking = {
    best_easy : {time : 0, user : null},
    best_medium : {time : 0, user : null},
    best_hard : {time : 0, user : null}
}


if (ranking.best_easy.time !== 0){
    document.getElementById('best_easy_time').innerText = ranking.best_easy.time;
    document.getElementById('best_easy_user').innerText = ranking.best_easy.user;
}
if (ranking.best_medium.time !== 0){
    document.getElementById('best_medium_time').innerText = ranking.best_medium.time;
    document.getElementById('best_medium_user').innerText = ranking.best_medium.user;
}
if (ranking.best_hard.time !== 0){
    document.getElementById('best_hard_time').innerText = ranking.best_hard.time;
    document.getElementById('best_hard_user').innerText = ranking.best_hard.user;
}


let cols = 9;
let rows = 9;
let mines = 10;

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

let minePositions = positions.slice(0, mines);

for (let i = 0; i < rows; i++) {
    let tr = document.createElement("tr");
    for (let j = 0; j < cols; j++) {
        let td = document.createElement("td");

        td.innerText = "";

        td.addEventListener("click", () => {
            if (check_if_bomb(i, j)) {
                td.innerText = "💣";
                alert("BUM!");
                for (let k = 0; k < minePositions.length; k++) {
                    let [x, y] = minePositions[k];
                    let bombTd = document.querySelector(`#playField tr:nth-child(${x + 1}) td:nth-child(${y + 1})`);
                    bombTd.innerText = "💣";
                    bombTd.classList.add("revealed-bomb");
                }
            } else {

                const bombsAround = count_bombs_around(i, j);
                td.innerText = bombsAround > 0 ? bombsAround : "";
                td.classList.add("revealed")
            }
        });
        tr.appendChild(td);
    }
    document.getElementById("playField").appendChild(tr);
}



function check_if_bomb (x, y){
    return minePositions.some(pos => pos[0] === x && pos[1] === y);
}

function count_bombs_around(x, y) {
    let count = 0;
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) continue; // pomiń środek (kliknięte pole)
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


// let el = document.createElement("div");
// el.innerText = "test";
// document.getElementById("playfield").appendChild(el)