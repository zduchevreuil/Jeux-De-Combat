const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height); 

const gravity = 1

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: './img/background.png',
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 128,
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter({
    position: {
        x: 0,
        y: 0 
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/samurai/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './img/samurai/Idle.png',
            framesMax: 8,
        },
        run: {
            imageSrc: './img/samurai/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './img/samurai/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './img/samurai/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './img/samurai/Attack1.png',
            framesMax: 6,
        },
        takeHit: {
            imageSrc: './img/samurai/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './img/samurai/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 160,
        height: 50
    }
    
})



const enemy = new Fighter({
    position: {
        x: 400,
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
    imageSrc: './img/kenji/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            framesMax: 4,
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './img/kenji/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './img/kenji/Attack1.png',
            framesMax: 4,
        },
        takeHit: {
            imageSrc: './img/kenji/Take Hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './img/kenji/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
    }
})


const keys = {
    q: {
        pressed: false
    },
    d: {
        pressed: false
    },
    z: {
        pressed: false
    },
    ArrowRight:{
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },

}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    // player mouvement
    if (keys.q.pressed && player.lastKey === 'q'){
        player.velocity.x = -5
        player.swicthSprite('run')
    }else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.swicthSprite('run')
    }else {
        player.swicthSprite('idle')
    }

    // jumping 
    if (player.velocity.y < 0) {
        player.swicthSprite('jump')
    }else if (player.velocity.y > 0) {
        player.swicthSprite('fall')
    }

    // enemy mouvement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -5
        enemy.swicthSprite('run')
    }else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.swicthSprite('run')
    }else {
        enemy.swicthSprite('idle')
    }

    // jumping 
    if (enemy.velocity.y < 0) {
        enemy.swicthSprite('jump')
    }else if (enemy.velocity.y > 0) {
        enemy.swicthSprite('fall')
    }

    // detected for collision & enemy hit
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        })  &&
        player.isAttacking && player.framesCurrent === 4
    ){
        enemy.takeHit()
        player.isAttacking = false
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
     
            
    }

    // if player misses 
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }

    // this is where our player gets hit

    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        })  &&
        enemy.isAttacking && enemy.framesCurrent === 2
    ){ 
        player.takeHit()
        enemy.isAttacking = false
        document.querySelector('#playerHealth').style.width = player.health + '%' 
    }

    // if enemy misses 
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
    }


    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
        btn_Recomencer.style.display = 'flex'
    }
    
}


animate()

window.addEventListener('keydown', (event) => {
    if (!player.dead) {
        switch (event.key) {
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                break
            case 'q':
                keys.q.pressed = true
                player.lastKey = 'q'
                break
            case 'z':
                player.velocity.y = -18
                break
            case ' ':
                player.attack()
                break
    }
    

            // enemy mouvement
        
    }
    if (!enemy.dead) {
        switch(event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break
            case 'ArrowUp':
                enemy.velocity.y = -20
                break
            case 'ArrowDown':
                enemy.attack()
                break
        }
    }
    
})


window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'q':
            keys.q.pressed = false
            break
    }

    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            enemy.lastKey = 'ArrowLeft'
            break
    }
    console.log(event.key);
})
