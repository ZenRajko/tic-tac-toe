import React, { useState } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faRotate, faInfoCircle, faSkullCrossbones, faTrophy, faMeh } from "@fortawesome/free-solid-svg-icons";

type BoardType = (string | null)[];

const initialBoard: BoardType = Array(9).fill(null);

const checkWinner = (board: BoardType): string | null => {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return board.includes(null) ? null : "Draw";
};

const App: React.FC = () => {
  const [board, setBoard] = useState<BoardType>(initialBoard);
  const [isUserTurn, setIsUserTurn] = useState<boolean>(true);
  const [isAbout, setAbout] = useState<boolean>(false);
  const [opponentType, setOpponentType] = useState<number>(0);
  const outcome = checkWinner(board);

  const getComputerMove = (board: BoardType): number | null => {
    const availableMoves = board.map((val, idx) => (val === null ? idx : null)).filter(val => val !== null);
    if (availableMoves.length === 0) return null;
    switch (opponentType) {
      case 1: // Astute Antagonist
        // Check for winning move
        for (let move of availableMoves) {
          const newBoard = [...board];
          if (move) newBoard[move] = "O";
          if (checkWinner(newBoard) === "O") {
            return move;
          }
        }
        // Block opponent's winning move
        for (let move of availableMoves) {
          const newBoard = [...board];
          if (move) newBoard[move] = "X";
          if (checkWinner(newBoard) === "X") {
            return move;
          }
        }
        // Choose center if available
        if (availableMoves.includes(4)) {
          return 4;
        }
        // Choose a corner if available
        const corners = [0, 2, 6, 8];
        for (let corner of corners) {
          if (availableMoves.includes(corner)) {
            return corner;
          }
        }
        // Choose a side if available
        const sides = [1, 3, 5, 7];
        for (let side of sides) {
          if (availableMoves.includes(side)) {
            return side;
          }
        }
        break;
      default: // Random Clicker
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    return null;
  };

  const handleClick = (index: number) => {
    if (!board[index] && !outcome && isUserTurn) {
      const newBoard = [...board];
      newBoard[index] = "X";
      setBoard(newBoard);
      setIsUserTurn(false);

      setTimeout(() => {
        if (!checkWinner(newBoard)) {
          const computerMove = getComputerMove(newBoard);
          if (computerMove !== null) {
            newBoard[computerMove] = "O";
            setBoard(newBoard);
          }
        }
        setIsUserTurn(true);
      }, 500);
    }
  };

  const getOutcome = () => {
    if (outcome === "X") {
      return "Victory is Yours!\nWill you accept another challenge?";
    } else if (outcome === "O") {
      return "Failure is simply a lesson.\nWill you continue your education?";
    } else if (outcome === "Draw") {
      return "A stalemate.\nWill you attempt to do better?";
    }
    return null;
  };

  const restartGame = (newOpponentType: number) => {
    setOpponentType(newOpponentType);
    setBoard(initialBoard);
    setIsUserTurn(true);
  }

  return (
    <div className="game">
      <div className="title">Tic-Tac-Toe</div>
      <div className="subtitle">A classic game of man vs machine</div>
      <div className="board">
        {board.map((cell, index) => (
          <button key={index} onClick={() => handleClick(index)}
            className={`${cell === "X" ? "cell-x" : (cell === "O" ? "cell-o" : "cell")}`}>
          </button>
        ))}
      </div>
      <div className="opponents">
        <p>Opponent: Click to change<br></br>(will restart game)</p>
        <button title="Restart" onClick={() => restartGame(0)}
          className={`${opponentType === 0 ? "current-opponent" : ""}`}
          >Random Clicker</button>
        <button title="Restart" onClick={() => restartGame(1)}
          className={`${opponentType === 1 ? "current-opponent" : ""}`}
          >Astute Antagonist</button>
      </div>
      <div className="buttons">
        <button title="Restart" onClick={() => restartGame(opponentType)}>
          <FontAwesomeIcon icon={faRotate} /></button>
        <button title="Visit GitHub Page" onClick={() => {
          window.open("https://github.com/ZenRajko/tic-tac-toe", "_blank");
        }
        }><FontAwesomeIcon icon={faGithub} /></button>
        <button title="About This App" onClick={() => {
          setAbout(true);
        }
        }><FontAwesomeIcon icon={faInfoCircle} /></button>
      </div>
      {(outcome || isAbout) && <div className="backdrop"></div>}
      {outcome && <div className="outcome">
        {outcome === "X" && <FontAwesomeIcon icon={faTrophy} className="outcome-icon" />}
        {outcome === "O" && <FontAwesomeIcon icon={faSkullCrossbones} className="outcome-icon" />}
        {outcome === "Draw" && <FontAwesomeIcon icon={faMeh} className="outcome-icon" />}
        {getOutcome()}
      <button title="Restart" onClick={() => restartGame(opponentType)}>Of course! I'm no quitter.</button>
      </div>}
      {isAbout && <div className="about">
        {isAbout && <FontAwesomeIcon icon={faInfoCircle} className="about-icon" />}
        {"A Game By D.Rajkowski\n12 May 2025\nThanks for playing!"}
      <button title="Close" onClick={() => {
        setAbout(false);
        }}>Return to battle!</button>
      </div>}
    </div>
  );
};

export default App;
