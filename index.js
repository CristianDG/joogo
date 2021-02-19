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

    constructor(width, height, startingObjects){
        this.gameObjects = new Set(startingObjects);
    }

    render(context){
        context.clearRect(
                0, // x
                0, // y
                canvas.width, // width
                canvas.height // height
        )
        this.verifyAndPerform('render',context)
    }

    verifyAndPerform(f, ...args){
        Array.from(this.gameObjects)
            .filter(o => o[f] ? true : false)
            .forEach(o => o[f](...args))
    }

    update(dt){
        this.verifyAndPerform('update',dt, this.width, this.height)
    }

    handleKeyDown(key){
        this.verifyAndPerform('handleKeyDown',key)
    }

    handleKeyUp(key){
        this.verifyAndPerform('handleKeyUp',key)
    }

    start(){
        // let id = window.setInterval(spawnFruit,4000)
    }

    addObject(obj){
        this.gameObjects.add(obj)
    }

    removeObject(id){
        this.gameObjects = new Set(Array.from(this.gameObjects)
                                        .filter(o => o.id ==id))
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

    update(dt, totalWidth, totalHeight){
        // TODO wip
        /*
        this.direction_x < 0
            ? this.x = Math.min( this.x + (this.direction_x * this.VEL), 0)
            : this.x = Math.max( this.x + (this.direction_x * this.VEL), totalWidth)
        this.direction_y < 0
            ? this.y = Math.max( this.y + (this.direction_y * this.VEL), 0)
            : this.y = Math.max( this.y + (this.direction_y * this.VEL),totalHeight)
        */
        this.x = this.x + (this.direction_x * this.VEL)
        this.y = this.y + (this.direction_y * this.VEL)
    }

    render(context){
        // TODO loop around

        fillRect(
            context,
            this.x,
            this.y,
            this.width,
            this.height,
            this.color)
    }

    lookupDirection(key){
        return this.direction_table[key] ? this.direction_table[key] : [0,0]
    }

    handleKeyDown(key){
        if(!this.keysPressed.has(key)){
            const [ddx, ddy] = this.lookupDirection(key)
            this.direction_x += ddx
            this.direction_y += ddy
            this.keysPressed.add(key)
        }
    }

    handleKeyUp(key){
        if(this.keysPressed.has(key)){
            const [ddx, ddy] = this.lookupDirection(key)
            this.direction_x -= ddx
            this.direction_y -= ddy
            this.keysPressed.delete(key)
        }
    }
}

function spawnFruit(){
    function randInScreen(){
        return [Math.random() * canvas.width, Math.random() * canvas.height]
    }
    let [x,y] = randInScreen()
    fillCircle(x,y, FRUIT_RADIUS, 'yellow')
}


function main() {

    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");

    canvas.width = document.body.clientWidth
    canvas.height = document.body.clientHeight

    let game = new Game(canvas.width, canvas.height,[
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
