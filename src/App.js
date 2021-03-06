import "./App.css";
import React, { Component } from "react";
import { NeuralNetwork } from "./neural/nn";

const TOTAL_BIRDS = 1;
const HEIGHT = 500;
const WIDTH = 800;
const PIPE_WIDTH = 60;
const MIN_PIPE_HEIGHT = 40;
const FPS = 120;

class Bird {
  constructor(ctx, height, space) {
    this.ctx = ctx;
    this.x = 100;
    this.y = 150;

    this.gravity = 0;
    this.velocity = 0.01;


    // Inputs
    // bird.x bird.y
    // closestPipe x , 0
    // closestPipe. x ,  pipe.height

    this.brain = new NeuralNetwork(2, 5, 1);
  }


  draw() {
    this.ctx.fillStyle = "#ccc";
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  update = () => {
    // this.velocity += this.gravity
    // if(this.velocity > 1){
    //   this.velocity = 1;
    // }
    this.gravity += this.velocity;
    this.gravity = Math.min(4, this.gravity);
    this.y += this.gravity;

    if (this.y < 0) {
      this.y = 0;
    } else if (this.y > HEIGHT) {
      this.y = HEIGHT;
    }


    this.think();
  };

  think = () => {
    const inputs = [this.x / WIDTH, this.y / HEIGHT,];
    // range 0,1
    const output = this.brain.predict(inputs);
    console.log(output);

    if (output[0] < 0.5) {
      this.jump();
    }
  };

  jump = () => {
    console.log("ok");
    this.gravity = -1;
  };
}
class Pipe {
  constructor(ctx, height, space) {
    this.ctx = ctx;
    this.x = WIDTH;
    this.y = height ? HEIGHT - height : 0;
    this.width = PIPE_WIDTH;
    this.height =
      height ||
      MIN_PIPE_HEIGHT + Math.random() * (HEIGHT - space - MIN_PIPE_HEIGHT * 2);

    this.isDeath = false;
  }

  draw() {
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update = () => {
    this.x -= 1;
    if (this.x + PIPE_WIDTH < 0) {
      this.isDeath = true;
    }
  };
}
class App extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.frameCount = 0;
    this.space = 120;
    this.pipes = [];
    this.birds = [];
  }

  componentDidMount() {
    // document.addEventListener("keydown", this.onKeyDown);
    // const ctx = this.getCtx();
    this.pipes = this.generatePipes();
    this.birds = this.generateBirds();

    this.loop = setInterval(this.gameLoop, 1000 / FPS);
  }

  // user only mode
  // onKeyDown = (e) => {
  //   if (e.code === "Space") {
  //     this.birds[0].jump();
  //   }
  // };

  getCtx = () => this.canvasRef.current.getContext("2d");

  generateBirds = () =>{
    const birds = [];
    const ctx = this.getCtx();
    for (let i = 0; i < TOTAL_BIRDS ; i++) {
      birds.push( new Bird(ctx))
    
    }
return birds
  }
  generatePipes = () => {
    const ctx = this.getCtx();
    const firstPipe = new Pipe(ctx, null, this.space);
    const secondPipeHeight = HEIGHT - (firstPipe.height + this.space);
    const secondPipe = new Pipe(ctx, secondPipeHeight, this.space);
    return [firstPipe, secondPipe];
  };

  gameLoop = () => {
    this.update();
    this.draw();
  };

  update = () => {
    this.frameCount = this.frameCount + 1;
    if (this.frameCount % 320 === 0) {
      const pipes = this.generatePipes();
      this.pipes.push(...pipes);
    }

    // Update pipe positions
    this.pipes.forEach((pipe) => pipe.update());
    this.pipes = this.pipes.filter((pipe) => !pipe.isDeath);

    // Update bird positions
    this.birds.forEach((bird) => bird.update());

    if (this.isGameOver()) {
      // alert("Game is over !");
      // clearInterval(this.loop);
    }
  };

  isGameOver = () => {
    // detect collisions
    let isGameOver = false;
    this.birds.forEach((bird) => {
      this.pipes.forEach((pipe) => {
        if (
          bird.y < 0 ||
          bird.y > HEIGHT ||
          (bird.x > pipe.x &&
            bird.y > pipe.y &&
            bird.x < pipe.x + pipe.width &&
            bird.y < pipe.y + pipe.height)
        ) {
          isGameOver = true;
        }
      });
    });
    return isGameOver;
  };

  draw = () => {
    const ctx = this.canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    this.pipes.forEach((pipe) => pipe.draw());
    this.birds.forEach((bird) => bird.draw());
  };

  render() {
    return (
      <div className="App">
        <canvas
          ref={this.canvasRef}
          width={WIDTH}
          height={HEIGHT}
          style={{ marginTop: "24px", border: "1px solid #c3c3c3" }}
        ></canvas>

        <div
          onClick={() => {
            this.setState({});
          }}
        >
          {this.frameCount}
        </div>
      </div>
    );
  }
}

export default App;
