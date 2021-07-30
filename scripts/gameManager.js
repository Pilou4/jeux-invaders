let cannon; 
let cannonVisible = true; 
let gamePlay;
let shields = []; 
let shieldTop;
let enemies = []; 
let gameLevel = 0; 
let xOffset = 30; 
let yOffset = 50;
let enemyMovement = { 
    rythm: 0, 
    moveStep: 1, 
    turn: false, 
    way: 1 
}; 
 
// initialise les variables nécessaires au bon déroulement d’une partie
function initGame() 
{
    shieldTop = parseInt($('.gameBoard').height() - 170); 
    cannonVisible = true; 
    cannon = {
        x: 120, 
        y: $('.gameBoard').height() - 68, 
        img: document.getElementById("imgCannon") 
    };
    createShields();
} 
 
function startGame() 
{ 
    initCanvases(); 
    initGame();
    drawCannon();
    drawShields();
    createEnemies();
    drawEnemies();
    gamePlay = setInterval(renderGame, 10); 
}


// changement variable t en pixel 
// Crée les quatre boucliers en les répartissant équitablement sur la largeur disponible de l’aire de jeu
function createShields() 
{ 
    let repartition = parseInt($('.gameBoard').width() / 13); 
    position = repartition;
    shields = []; 
    for (let t = 0; t < 4; t++) 
    { 
        let shieldWall = String(1).repeat(600).split('').map((e, i) => 
            {
                return {
                    value: 1,  
                    index: i,  
                    coords: { 
                    line: parseInt(i / 40), 
                    column: i % 40 
                } 
                                                    }; 
            } 
        );
        shieldWall[0].value = 0; 
        shieldWall[1].value = 0; 
        shieldWall[2].value = 0; 
        shieldWall[3].value = 0; 
        shieldWall[40].value = 0; 
        shieldWall[41].value = 0; 
        shieldWall[42].value = 0; 
        shieldWall[80].value = 0; 
        shieldWall[81].value = 0; 
        shieldWall[120].value = 0; 
        shieldWall[36].value = 0; 
        shieldWall[37].value = 0; 
        shieldWall[38].value = 0; 
        shieldWall[39].value = 0; 
        shieldWall[77].value = 0; 
        shieldWall[78].value = 0; 
        shieldWall[79].value = 0; 
        shieldWall[118].value = 0; 
        shieldWall[119].value = 0; 
        shieldWall[159].value = 0; 
        for (let t = 491; t < 509; t++) 
        { 
            shieldWall[t].value = 0; 
        } 
        for (let t = 531; t < 549; t++) 
        { 
            shieldWall[t].value = 0; 
        } 
        for (let t = 571; t < 589; t++) 
        { 
            shieldWall[t].value = 0; 
        }
        shields.push(
            { 
                x: position, 
                walls: shieldWall 
            } 
        ); 
        position += repartition * 3; 
    }
}

// Créations des ennemies
function createEnemies() 
{ 
    enemies = []; 
    for (let line = 0; line < 5; line++) 
    { 
        for (let column = 0; column < 11; column++) 
        { 
           enemies.push(
               { 
                    x: xOffset + (column * 60), 
                    y: yOffset + (line * 55) + (10 * gameLevel), 
                    phase: 1, 
                    score: line == 0 ? 30 : line < 3 ? 20 : 10, 
                    line: (line == 0 ? 3 : line < 3 ? 2 : 1), 
                    realLine: line, 
                    realColumn: column, 
                    img: document.querySelector("#imgEnemy-" + (line == 0 ? 3 : line < 3 ? 2 : 1) + "-1") 
                } 
            ); 
        } 
    } 
}

// Animations ennemies 
// À chaque fois que ce code est exécuté, la propriété .rythm de la variable enemyMovement est incrémentée et, lorsque sa valeur atteint un multiple de la vitesse souhaitée, elle met à jour la position de tous les vaisseaux encore en jeu
function updateEnemies() 
{ 
    let speed = Math.max(4, enemies.length * 2); 
    if (++enemyMovement.rythm % speed == 0) 
    { 
        enemyMovement.moveStep = enemyMovement.moveStep > 4 ? 1 : enemyMovement.moveStep; 
        let xLeftLimit = Math.max(...enemies.map(e => e.x)) + 60; 
        let xRightLimit = Math.min(...enemies.map(e => e.x)); 
        let maxLeft = $('.gameBoard').width(); 
        if (enemyMovement.turn) 
        { 
                enemyMovement.turn = false; 
        } 
        else if (xLeftLimit > maxLeft) 
        { 
            enemyMovement.way = -1; 
            enemiesGoDown(); 
            enemyMovement.turn = true; 
        } 
        else if (xRightLimit < 25) 
        { 
            enemyMovement.way = 1; 
            enemiesGoDown(); 
            enemyMovement.turn = true; 
        } 
        enemies.forEach((e, i) =>
            { 
                e.x +=  enemyMovement.turn ? 0 : 25 * enemyMovement.way; 
                e.phase  = e.phase == 1 ? 2 : 1; 
                e.img =  document.querySelector("#imgEnemy-" + e.line + "-" + e.phase); 
                e.shoot  = false; 
            } 
        ); 
    } 
    enemiesContext.clearRect(0, 0, enemiesCanvas.width, enemiesCanvas.height); 
    drawEnemies(); 
}

function enemiesGoDown() 
{ 
    enemies.forEach(e => e.y += 15); 
} 