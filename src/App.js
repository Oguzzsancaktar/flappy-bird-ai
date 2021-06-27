import "./App.css";
import React, { Component } from "react";

const HEIGHT = 500;
const WIDTH = 800;
const PIPE_WIDTH = 50;
const MIN_PIPE_HEIGHT = 40;
const FPS = 120;

class Pipe {
  constructor(ctx, height, space) {
    this.ctx = ctx;
    this.x = WIDTH;
    this.y = height ? HEIGHT - height : 0;
    this.width = PIPE_WIDTH;
    this.height =
      height ||
      MIN_PIPE_HEIGHT + Math.random() * (HEIGHT - space - MIN_PIPE_HEIGHT * 2);
  }

  draw() {
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
class App extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.frameCount = 0;
    this.space = 80;
  }

  componentDidMount() {
    this.pipes = this.generatePipes();
    setInterval(this.gameLoop, 1000 / FPS);
  }

  generatePipes = () => {
    var ctx = this.canvasRef.current.getContext("2d");
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
    if (this.frameCount % 240 === 0) {
      const pipes = this.generatePipes();
      this.pipes.push(...pipes);
    }

    this.pipes.forEach((pipe) => (pipe.x -= 1));
  };
  draw = () => {
    var ctx = this.canvasRef.current.getContext("2d");

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    this.pipes.forEach((pipe) => pipe.draw());
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
      </div>
    );
  }
}

export default App;
