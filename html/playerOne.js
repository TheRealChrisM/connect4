const playerOneToken = "🔵"
const playerTwoToken = "🟡"
const unclaimedToken = "⚪"

function updateGameState(){
    let gameState = fetch("https://kasm.io/api/connect4");
    gameState.then((result)=>result.json())
    .then((result)=> {
		updateBoard(result.boardState);
        updateStats(result.playerControl, result.currentRound, result.timeElapsedInSeconds, result.winner);
        updateButtons(result.playerControl);
	})
}

function updateBoard(newBoardState){
    //Update each column of the gameboard
    for (let col = 0; col<=6; col++){
        //update each cell in column to have correct color represented
        for(let row = 0; row<=5; row++){
            idString = "row-"+row+"-col-"+col;
            tableCell = document.getElementById(idString);
            cellValue = newBoardState[col][row];
            let innerHTMLValue = 0;
            if (cellValue == 1){
                innerHTMLValue = "<h1>"+playerOneToken+"</h1>";
            }
            else if (cellValue == 2){
                innerHTMLValue = "<h1>"+playerTwoToken+"</h1>";
            }
            else{
                innerHTMLValue = "<h1>"+unclaimedToken+"</h1>";
            }
            tableCell.innerHTML = innerHTMLValue;
        }
    }
}

function updateStats(currentTurn, currentRound, timeElapsed, winner){
    if (currentTurn==1){
        document.getElementById("stats-current-turn").innerHTML = playerOneToken;
    }
    else{
        document.getElementById("stats-current-turn").innerHTML = playerTwoToken;
    }
    document.getElementById("stats-current-round").innerHTML = currentRound;
    document.getElementById("stats-time-elapsed").innerHTML = timeElapsed+" seconds";
    
    if (winner==1){
        document.getElementById("stats-winner").innerHTML = playerOneToken;
    }
    else if (winner==2){
        document.getElementById("stats-winner").innerHTML = playerTwoToken;
    }
    else{
        document.getElementById("stats-winner").innerHTML = unclaimedToken;
    }
    
}

function updateButtons(playerControl){
    
}

updateGameState();
var updatingBoard = setInterval(updateGameState, 5000);