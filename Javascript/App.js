
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


let col = 5;
let row = 5;
let mines = 5;
for (let i = 0; i < row; i++) {
    let row = document.createElement("tr")
    document.getElementById("playfield").appendChild(row)
    for (let j = 0; j < col; j++) {
        let col = document.createElement("td");




        col.innerText = "test";
        row.appendChild(col)
    }
}





// let el = document.createElement("div");
// el.innerText = "test";
// document.getElementById("playfield").appendChild(el)