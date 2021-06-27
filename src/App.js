import "./App.css";

import React, { Component } from "react";

class App extends Component {
  render() {
    return (
      <div className="App">
        <canvas
          id="myCanvas"
          width="800"
          height="500"
          style={{ marginTop: "24px", border: "1px solid #c3c3c3" }}
        ></canvas>
      </div>
    );
  }
}

export default App;
