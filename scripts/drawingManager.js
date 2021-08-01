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
    updateEnemies();
    updateBullets();
} 

// parcourt l’intégralité du tableau des boucliers et exécute la fonction drawShield() pour dessiner chacun d’eux individuellement
function drawShields() 
{ 
    shields.forEach(e => drawShield(e)); 
} 
 
// Affichage des boucliers
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


// Le calque réservé à la visualisation des vaisseaux ennemis est effacé à l’aide de la méthode JavaScript .clearRect(), puis, la méthode JavaScript .forEach() appliquée sur la variable tableau enemies, parcourt l’intégralité des ennemis et dessine chacun d’eux à sa position en x et en y.
function drawEnemies() 
{ 
    enemiesContext.clearRect(0, 0, enemiesCanvas.width, enemiesCanvas.height); 
    enemies.forEach(e => drawEnemy(e)); 
} 

// Affichage des ennemies
function drawEnemy(enemy) 
{ 
    enemiesContext.drawImage(enemy.img, enemy.x, enemy.y);
    if (enemy.shoot) 
    { 
        enemyShoot(enemy); 
    } 
}


// Efface le calque dédié à l’affichage des missiles et parcourt l’intégralité du tableau des missiles, exécutant la fonction drawBullet() pour chacun d’eux.
function drawBullets() 
{ 
    bulletsContext.clearRect(0, 0, bulletsCanvas.width, bulletsCanvas.height); 
    bullets.forEach(e => drawBullet(e)); 
} 

// Affiche le projectile comme un simple rectangle, à l’aide de la méthode JavaScript .fillRect(), avec une couleur spécifique selon l’origine du tir : blanc pour les tirs provenant du canon et orange pour ceux largués par les vaisseaux ennemis. La couleur est affectée à la propriété .fillStyle
function drawBullet(bullet) 
{ 
    bulletsContext.fillStyle = bullet.type == 1 ? "rgb(200, 200, 0)" : "rgb(200, 100, 0)"; 
    bulletsContext.fillRect(bullet.x, bullet.y, 4, 12); 
}

// Ce code dessine une explosion à la position du missile supprimé.
// Une explosion se devant d’être fugace, elle est effacée un dixième de seconde plus tard à l’aide de la méthode .clearRect(), exécutée par la fonction JavaScript setTimeout().
function drawBulletExplosion(bullet) 
{ 
    enemiesContext.drawImage(imgExplosion1, bullet.x - 16, 0); 
    setTimeout(e => enemiesContext.clearRect(bullet.x - 16, 0, 32, 32), 100); 
} 


//  les missiles percutant le bouclier sont retirés de l’aire de jeu dans le même temps
// 
function destroyShieldPart(shield, collision) 
{ 
    let sLine = collision.coords.line; 
    let mLine = Math.max(collision.coords.line - 4, 0); 
    let sColumn = Math.max(collision.coords.column - 3, 0); 
    let mColumn = Math.min(collision.coords.column + 3, 39); 
    for (let line = sLine; line >= mLine; line--) 
    { 
        for (let column = sColumn; column <= mColumn; column++) 
        { 
            let wallPart = shield.walls.find (e => e.coords.line == line && e.coords.column == column); 
            if (wallPart) 
            { 
                wallPart.value = 0; 
            } 
        } 
    } 
}

function destroyEnemy(enemy) 
{ 
    enemiesContext.clearRect(enemy.x, enemy.y, 48, 48); 
    enemiesContext.drawImage(imgExplosion3, enemy.x, enemy.y); 
    setTimeout(e => enemiesContext.clearRect(enemy.x, enemy.y, 48, 48), 100); 
}

// Image socoupe volante
function drawSaucer() 
{ 
    enemiesContext.clearRect(saucer.x - 4, 2, 64, 48); 
    enemiesContext.drawImage(saucerImg, saucer.x, 2); 
}

// supprime la soucoupe volante de l’aire de jeu et qui montre une explosion lorsqu’un missile la touche.
function destroySaucer() 
{ 
    enemiesContext.clearRect(saucer.x, 2, 48, 48); 
    enemiesContext.drawImage(imgExplosion3, saucer.x, 2); 
    setTimeout(e => enemiesContext.clearRect(saucer.x, 2, 48, 48), 100); 
    saucer = ""; 
}

function destroyShieldPartFromEnemy(shield, collision) 
{ 
    let sLine = collision.coords.line; 
    let mLine = Math.min(collision.coords.line + 4, 14); 
    let sColumn = Math.max(collision.coords.column - 3, 0); 
    let mColumn = Math.min(collision.coords.column + 3, 39); 
    for (let line = sLine; line <= mLine; line++) 
    { 
        for (let column = sColumn; column <= mColumn; column++) 
        { 
            let wallPart = shield.walls.find (e => e.coords.line == line && e.coords.column == column); 
            if (wallPart) 
            { 
                wallPart.value = 0; 
            } 
        } 
    } 
}

function destroyCannon() 
{ 
    cannonContext.clearRect(cannon.x, cannon.y, 64, 64); 
    cannonContext.drawImage(imgExplosion3, cannon.x + 8, cannon.y + 8); 
    setTimeout(e => cannonContext.clearRect(cannon.x, cannon.y, 64, 64), 250); 
    cannonVisible = false; 
}

// dettruit tirs enemies
function destroyEnemyBullet(bullet) 
{ 
    enemiesContext.drawImage(imgExplosion2, bullet.x - 16, bullet.y); 
    setTimeout(e => enemiesContext.clearRect(bullet.x - 16, bullet.y, 32, 32), 100); 
} 