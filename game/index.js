import { Board } from './board.js'
import React from 'react';
import ReactDOM from "react-dom";
import css from './App.css';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.board = new Board();
    this.state = { spots: this.convertBoardToState(), flag: false };
    this.clickBoard = this.clickBoard.bind(this);
    this.flagMode = this.flagMode.bind(this);
  }

  convertBoardToState() {
    const obj = {};
    this.board.spots.forEach((spot, idx) => {
      obj[idx] = spot
    });
    return obj;
  }

  flagMode(e) {
    this.setState({
      flag: !this.state.flag
    });
  }

  boardGrid() {
    const layout = [];
    for (let row = 0; row < this.board.height; row++) {
      const rowLayout = [];
      for (let col = 0; col < this.board.width; col++) {
        const spotIdx = row * this.board.width + col;
        const spot = this.board.spots[spotIdx];
        let className = spot.cleared ? 'cleared' : '';
        if (spot.cleared && spot.mine) className += ' mine';
        if (spot.flagged && !spot.cleared) className = 'flagged';
        let count = '';
        if (spot.cleared && !spot.mine) {
          count = this.board.mineCount(spotIdx);
        }
        rowLayout.push(
          <div
            data-spot={spotIdx}
            className={className}
            key={spotIdx}
          >{count ? count : ''}</div>
        );
      }
      layout.push(<div className="row" key={row}>{rowLayout}</div>)
    }
    return layout;
  }

  cleanNeighbors(spotIdx) {
    this.board.neighbors(spotIdx).filter(neighborIdx => {
      return !this.board.spots[neighborIdx].cleared && !this.board.spots[neighborIdx].mine;
    }).forEach(neighborIdx => {
      this.board.spots[neighborIdx].cleared = true;
      if (!this.board.mineCount(neighborIdx)) {
        this.cleanNeighbors(neighborIdx);
      }
    });
  }

  checkForWin() {
    return !this.board.spots.find(spot => {
      return spot.mine && !spot.flagged;
    });
  }

  checkForLoss() {
    return this.board.spots.find(spot => {
      return spot.mine && spot.cleared;
    });
  }

  clickBoard(e) {
    if (e.target.getAttribute('data-spot')) {
      const spotIdx = Number(e.target.getAttribute('data-spot'));
      if (this.state.flag) {
        this.board.spots[spotIdx].flagged = true;
      } else {
        this.board.spots[spotIdx].cleared = true;
        this.cleanNeighbors(spotIdx); 
      }
      this.setState({ spots: this.convertBoardToState() })
    }
  }

  render() {
    let text = '';
    if (this.checkForWin()) text = 'You Win!';
    else if (this.checkForLoss()) text = 'Kabloom!';
    return (
      <div>
        <h1>Minesweeper</h1>
        <div style={{display: 'flex'}}>
          <div onClick={this.clickBoard}>{this.boardGrid()}</div>
          <div>
            <span style={{float: 'left'}}>Flag Mode: </span>
            <div
              className="flag"
              style={{float: 'left', border: this.state.flag ? '1px solid lightgray' : 'none'}}
              onClick={this.flagMode}
            ></div>
          </div>
          <h1>{text}</h1>
        </div>
      </div>
    ) 
  }
}

ReactDOM.render(<App />, document.querySelector("main"));

