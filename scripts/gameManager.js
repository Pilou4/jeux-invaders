let cannon; 
let cannonVisible = true; 
let gamePlay;
let shields = []; 
let shieldTop;
 
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
