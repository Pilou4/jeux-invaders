let cannonCanvas; 
let bulletsCanvas; 
let enemiesCanvas; 
let shieldsCanvas; 
let cannonContext; 
let bulletsContext; 
let enemiesContext; 
let shieldsContext; 
 
function initCanvases() 
{ 
    cannonCanvas = document.getElementById("cannonCanvas"); 
    bulletsCanvas = document.getElementById("bulletsCanvas"); 
    enemiesCanvas = document.getElementById("enemiesCanvas"); 
    shieldsCanvas = document.getElementById("shieldsCanvas"); 
    cannonContext = cannonCanvas.getContext("2d"); 
    bulletsContext = bulletsCanvas.getContext("2d"); 
    enemiesContext = enemiesCanvas.getContext("2d"); 
    shieldsContext = shieldsCanvas.getContext("2d"); 
    cannonCanvas.width = $('.gameBoard').width(); 
    cannonCanvas.height = $('.gameBoard').height(); 
    bulletsCanvas.width = $('.gameBoard').width(); 
    bulletsCanvas.height = $('.gameBoard').height(); 
    enemiesCanvas.width = $('.gameBoard').width(); 
    enemiesCanvas.height = $('.gameBoard').height(); 
    shieldsCanvas.width = $('.gameBoard').width(); 
    shieldsCanvas.height = $('.gameBoard').height(); 
} 
 
function drawCannon() 
{ 
    cannonContext.clearRect(0, 0, cannonCanvas.width, cannonCanvas.height); 
    if (cannonVisible) 
    { 
        cannonContext.drawImage(imgCannon, cannon.x, cannon.y); 
    } 
} 
 
function renderGame() 
{ 
} 