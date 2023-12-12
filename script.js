"use strict"
const score = document.querySelector('.score')
const road = document.querySelector('.road')
const popUp = document.querySelector('.pop-up')

const keys = {
    ArrowUp : false,
    ArrowDown : false,
    ArrowLeft : false,
    ArrowRight : false
}

let player = {
    speed : 5,
    score : 0
}

const carParts = (car) => {
    let carBody = document.createElement('div')
    let carTire = document.createElement('div')
    let TireBack = document.createElement('div')
    carBody.setAttribute('class', 'car-body')
    carTire.setAttribute('class', "tire tire-front")
    TireBack.setAttribute('class', "tire tire-back")
    car.appendChild(carBody)
    car.appendChild(carTire)
    car.appendChild(TireBack)
}

const randomColor = () => {
    function c(){
        let hex = Math.floor((Math.random() * 256) + 10).toString(16) //converts the number in hexadecimal
        return String(hex)
    }
    return "#" + c() + c() + c()
}

const start = () => {
    popUp.classList.add('hide')
    road.innerHTML = ""
    player.start = true
    player.score = 0

    // creating road lines
    for(let i = 0; i < 5 ; i++){
        let roadLine = document.createElement('div')
        roadLine.setAttribute('class', 'lines')
        roadLine.y = (i*150)
        roadLine.style.top = roadLine.y + "px"
        road.appendChild(roadLine)
    }

    //creating car element
    let car = document.createElement('div')
    car.setAttribute('class', 'car')
    carParts(car)
    road.appendChild(car)


    //creating enemy cars
    for(let i = 0; i < 4 ; i++){
        let enemyCar = document.createElement('div')
        enemyCar.setAttribute('class', 'enemy')
        carParts(enemyCar)
        enemyCar.style.background = randomColor()
        console.log(randomColor())
        enemyCar.y = i*300
        enemyCar.style.top = enemyCar.y + "px"
        enemyCar.style.left = Math.floor(Math.random() * 350) + 'px';
        road.appendChild(enemyCar)
    }

    player.x = car.offsetLeft
    player.y = car.offsetTop
    window.requestAnimationFrame(gamePlay)
}
const isCollided = (car, enemy) => {
    let carRect = car.getBoundingClientRect()
    let enemyRect = enemy.getBoundingClientRect()
    
    return !((carRect.top > enemyRect.bottom) || (carRect.bottom < enemyRect.top)
             || (carRect.left > enemyRect.right) || (carRect.right < enemyRect.left))
}
const endGame = () => {
    player.start = false
    popUp.classList.remove('hide')
    popUp.innerHTML = `Game over <br> Your score is ${player.score} <br> Click here to restart the game`
}

const moveEnemy = (car) => {
    let enemys = document.querySelectorAll('.enemy')
    enemys.forEach((enemy) => {
        if(isCollided(car, enemy)){
            endGame()
        }
        if(enemy.y >= 850){
            enemy.y = -300
            enemy.style.left = Math.floor(Math.random() * 350) + 'px';
        }
        enemy.y += player.speed
        enemy.style.top = enemy.y + "px"
    })
}

const moveLines = () => {
    let lines = document.querySelectorAll('.lines')
    lines.forEach((line) => {
        if(line.y >= 850){
            line.y -= 900

        }
        line.y += player.speed
        line.style.top = line.y + "px"
    })
}

const keyDown = (e) => {
    e.preventDefault()
    keys[e.key] = true    
}
const keyUp = (e) => {
    e.preventDefault()
    keys[e.key] = false
}


const gamePlay = () => {
    let car = document.querySelector('.car')
    let gameArea = road.getBoundingClientRect()
    if(player.start){

        moveLines();
        moveEnemy(car);
        window.requestAnimationFrame(gamePlay)

        if(keys.ArrowUp && player.y > (gameArea.top + 150)){ player.y -= player.speed }
        if(keys.ArrowDown && player.y < (gameArea.bottom - 85)){ player.y += player.speed } 
        if(keys.ArrowLeft && player.x > 0){ player.x -= player.speed } 
        if(keys.ArrowRight && player.x < (gameArea.width - 50)){ player.x += player.speed }

        car.style.top = player.y + "px"
        car.style.left = player.x + "px"
        player.score++
        let ps = player.score -1
        score.innerHTML = "Score : " + ps
    } 
}

popUp.addEventListener('click', start)
document.addEventListener('keydown', keyDown)
document.addEventListener('keyup', keyUp)
