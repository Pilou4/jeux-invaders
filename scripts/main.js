$(document).ready (init); 
 
function init() 
{ 
    $('body').on('keydown', manageKeyboardInput); 
    startGame(); 
}

// Permet de deplacer le vaiseau 
// Fleche de gauche et Q pour aller sur la gauche
// Fleche de droite et D pour aller à droite
function manageKeyboardInput(e) 
{ 
    let maxLeft = $('.gameBoard').width() - 64; 
    if (gamePlay > 0) 
    { 
        switch (e.keyCode) 
        { 
            case 39: 
            case 68: 
                cannon.x = Math.min(cannon.x + 20, maxLeft); 
                drawCannon(); 
                break; 
            case 37: 
            case 81: 
                cannon.x = Math.max(cannon.x - 20, 0); 
                drawCannon(); 
                break; 
            default: 
                break; 
        } 
    } 
} 