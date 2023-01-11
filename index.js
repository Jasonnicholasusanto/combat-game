const canvas = document.querySelector('canvas');

//This is what is responsible for drawing out the shapes and sprites onto our game. 2d for a 2D game.
const c = canvas.getContext('2d'); 

canvas.width = 1024;
canvas.height = 576;

// canvas.width = 1400;
// canvas.height = 800;

// Starts drawing a rectangle from the top left of the browser window
c.fillRect(0, 0, canvas.width, canvas.height);

// Adding gravity
const gravity = 0.7;


/* Sprites instantiations */

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/fighting-game-bg-img.png'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: './img/shop-animation.png',
    scale: 2.75,
    framesMax: 6
})

/* This is to instantiate a new character/sprite in the game */
const player = new Fighter( {
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'red',
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: "./img/Martial-Hero/Sprites/Idle.png",
    framesMax: 8, // framesMax is set to 8 as there are 8 frames in the idle sprite image.
    scale: 2.5,
    offset: {
        x: 215,
        y: 157,
    },
    sprites: {
        idle: {
            imageSrc: "./img/Martial-Hero/Sprites/Idle.png",
            framesMax: 8
        },
        run: {
            imageSrc: "./img/Martial-Hero/Sprites/Run.png",
            framesMax: 8,
        },
        jump: {
            imageSrc: "./img/Martial-Hero/Sprites/Jump.png",
            framesMax: 2,
        },
        fall: {
            imageSrc: "./img/Martial-Hero/Sprites/Fall.png",
            framesMax: 2,
        },
        attack1: {
            imageSrc: "./img/Martial-Hero/Sprites/Attack1.png",
            framesMax: 6,
        },
        takeHit: {
            imageSrc: "./img/Martial-Hero/Sprites/Take-hit.png",
            framesMax: 4,
        },
        death: {
            imageSrc: "./img/Martial-Hero/Sprites/Death.png",
            framesMax: 6,
        },
    },
    attackBox: {
        offset: {
            x: 90,
            y: 50
        }, 
        width: 165,
        height: 50
    }

} ) 
// By creating a {} in Sprite(), means that position is an object and we have created a new position object for that new sprite.

/* Creating the opposing player */
const enemy = new Fighter( {
    position: {
        x: 950,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: -50,
        y: 0
    },
    color: 'blue',
    imageSrc: "./img/Martial-Hero-2/Sprites/Idle.png",
    framesMax: 4, // framesMax is set to 8 as there are 8 frames in the idle sprite image.
    scale: 2.5,
    offset: {
        x: 215,
        y: 167,
    },
    sprites: {
        idle: {
            imageSrc: "./img/Martial-Hero-2-flipped/Sprites/Idle.png",
            framesMax: 4
        },
        run: {
            imageSrc: "./img/Martial-Hero-2-flipped/Sprites/Run.png",
            framesMax: 8,
        },
        jump: {
            imageSrc: "./img/Martial-Hero-2-flipped/Sprites/Jump.png",
            framesMax: 2,
        },
        fall: {
            imageSrc: "./img/Martial-Hero-2-flipped/Sprites/Fall.png",
            framesMax: 2,
        },
        attack1: {
            imageSrc: "./img/Martial-Hero-2-flipped/Sprites/Attack1.png",
            framesMax: 4,
        },
        takeHit: {
            imageSrc: "./img/Martial-Hero-2-flipped/Sprites/Take-hit.png",
            framesMax: 3,
        },
        death: {
            imageSrc: "./img/Martial-Hero-2-flipped/Sprites/Death.png",
            framesMax: 7,
        },
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        }, 
        width: 170,
        height: 50
    }
} )


/* Keys for the in-game characters' actions */
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },

    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}

/* Timer for the game */
decreaseTimer();

/* Animation function - to animate the character movements*/
function animate() {
    window.requestAnimationFrame(animate) // will create a recursion
    c.fillStyle = "black"
    c.fillRect(0, 0, canvas.width, canvas.height)

    // Adding images and animations onto our canvas by specific ordering
    background.update()
    shop.update()

    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)

    player.update()
    enemy.update() 

    // to stop characters' movements whenever we lift up a key
    player.velocity.x = 0 
    enemy.velocity.x = 0

    // Player's movement (Left and Right movements)
    if(keys.a.pressed && player.lastKey == 'a'){
        player.velocity.x = -5
        player.switchSprite('run')
    } else if(keys.d.pressed && player.lastKey == 'd'){
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    if(player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if(player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    // Enemy's movement (Left and Right movements)
    if(keys.ArrowLeft.pressed && enemy.lastKey == 'ArrowLeft'){
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if(keys.ArrowRight.pressed && enemy.lastKey == 'ArrowRight'){
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    if(enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if(enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    // To detect collision when player gets hit
    if (rectangularCollision({rectangle1: player, rectangle2: enemy})
        && player.isAttacking && player.framesCurrent === 4){
            
            enemy.takeHit()
            player.isAttacking = false
            // document.querySelector('#enemyHealth').style.width = enemy.health + "%"

            gsap.to('#enemyHealth', {
                width: enemy.health + "%"
            })
    }

    // If player missed the attack
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false;
    }

    // To detect collision when enemy gets hit
    if (rectangularCollision({rectangle1: enemy, rectangle2: player})
        && enemy.isAttacking && enemy.framesCurrent === 2){
            
            player.takeHit()
            enemy.isAttacking = false
            // document.querySelector('#playerHealth').style.width =player.health + "%"

            gsap.to('#playerHealth', {
                width: player.health + "%"
            })
    }

    // If enemy missed the attack
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false;
    }

    // Ends game based on the health of players
    if (enemy.health <= 0 || player.health <= 0){
        determineWinner({player, enemy, timerId})
    }
}

animate()



/* For the movement buttons */

// Event listener for key down action
window.addEventListener('keydown', (event) => {

    if (!player.dead) {
        switch (event.key) {
            case 'd': 
                keys.d.pressed = true
                player.lastKey = 'd'
                break

            case 'a': 
                keys.a.pressed = true
                player.lastKey = 'a'
                break

            case 'w': 
                player.pressedJump = true
                break

            case 't':
                player.attack()
                break
        }
    }

    if (!enemy.dead) {
        switch (event.key) {
            case 'ArrowRight': 
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break

        case 'ArrowLeft': 
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break

        case 'ArrowUp': 
            enemy.pressedJump = true
            break
        
        case 'Enter':
            enemy.attack()
            break
        }
    }
})

// Event listener for key up action
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd': 
            keys.d.pressed = false
            break

        case 'a': 
            keys.a.pressed = false
            break

        case 'w': 
            keys.w.pressed = false
            player.pressedJump = false;
            break

        case 'ArrowRight': 
            keys.ArrowRight.pressed = false
            break

        case 'ArrowLeft': 
            keys.ArrowLeft.pressed = false
            break

        case 'ArrowUp': 
            // keys.ArrowUp.pressed = false
            enemy.pressedJump = false;
            break
    }
})