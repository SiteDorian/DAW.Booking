import React, {useEffect, useState} from "react";
import Sketch from "react-p5";
import Matter from "matter-js"
import "./index.scss"
import boolImg from "./img/bool.png"

// module aliases
const Engine = Matter.Engine,
    World = Matter.World,
    Events = Matter.Events,
    Bodies = Matter.Bodies;


function Game() {

    let x = 50;
    const y = 50;

    const [count, setCount] = useState(0)

    function handler(key) {
        console.log(key)
        if (key.code == "Space") {
            setCount(1)
        }
    }


    useEffect(() => {
        document.addEventListener('keydown', handler)
        return () => {
            document.removeEventListener('keydown', handler)
        }
    }, [])

    // const setup = (p5, canvasParentRef) => {
    //     let y;
    //     let x;
    //     // use parent to render the canvas in this ref
    //     let i;
    //     // (without that p5 will render the canvas outside of your component)
    //     p5.createCanvas(500, 500).parent(canvasParentRef);
    //     //
    // };


    // const draw = (p5) => {
    //     let i;
    //     p5.background(0);
    //     // p5.ellipse(x, y, 70, 70);
    //     // NOTE: Do not use setState in the draw function or in functions that are executed
    //     // in the draw function...
    //     // please use normal variables or class properties for these purposes
    //     // x++;
    //
    // };


    let engine,
        world,
        walls = [],
        particles = [],
        plinkos = [],
        bounds = [],
        cols = 9,
        rows = 8,
        particleSize = 10,
        plinkoSize = 14;

    function preload(p5) {
        // p5.img = p5.loadImage('./img/bool.png');
    }

    function setup(p5, canvasParentRef) {
        let x;
        let y;
        p5.createCanvas(600, 700).parent(canvasParentRef)
        engine = Engine.create();

        p5.loadImage(boolImg, img => {
            console.log("img", img)
            p5.img = img;
            // p5.redraw(); // <- only if you're running with noLoop()
        });

        world = engine.world;
        world.gravity.y = 0.8;

        newParticle(p5)


        var spacing = p5.width / cols;
        for (let j = 0; j < rows; j++) {
            for (let i = 0; i < cols + 1; i++) {
                x = i * spacing;
                if (j % 2 === 0) {
                    x += spacing / 2;
                }
                y = spacing + j * spacing * 0.9;
                const p = new Plinko(x, y, plinkoSize, p5);
                plinkos.push(p);
            }
        }

        //floor
        let b = new Boundary(p5.width / 2, p5.height + 50, p5.width, 100, p5);
        bounds.push(b);

        //left
        b = new Boundary(-12, p5.height, 10, p5.height * 2, p5);
        bounds.push(b);

        //right
        b = new Boundary(p5.width + 12, p5.height, 10, p5.height * 2, p5);
        bounds.push(b);


        for (let i = 0; i < cols + 1; i++) {
            x = i * spacing;
            const h = 100;
            const w = 10;
            y = p5.height - h / 2;
            b = new Boundary(x, y, w, h, p5);
            bounds.push(b);
        }


    }

    function newWall(p5) {
        const w = new Wall(0, 0, p5)
        walls.push(w)
    }

    function newParticle(p5) {
        const p = new Particle(Math.floor(Math.random() * 600), 0, particleSize, p5);
        particles.push(p);
    }

    function draw(p5) {
        if (p5.frameCount % 20 === 0) {
            newParticle(p5);
        }
        p5.background(8, 80, 29);
        Engine.update(engine);

        for (let i = 0; i < particles.length; i++) {
            particles[i].show();
            if (particles[i].isOffScreen()) {
                World.remove(world, particles[i].body);
                particles.splice(i, 1);
                i--;
            }
        }
        for (let i = 0; i < plinkos.length; i++) {
            plinkos[i].show();
        }

        for (let i = 0; i < bounds.length; i++) {
            bounds[i].show();
        }

        if (p5.img) {
            p5.image(p5.img, 10, p5.height - 50, 40, 40 );
            p5.image(p5.img, 80, p5.height - 50, 40, 40 );
        }
    }

// ======================================================
//           Particle.js
// ======================================================

    function Particle(x, y, r, p5) {
        this.p5 = p5;
        this.r = 243;
        this.g = 114;
        this.b = 32;
        const options = {
            isStatic: false,
            mass: 0,
            density: 1,
            restitution: 0.8,
            friction: 1
        };
        // x += Math.random(-1, 1);
        this.body = Bodies.circle(x, y, r, options);
        this.r = r;
        World.add(world, this.body);
    }

    Particle.prototype.isOffScreen = function () {
        const x = this.body.position.x;
        const y = this.body.position.y;
        return (x < -50 || x > this.p5.width + 50 || y > this.p5.height + 50);
    }

    Particle.prototype.show = function () {
        this.p5.noStroke();
        // this.p5.fill(this.r, this.g, this.b);
        this.p5.fill(243, 114, 32);
        // this.p5.background(this.p5.img)
        const pos = this.body.position;
        this.p5.push();
        this.p5.translate(pos.x, pos.y);
        this.p5.ellipse(0, 0, this.r * 2);
        this.p5.pop();
    }

// ======================================================
//           Plinko.js
// ======================================================

    function Plinko(x, y, r, p5) {
        this.p5 = p5
        const options = {
            isStatic: true,
            density: 1,
            restitution: 1,
            friction: 0
        };
        this.color = 80 + Math.random() * 95 | 0;
        this.body = Bodies.circle(x, y, r, options);
        this.r = r;
        World.add(world, this.body);
    }

    Plinko.prototype.show = function () {
        this.p5.fill(this.color);
        // stroke(255);
        this.p5.noStroke();
        const pos = this.body.position;
        this.p5.push();
        this.p5.translate(pos.x, pos.y);
        this.p5.ellipse(0, 0, this.r * 2);
        this.p5.pop();
    }


// ======================================================
//           Boundary.js
// ======================================================

    function Boundary(x, y, w, h, p5) {
        this.p5 = p5
        const options = {
            density: 1,
            friction: 1,
            isStatic: true
        };
        this.body = Bodies.rectangle(x, y, w, h, options);
        this.w = w;
        this.h = h;
        World.add(world, this.body);
    }

    Boundary.prototype.show = function () {
        this.p5.fill(128);
        // stroke(255);
        this.p5.noStroke();
        var pos = this.body.position;
        this.p5.push();
        this.p5.translate(pos.x, pos.y);
        this.p5.rectMode(this.p5.CENTER);
        this.p5.rect(0, 0, this.w, this.h);
        this.p5.pop();
    }

    // ======================================================
    //           Wall.js
    // ======================================================

    function Wall(x, y, w, h, p5) {
        this.p5 = p5
        const options = {
            density: 1,
            friction: 1,
            isStatic: true
        };
        this.body = Bodies.rectangle(x, y, w, h, options);
        this.w = w;
        this.h = h;
        World.add(world, this.body);
    }

    Wall.prototype.show = function () {
        this.p5.fill(45);
        // stroke(255);
        this.p5.noStroke();
        var pos = this.body.position;
        this.p5.push();
        this.p5.translate(pos.x, pos.y);
        this.p5.rectMode(this.p5.CENTER);
        this.p5.rect(0, 0, this.w, this.h);
        this.p5.pop();
    }

    return (
        <div id={"game"} className={"GameContainer container"}>
            <div className={"row"}>
                <div className={"col-12"}>
                    <h1>My Game prototype</h1>
                </div>

                <div className={"col-12"}>

                    {count ? (
                        <Sketch preload={preload} setup={setup} draw={draw}/>
                    ) : (
                        <div className={"PreviewContainer align-items-center d-flex justify-content-center"}>
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={() => {
                                        setCount(1)
                                    }}
                                >
                                    <h1>Start Game</h1>
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

export default Game