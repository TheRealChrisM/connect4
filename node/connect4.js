//voter microservice
const express = require('express');
const app = express();

let port = 3004;

app.use(express.json());


//Initialize variables to be used for game
//GameBoard == [Column][Row]
let gameBoardState = [[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]];
let currentMove = 0
let startTime = null;
let lastMove = null;
let playerControl = 1;
let winner = null;

//Handle logic for a api request to drop a chip
function dropChip(playerID, column){
    if ((playerID == playerControl) && (column < 7) && (winner == null)){
        let columnData = gameBoardState[column];
        for (let row = 0; row < 6; row++) {
            if (columnData[row] == 0){
                columnData[row] = playerID;
                if (checkGameWin(playerControl, column, row)){
                    lastMove = new Date();
                    winner = playerControl;
                    currentMove = currentMove+1
                    return true;
                }
                if (playerControl == 1){
                    playerControl = 2;
                }
                else{
                    playerControl = 1;
                }
                currentMove = currentMove+1;
                if (startTime == null){
                    startTime = new Date();
                }
                lastMove = new Date();
                return true;
            }
        }
    }
    return false;
}

//Reset the game to normal state
function resetGameState(){
    gameBoardState = [[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]];
    currentMove = 0
    startTime = null;
    lastMove = null;
    playerControl = 1;
    winner = null;
}

function checkGameWin(player, chipColumn, chipRow){
    if (checkHorizontalWin(player, chipColumn, chipRow)){
        return true;
    }
    if (checkVerticalWin(player, chipColumn, chipRow)){
        return true;
    }
    if ((checkForwardDiagonalWin(player, chipColumn, chipRow))||(checkBackwardDiagonalWin(player,chipColumn,chipRow))){
        return true;
    }
    return false;
}

function checkHorizontalWin(player, chipColumn, chipRow){
    //Due to chip just being placed there must be atleast one.
    let curStreak = 1;
    //Check to the left of chip
    for (let curColumn = chipColumn-1; curColumn >= 0; curColumn--){
        if (gameBoardState[curColumn][chipRow]==player){
            
            
            curStreak=curStreak+1;
        }
        else{
            break;
        }
    }
    //Check to the right of chip
    for (let curColumn = chipColumn+1; curColumn <= 6; curColumn++){
        if (gameBoardState[curColumn][chipRow]==player){
            curStreak=curStreak+1;
        }
        else{
            break;
        }
    }
    if (curStreak>=4){
        return true;
    }
    else{
        return false;
    }
}

function checkVerticalWin(player, chipColumn, chipRow){
    //Due to chip just being placed there must be atleast one.
    let curStreak = 1;
    //Check below chip
    for (let curRow = chipRow-1; curRow >= 0; curRow--){
        if (gameBoardState[chipColumn][curRow]==player){
            curStreak=curStreak+1;
        }
        else{
            break;
        }
    }
    //Check above chip
    for (let curRow = chipRow+1; curRow <= 5; curRow++){
        if (gameBoardState[chipColumn][curRow]==player){
            curStreak=curStreak+1;
        }
        else{
            break;
        }
    }
    if (curStreak>=4){
        return true;
    }
    else{
        return false;
    }
}

function checkForwardDiagonalWin(player, chipColumn, chipRow){
    //Due to chip just being placed there must be atleast one.
    let curStreak = 1;
    //Check to downleft of chip
    for (let offset = 1; offset<=7; offset++){
        if((chipRow-offset<0)||(chipColumn-offset<0)){
            break;
        }
        if (gameBoardState[chipColumn-offset][chipRow-offset]==player){
            curStreak=curStreak+1;
        }
        else{
            break;
        }
    }
    //Check upright of chip
    for (let offset = 1; offset<=7; offset++){
        if((chipRow+offset>=6)||(chipColumn+offset>=7)){
            break;
        }
        if (gameBoardState[chipColumn+offset][chipRow+offset]==player){
            curStreak=curStreak+1;
        }
        else{
            break;
        }
    }
    if (curStreak>=4){
        return true;
    }
    else{
        return false;
    }
}

function checkBackwardDiagonalWin(player, chipColumn, chipRow){
    //Due to chip just being placed there must be atleast one.
    let curStreak = 1;
    //Check to upleft of chip
    for (let offset = 1; offset<=7; offset++){
        if((chipRow+offset<0)||(chipColumn-offset<0)){
            break;
        }
        if (gameBoardState[chipColumn-offset][chipRow+offset]==player){
            curStreak=curStreak+1;
        }
        else{
            break;
        }
    }
    //Check to downright of chip
    for (let offset = 1; offset<=7; offset++){
        if((chipRow-offset>=6)||(chipColumn+offset>=7)){
            break;
        }
        if (gameBoardState[chipColumn+offset][chipRow-offset]==player){
            curStreak=curStreak+1;
        }
        else{
            break;
        }
    }
    if (curStreak>=4){
        return true;
    }
    else{
        return false;
    }
}

//listen for requests to request to drop a chip
app.post('/drop', async (request, response)=> {
    const playerID = request.body.player;
    const column = request.body.column;
    if (dropChip(playerID, column)){
        response.send("DROP SUCCESS");
    }
    else{
        response.send("DROP FAILURE");
    }
});

//reset game state
app.get('/reset', async (request, response)=> {
    resetGameState();
    response.send("RESET SUCCESS");
});

//get game state
app.get('/', async (request, response)=> {
    currentStatus = {
        "boardState": gameBoardState,
        "playerControl": playerControl,
        "currentRound": currentMove,
        "timeElapsedInSeconds": ((lastMove-startTime)/1000),
        "winner": winner
    }
    response.send(currentStatus);
});

app.listen(port, ()=> console.log(`listening on port ${port}`));