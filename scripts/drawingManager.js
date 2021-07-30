let cannonCanvas; 
let bulletsCanvas; 
let enemiesCanvas; 
let shieldsCanvas; 
let cannonContext; 
let bulletsContext; 
let enemiesContext; 
let shieldsContext; 
 

// Accès direct vers les différents éléments HTML de type <canvas></canvas>
// initialisation des variables + dimensionne calques
// de manière à ce qu’ils prennent toute la place disponible dans l’aire de jeu
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
 
// Visualisation du canon à l’écran
// efface le calque réservé à l’affichage du canon et dessine son image à la position indiquée par la variable JavaScript cannon
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

// parcourt l’intégralité du tableau des boucliers et exécute la fonction drawShield() pour dessiner chacun d’eux individuellement
function drawShields() 
{ 
    shields.forEach(e => drawShield(e)); 
} 
 
// efface, sur le calque réservé aux boucliers, l’emplacement du bouclier reçu en paramètre, grâce à la méthode .clearRect(). Elle parcourt ensuite l’ensemble des éléments composant le bouclier en ne dessinant, à l’aide de la méthode .fillRect(), que ceux qui ont leur propriété .value à 1.
function drawShield(shield) 
{ 
        shieldsContext.clearRect(shield.x, shieldTop, 160, 60);
        shieldsContext.fillStyle = '#32A200'; 
        shield.walls.forEach((e, i) => 
        { 
            let line = parseInt(i / 40); 
            let column = i % 40; 
            if (e.value == 1) 
            { 
                shieldsContext.fillRect(shield.x + (column * 4), shieldTop + (line * 4), 4, 4); 
            } 
        } 
    ); 
} 