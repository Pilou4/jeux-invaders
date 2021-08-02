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
let numberOfLives;
let playerScore; 
let highScore; 
 
// initialise les variables nécessaires au bon déroulement d’une partie
function initGame() 
{
    cannonVisible = true; 
    shieldTop = parseInt($('.gameBoard').height() - 170);
    cannon = {
        x: 120, 
        y: $('.gameBoard').height() - 68, 
        img: document.getElementById("imgCannon") 
    };
    createShields();
    createEnemies();
    numberOfLives = 3;
    drawLives();
    playerScore = 0; 
    $('#playerScore').text(('0000000000' + playerScore).substr(-10)); 
    highScore = +localStorage.getItem('Combat-HighScore') || 0; 
    showHighScore(); 
} 
 
function startGame() 
{ 
    initCanvases(); 
    initGame();
    drawCannon();
    drawShields();
    drawEnemies();
    gamePlay = setInterval(renderGame, 10); 
}

function mainMenu() 
{ 
    $('.mainMenu').removeClass('cache').fadeIn(1000); 
    highScore = +localStorage.getItem('Combat-HighScore') || 0; 
    showHighScore();
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
		if (Math.random() > .95)
		{
			canShoot = parseInt(Math.random() * enemies.length);
		}
		enemies.forEach((e, i) =>
            {
				e.x += enemyMovement.turn ? 0 : 25 * enemyMovement.way;
				e.phase = e.phase == 1 ? 2 : 1;
				e.img = document.querySelector("#imgEnemy-" + e.line + "-" + e.phase);
				e.shoot = canShoot == i;
				let reachLowerZone = parseInt((e.y + 48 - shieldTop) / 12);
				if (reachLowerZone >= 0)
				{
					destroyShieldLine(reachLowerZone);
				}
			}
		);
		enemiesContext.clearRect(0, 0, enemiesCanvas.width, enemiesCanvas.height);
		drawEnemies();
	}
	if (enemies.length == 0)
	{
		gameLevel++;
		createEnemies();
		drawEnemies();
		createShields();
		drawShields();
	}
	if (Math.random() > .999 && saucer == "")
	{
		let type = Math.random();
		saucer = 
        {
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

function enemiesGoDown()
{
	enemies.forEach(e =>
        {
			e.y += 15;
			if (e.y + 24 >= cannon.y + 2)
			{
				gameOver();
			}
		}
	);
}

// Tirer les missiles
// Cette fonction commence par analyser la variable cannonReady pour savoir si un tir est possible. Le cas échéant, elle crée un missile de type 1, valeur que nous retenons par convention pour indiquer un missile provenant du canon du joueur et devant se déplacer vers le haut de l’écran à la rencontre des ennemis. Le missile est créé aux coordonnées de la position courante du canon, et est ensuite ajouté au tableau des missiles en jeu, bullets, à l’aide de la méthode JavaScript .push().
function cannonShoot() 
{ 
    if (cannonReady && cannonVisible) 
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
            if (e.type == 2) 
            { 
                if (!checkEnemyBulletHit(e, i)) 
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
    let enemyBullet = bullets.filter(e => e.type == 2 && e.x >= bullet.x - 2 && e.x <= bullet.x + 6 && bullet.y <= e.y + 12)[0]; 
    if (enemyBullet) 
    { 
        bullets.splice(bulletIndex, 1); 
        cannonnReady = true; 
        bullets.splice(bullets.indexOf(enemyBullet), 1); 
        destroyEnemyBullet(enemyBullet); 
        return false; 
    } 
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
            addToScore(target.score);
            cannonReady = true; 
            bullets.splice(bulletIndex, 1); 
            enemies.splice(enemies.indexOf(target), 1); 
            destroyEnemy(target); 
        } 
    }
    else if (saucer != "" && bullet.y <= 50 && bullet.x >= saucer.x && bullet.x <= saucer.x + 48) 
    { 
        addToScore(saucer.score); 
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

function checkEnemyBulletHit(bullet, bulletIndex)
{
	let shield = shields.filter(f => bullet.x > f.x && bullet.x < f.x + 160)[0];
	if (shield)
	{
		let column = parseInt((bullet.x - shield.x) / 4);
		let collision = shield.walls.filter(f => f.coords.column == column && f.value == 1 && bullet.y > (f.coords.line * 4) + shieldTop).sort((a, b) => a.coords.line < b.coords.line ? -1 : 1)[0];
		if (collision)
		{
			destroyShieldPartFromEnemy(shield, collision);
			drawShields();
			bullets.splice(bulletIndex, 1);
			return false;
		}
	}
	if (bullet.y + 12 > cannon.y && bullet.x >= cannon.x && bullet.x <= cannon.x + 64 && cannonVisible)
	{
		bullets.splice(bullets.indexOf(bullet), 1);
		destroyCannon();
		drawLives(--numberOfLives);
		if (numberOfLives == 0)
		{
			gameOver();
			return false;
		}
		else
		{
			respawnCannon();
		}
	}
	if (bullet.y > cannon.y + 80)
	{
		bullets.splice(bullets.indexOf(bullet), 1);
	}
	return true;
}

// un canon est repositionné au point de départ et rendu visible, après un délai d’une seconde et demie après l’explosion du précédent canon
function respawnCannon() 
{ 
    setTimeout( e => 
        {
            cannon.x = 120; 
            cannonVisible = true; 
            drawCannon(); 
        }, 
        1500 
    ); 
} 

// Le jeu est suspendu par l’exécution de la méthode JavaScript clearInterval(), et la remise à zéro de la variable gamePlay et un message signalant la fin de partie est affiché dans l’aire de jeu
function gameOver() 
{ 
    clearInterval(gamePlay); 
    gamePlay = 0; 
    $('body').append('<label class="gameOver">GAME OVER</label>');
    setTimeout  ( 
        () =>  { 
                 cleanScreen(); 
                 mainMenu(); 
               }, 
               3000 
      );  
}

function addToScore(points) 
{ 
    playerScore += points; 
    $('#playerScore').text(('0000000000' + playerScore).substr(-10)); 
    if (playerScore > highScore) 
    { 
        highScore = playerScore; 
        localStorage.setItem('Combat-HighScore', highScore); 
        showHighScore(); 
    } 
} 
 
function showHighScore() 
{ 
    $('#highScore').text(('0000000000' + highScore).substr(-10));  
} 