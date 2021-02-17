'use strict';

const FRUIT_RADIUS = 10

function fillCircle(context, x,y, radius, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.fill();
}

function fillRect(context, x,y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x,y, width, height );
}

// TODO: Criar a classe Game
class Game {


    constructor(startingObjects){
        this.gameObjects = new Set(startingObjects);
    }

    render(context){
        context.clearRect(
                0, // x
                0, // y
                canvas.width, // width
                canvas.height // height
        )
        Array.from(this.gameObjects)
            .filter(o => o.render ? true : false)
            .forEach(o => o.render(context))
    }

    update(dt){
        Array.from(this.gameObjects)
            .filter(o => o.update ? true : false)
            .forEach(o => o.update(dt))
    }

    handleKeyDown(key){
        Array.from(this.gameObjects)
            .filter(o => o.handleKeyDown ? true : false)
            .forEach(o => o.handleKeyDown(key))
    }
    handleKeyUp(key){
        Array.from(this.gameObjects)
            .filter(o => o.handleKeyUp ? true : false)
            .forEach(o => o.handleKeyUp(key))
    }

    start(){
        // let id = window.setInterval(spawnFruit,4000)
    }

    addObject(obj){
        this.gameObjects.add(obj)
    }
}

class Player {

    keysPressed = new Set();
    direction_table = Object.freeze({
        "KeyW" : [0,-1],
        "KeyA" : [-1,0],
        "KeyS" : [0, 1],
        "KeyD" : [1, 0]
    })
    x = 0
    y = 0
    width = 50
    height = 50
    direction_x = 0
    direction_y = 0
    VEL = 7

    constructor(id, color){
        this.id = id
        this.color = color
    }

    update(dt){
        this.x += this.direction_x * this.VEL;
        this.y += this.direction_y * this.VEL;
    }

    render(context){
        fillRect(
            context,
            this.x,
            this.y,
            this.width,
            this.height,
            this.color)
    }

    handleKeyDown(key){
        if(this.direction_table[key]){
            if(!this.keysPressed.has(key)){
                const [ddx, ddy] = this.direction_table[key]
                this.direction_x += ddx
                this.direction_y += ddy
                this.keysPressed.add(key)
            }
        }
    }

    handleKeyUp(key){
        if(this.direction_table[key]){
            if(this.keysPressed.has(key)){
                const [ddx, ddy] = this.direction_table[key]
                this.direction_x -= ddx
                this.direction_y -= ddy
                this.keysPressed.delete(key)
            }
        }
    }
}

function spawnFruit(){
    function randInScreen(){
        return [Math.random()*canvas.width, Math.random()*canvas.height]
    }
    let [x,y] = randInScreen()
    fillCircle(x,y, FRUIT_RADIUS, 'yellow')
}


function main() {

    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");

    canvas.width = document.body.clientWidth
    canvas.height = document.body.clientHeight

    let game = new Game([
         new Player('player1', 'red')
    ]);

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

        game.update(dt);
        game.render(context);

        window.requestAnimationFrame(step);
    }

    window.addEventListener('resize', event => {
        windowWasResized = true;
    });
    window.requestAnimationFrame(step);

    document.addEventListener('keydown', e =>{
        game.handleKeyDown(e.code)
    })
    document.addEventListener('keyup', e =>{
        game.handleKeyUp(e.code)
    })



}
main();
