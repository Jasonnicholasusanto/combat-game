function rectangularCollision({rectangle1, rectangle2}) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x 
        && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
        && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function determineWinner({player, enemy, timerId}) {
    clearTimeout(timerId) // Stops the time

    document.querySelector('#displayText').style.display = 'flex'

    document.querySelector("#resetButton").style.display = 'block'

    if (player.health == enemy.health){
        document.querySelector("#displayText").innerHTML = "TIE"
    } else if (player.health > enemy.health){
        document.querySelector("#displayText").innerHTML = "PLAYER 1 WINS"
    } else if (player.health < enemy.health) {
        document.querySelector("#displayText").innerHTML = "PLAYER 2 WINS"
    }
    // window.location.reload(true);
}

let timer = 100
let timerId
function decreaseTimer() {

    if(timer>0){
        // This line creates the loop
        timerId = setTimeout(decreaseTimer, 1000)

        timer -= 1
        // This line of code changes the value/items in the HTML div into the provided value.
        document.querySelector('#timer').innerHTML = timer
    }

    if(timer==0){
        determineWinner({player, enemy, timerId})
    }
     
}