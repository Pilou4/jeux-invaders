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
let cannonReady = true; 
let bullets = [];
let saucer = "";

 
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
        let canShoot = -1; 
        if (Math.random() > .85) 
        { 
            canShoot = parseInt(Math.random() * enemies.length); 
        } 
        enemies.forEach((e, i) =>
            { 
                e.x +=  enemyMovement.turn ? 0 : 25 * enemyMovement.way; 
                e.phase  = e.phase == 1 ? 2 : 1; 
                e.img =  document.querySelector("#imgEnemy-" + e.line + "-" + e.phase); 
                e.shoot = canShoot == i;
                e.shoot  = false; 
            } 
        );
        if (Math.random() > .999 && saucer == "") 
        { 
            let type = Mat.random(); 
            saucer = { 
                x: type < .5 ? 0 : $('.gameBoard').width(), 
                speed: type < .5 ? 4 : -4, 
                score: 50 + (parseInt(Math.random() * 3) * 100) + (Math.random() > .5 ? 0 : 50) 
        }; 
    } 
    if (saucer != "") 
    { 
        let maxLeft = $('.gameBoard').width(); 
        saucer.x = parseInt(saucer.x + saucer.speed); 
        if ((saucer.speed < 0 && saucer.x < -64) || (saucer.speed > 0 && saucer.x > maxLeft)) 
        { 
            saucer = ""; 
        } 
        drawSaucer(); 
        } 
    } 
    enemiesContext.clearRect(0, 0, enemiesCanvas.width, enemiesCanvas.height); 
    drawEnemies();
    if (enemies.length == 0) 
    { 
        gameLevel++; 
        createEnemies(); 
        drawEnemies(); 
        createShields(); 
        drawShields(); 
    }  
}

function enemiesGoDown() 
{ 
    enemies.forEach(e => e.y += 15); 
}

// Tirer les missiles
// Cette fonction commence par analyser la variable cannonReady pour savoir si un tir est possible. Le cas échéant, elle crée un missile de type 1, valeur que nous retenons par convention pour indiquer un missile provenant du canon du joueur et devant se déplacer vers le haut de l’écran à la rencontre des ennemis. Le missile est créé aux coordonnées de la position courante du canon, et est ensuite ajouté au tableau des missiles en jeu, bullets, à l’aide de la méthode JavaScript .push().
function cannonShoot() 
{ 
    if (cannonReady) 
    { 
        cannonReady = false;
        bullets.push(
            { 
                type: 1, 
                x: cannon.x + 30 + (Math.random() < .5 ? - (parseInt(Math.random() * 3)) : (parseInt(Math.random() * 3))), 
                y: cannon.y - 12 
            } 
        );
    } 
}

// Ce code parcourt l’ensemble des projectiles en jeu et modifie leur position verticale en fonction de leur direction.
function updateBullets() 
{ 
    bullets.forEach((e, i) =>
        {
            e.y += e.type == 1 ? -10 : 10;
            if (e.type == 1) 
            { 
                if (!checkCannonBullet(e, i)) 
                { 
                    return; 
                } 
            } 
        }
    );
    drawBullets(); 
}

// Ce code a pour charge de vérifier la position d’un missile passé en paramètre et de le supprimer s’il atteint le haut de l’aire de jeu.
// Il faut l’exécuter à chaque déplacement de missile.
//function checkCannonBullet(bullet, bulletIndex) 
//{ 
//    if (bullet.y < 0) 
//    { 
//           cannonReady = true; 
//           bullets.splice(bulletIndex, 1);  
//           drawBulletExplosion(bullet); 
//    } 
//    return true; 
//}


// Cette modification intègre, dans la première partie de son code, une détection d’impact sur un éventuel bouclier qui se trouverait sur le chemin du missile analysé.
// Dans un premier temps, il s’agit de détecter si le missile est positionné sous un bouclier. Pour cela, il suffit de comparer sa position latérale par rapport à celle des boucliers.
// Le cas échéant, le système vérifie s’il existe, dans l’éventuel bouclier détecté, un ou plusieurs éléments sur le chemin du projectile dont la propriété .value serait encore à 1.
// Lorsque de tels éléments existent dans le bouclier, cela signifie que ce dernier est encore résistant sur le chemin du missile et donc que celui-ci ne peut pas continuer sa route après contact.
// Les éléments intacts du bouclier sont alors triés de manière à récupérer celui d’entre eux verticalement le plus proche du projectile.
function checkCannonBullet(bullet, bulletIndex) 
{ 
    let shield = shields.filter(f => bullet.x > f.x && bullet.x < f.x + 160)[0]; 
    if (shield) 
    { 
        let column = parseInt((bullet.x - shield.x) / 4); 
        let collision = shield.walls.filter(f => f.coords.column == column && f.value == 1 && bullet.y < (f.coords.line * 4) + shieldTop).sort((a, b) => a.coords.line > b.coords.line ? -1 : 1)[0]; 
        if (collision) 
        { 
            destroyShieldPart(shield, collision); 
            drawShield(shield); 
            cannonReady = true; 
            bullets.splice(bulletIndex, 1); 
            return false; 
        } 
    } 
    let target = enemies.filter(f => bullet.x >= f.x && bullet.x < f.x + 48 && bullet.y >= f.y && bullet.y <= f.y + 12).sort((a, b) => a.y > b.y ? -1 : 1)[0]; 
    if (target) 
    { 
        if (bullet.y < target.y + 48) 
        { 
            cannonReady = true; 
            bullets.splice(bulletIndex, 1); 
            enemies.splice(enemies.indexOf(target), 1); 
            destroyEnemy(target); 
        } 
    }
    else if (saucer != "" && bullet.y <= 50 && bullet.x >= saucer.x && bullet.x <= saucer.x + 48) 
    { 
        cannonReady = true; 
        bullets.splice(bulletIndex, 1); 
        destroySaucer(); 
        return false; 
    }  
    else if (bullet.y < 0) 
    { 
        cannonReady = true; 
        bullets.splice(bulletIndex, 1); 
        drawBulletExplosion(bullet); 
    } 
    return true; 
} 

function enemyShoot(enemy) 
{ 
    bullets.push( 
        { 
            type: 2, 
            x: enemy.x + (parseInt(Math.random() * 48)), 
            y: enemy.y - 12 
        } 
    ); 
} 