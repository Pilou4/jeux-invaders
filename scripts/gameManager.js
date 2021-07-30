let cannon; 
let cannonVisible = true; 
let gamePlay; 
 
function initGame() 
{ 
    cannonVisible = true; 
    cannon = {
        x: 120, 
        y: $('.gameBoard').height() - 68, 
        img: document.getElementById("imgCannon") 
    }; 
} 
 
function startGame() 
{ 
    initCanvases(); 
    initGame(); 
    drawCannon(); 
    gamePlay = setInterval(renderGame, 10); 
} 