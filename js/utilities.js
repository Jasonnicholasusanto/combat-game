function rectangularCollision({rectangle1, rectangle2}) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x 
        && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
        && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function determineWinner({player, enemy, timerId}) {
    // clearTimeout(timerId) // Stops the time

    stopCount();

    document.querySelector('#displayText').style.display = 'flex'

    document.querySelector("#resetButton").style.display = 'block'

    if (player.health == enemy.health){
        document.querySelector("#displayText").innerHTML = "TIE"
    } else if (player.health > enemy.health){
        document.querySelector("#displayText").innerHTML = "PLAYER 1 WINS"
    } else if (player.health < enemy.health) {
        document.querySelector("#displayText").innerHTML = "PLAYER 2 WINS"
    }
}

let timer = 100
let timerId
let timer_on = false;

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

let startTime = 5
let startTimerId
function startTimer() {
    player.dead = true
    enemy.dead = true

    if(startTime>0){
        // This line creates the loop
        startTimerId = setTimeout(startTimer, 1000)

        startTime -= 1
        // This line of code changes the value/items in the HTML div into the provided value.
        document.querySelector('#startTimer').innerHTML = startTime-1

        if(startTime==1){
            document.querySelector('#startTimer').innerHTML = "SUDDEN COMBAT!"
            player.dead = false
            enemy.dead = false
        }
    }

    if(startTime==0){
        player.dead = false
        enemy.dead = false
        document.querySelector('#startTimer').style.display = 'none'
        startCount();
    }
     
}

function pauseGame(){
    stopCount();

    document.querySelector("#pause").style.display = 'none'
    document.querySelector("#resume").style.display = 'block'

    player.dead = true
    enemy.dead = true

}

function resumeGame(){
    startCount();

    player.dead = false
    enemy.dead = false

    document.querySelector("#resume").style.display = 'none'
    document.querySelector("#pause").style.display = 'block'
}

function startCount() {
    if (!timer_on) {
      timer_on = true;
      decreaseTimer();
    }
  }
  
function stopCount() {
    clearTimeout(timerId);
    timer_on = false;
}
