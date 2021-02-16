'use strict';

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const VEL = 7
const PLAYER_RADIUS = 50
const FRUIT_RADIUS = 10

let x = PLAYER_RADIUS
let y = PLAYER_RADIUS
let direction_x = 0;
let direction_y = 0;

canvas.width = document.body.clientWidth
canvas.height = document.body.clientHeight

// TODO: Criar a classe Game
class Game {

    constructor(){
    }

    renderAll(){
        this.gameObjects.forEach(o => o.render(this.contex))
    }

    render(){
        this.renderAll()
    }

    update(){
    }

    start(){
        let id = window.setInterval(spawnFruit,4000)
    }
}


function spawnFruit(){
    function randInScreen(){
        return [Math.random()*canvas.width, Math.random()*canvas.height]
    }
    let [x,y] = randInScreen()
    console.log('x',x,'y',y)
    fillCircle(x,y, FRUIT_RADIUS, 'yellow')
}

function fillCircle( x,y, radius, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.fill();
}
function fillRect( x,y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x,y, width, height );
}

function playerUpdate(dt){
    x += direction_x * VEL;
    y += direction_y * VEL;
}

function playerRender(context){

    context.clearRect(
        0, // x
        0, // y
        canvas.width, // width
        canvas.height // height
    )

    fillRect( x, y, PLAYER_RADIUS, PLAYER_RADIUS, "red")
}


const direction_table = {
    "KeyW" : [0,-1],
    "KeyA" : [-1,0],
    "KeyS" : [0, 1],
    "KeyD" : [1, 0]
}

let keysPressed = new Set();

function handleKeyDown(key){
    if(direction_table[key]){
        if(!keysPressed.has(key)){
            const [ddx, ddy] = direction_table[key]
            direction_x += ddx
            direction_y += ddy
            keysPressed.add(key)
        }
    }
}

function handleKeyUp(key){
    if(direction_table[key]){
        if(keysPressed.has(key)){
            const [ddx, ddy] = direction_table[key]
            direction_x -= ddx
            direction_y -= ddy
            keysPressed.delete(key)
        }
    }
}

(() => {

    let windowWasResized = true;
    let start;


    function step(timestamp) {
        if (!start) {
            start = timestamp;
        }
        const dt = (timestamp - start) * 0.001;
        start = timestamp;

        if (windowWasResized) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            windowWasResized = false;
        }

        update(dt);
        render(context);

        window.requestAnimationFrame(step);
    }

    window.addEventListener('resize', event => {
        windowWasResized = true;
    });
    window.requestAnimationFrame(step);

    document.addEventListener('keydown', e =>{
        handleKeyDown(e.code)
    })
    document.addEventListener('keyup', e =>{
        handleKeyUp(e.code)
    })

})()
