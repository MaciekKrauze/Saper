
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


let cols = 5;
let rows = 5;
let mines = 5;

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

        let isMine = minePositions.some(pos => pos[0] === i && pos[1] === j);
        td.innerText = isMine ? "💣" : "";

        tr.appendChild(td);
    }
    document.getElementById("playfield").appendChild(tr);
}




// let el = document.createElement("div");
// el.innerText = "test";
// document.getElementById("playfield").appendChild(el)