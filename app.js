document.addEventListener('DOMContentLoaded', () => {
const grid = document.querySelector('.grid')
let squares = Array.from(document.querySelectorAll(`.grid div`))
const scoreDisplay = document.querySelector(`#score`)
const startBtn = document.querySelector(`#start-button`)
const width = 10
let nextRandom = 0
let timerId 
let score = 0
const colors = [
    'sandybrown',
    'lightcoral',
    'cyan',
    'mediumslateblue',
    'springgreen',
    'hotpink',
    'gainsboro'
]

//Tetreminos
const jTetremino = [[1, width + 1, width*2 + 1, 2],
    [width, width + 1, width + 2, width*2 + 2], 
    [1, width + 1, width*2 + 1, width*2],
    [width, width*2, width*2 + 1, width*2 + 2]
]

const oTetremino = [[0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
]

const sTetremino = [[1, 2, width, width + 1],
    [0, width, width + 1, width*2 + 1],
    [1, 2, width, width + 1],
    [0, width, width + 1, width*2 + 1]
]

const iTetremino = [[1, width + 1, width*2 + 1, width*3 + 1],
    [width, width + 1, width + 2, width + 3], 
    [1, width + 1, width*2 + 1, width*3 + 1],
    [width, width + 1, width + 2, width + 3]
]

const tTetremino = [[1, width, width + 1 , width + 2],
    [1, width + 1, width + 2, width*2 + 1],
    [width, width + 1, width + 2, width*2 + 1],
    [1, width, width + 1, width*2 + 1]]

const lTetremino = [[0, 1, width + 1, width*2 + 1],
    [2, width, width + 1, width + 2], 
    [1, width + 1, width*2 + 1, width*2 + 2],
    [width, width + 1, width + 2, width*2]]

const zTetremino = [[0, 1, width + 1, width + 2],
    [1, width, width + 1, width*2], 
    [0, 1, width + 1, width + 2],
    [1, width, width + 1, width*2]
]

const theTetreminos = [lTetremino, zTetremino, iTetremino, jTetremino, oTetremino, tTetremino, sTetremino]

//Position
let currentPosition = 4
let currentRotation = 0

//randomly select a Tetremino and its first 
let random = Math.floor(Math.random()*theTetreminos.length)
let current = theTetreminos[random][currentRotation]

//draw tetremino
function draw(){
    current.forEach( index => {
        squares[currentPosition + index].classList.add('tetremino')
        squares[currentPosition + index].style.backgroundColor = colors[random]
    })
}
draw()

//undraw tetremino
function undraw(){
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetremino')
        squares[currentPosition + index].style.backgroundColor = ''
    })
}


//assign functions to keyCodes
function control (e){
    if(e.keyCode === 37){
        moveLeft()
        console.log('left')
    }
    if(e.keyCode === 39){
        moveRight()
        console.log('right')
    }
    else if(e.keyCode === 40){
        moveDown()
        console.log('down')
    }
    else if(e.keyCode === 38){
        rotate()
        console.log('rotate')
    }
}
document.addEventListener('keyup',control)

//move down
function moveDown() {
    undraw()
    currentPosition += width
    draw()
    freeze()
}

//Freeze function
function freeze(){
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))
        //start a new tetremino falling
        random = nextRandom
        nextRandom = Math.floor(Math.random()*theTetreminos.length)
        current = theTetreminos[random][currentRotation]
        currentPosition = 4
        draw()
        displayShape()
        addScore()
        gameOver()
    }
}

//move to the right or left
function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0) 

    if(!isAtLeftEdge) currentPosition -= 1

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        currentPosition += 1 
    }
    draw()
}

function moveRight(){
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width-1) 

    if(!isAtRightEdge) currentPosition += 1

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        currentPosition -= 1 
    }
    draw()
}

function rotate(){
    undraw()
    currentRotation ++
    if(currentRotation === current.length){
        currentRotation = 0
    }
    current = theTetreminos[random][currentRotation]
    draw()
}

//show the next upcomming tetremino in the mini display
const displaySquares = document.querySelectorAll('.mini-grid div')
const displayWidth = 4
let displayIndex = 1

//the Tetreminos without rotations
const upNextTetreminos = [
    [0, 1, displayWidth + 1, displayWidth*2 + 1], // l tetremino
    [0, 1, displayWidth + 1, displayWidth + 2], //z tetremino
    [1, displayWidth + 1, displayWidth*2 + 1, displayWidth*3 + 1], //i tetremino
    [1, displayWidth + 1, displayWidth*2 + 1, 2], //j tetremino
    [0, 1, displayWidth, displayWidth + 1], //o tetremino 
    [1, displayWidth, displayWidth + 1 , displayWidth + 2], //t tetremino
    [1, 2, displayWidth, displayWidth + 1] //s tetremino
]
function displayShape() {
    console.log(nextRandom)
    //remove any trace of a tetremino from the entire grid
    displaySquares.forEach(square => {
        square.classList.remove('tetremino')
        square.style.backgroundColor = ''
    })
    upNextTetreminos[nextRandom].forEach(index => {
        displaySquares[displayIndex + index].classList.add('tetremino')
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
}

//Start/Pause
startBtn.addEventListener('click', () => {
    if(timerId) {
        clearInterval(timerId)
        timerId = null
    }
    else{
        draw()
        timerId = setInterval(moveDown, 1000)
        nextRandom = Math.floor(Math.random()*theTetreminos.length)
        displayShape()
    }
})

//adds score and removes filled rows
function addScore(){
    for(let i = 0; i < 199; i += width){
        const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]
        if(row.every(index => squares[index].classList.contains('taken'))){
            score += 10
            scoreDisplay.innerHTML = score
            row.forEach(index => {
                squares[index].classList.remove('taken')
                squares[index].classList.remove('tetremino')
                squares[index].style.backgroundColor = ''
            })
            const squaresRemoved = squares.splice(i,width)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
        }
    }
}

//game over
function gameOver(){
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        scoreDisplay.innerHTML = ' Game Over'
        clearInterval(timerId)
    }
}

})