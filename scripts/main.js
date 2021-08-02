$(document).ready (init); 
 
function init() 
{ 
    $('body').on('keydown', manageKeyboardInput); 
    mainMenu(); 
}

// Permet de deplacer le vaiseau 
// Fleche de gauche(39) et Q(62) pour aller sur la gauche
// Fleche de droite(37) et D(81) pour aller à droite
// Touche espace(32) tire missile
function manageKeyboardInput(e) 
{ 
    let maxLeft = $('.gameBoard').width() - 64; 
    if (gamePlay > 0) 
    { 
        switch (e.keyCode) 
        {
            case 32: 
                cannonShoot(); 
                break; 
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
    else 
    { 
        if (e.keyCode == 80) 
        { 
            $('.mainMenu').fadeOut(3000, () =>
                { 
                    $('.mainMenu').addClass('cache'); 
                    startGame(); 
                } 
            ); 
        } 
    } 
} 