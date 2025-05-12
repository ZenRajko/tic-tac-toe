import React, { useState } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faRotate, faSkullCrossbones, faTrophy, faMeh } from "@fortawesome/free-solid-svg-icons";

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

const getComputerMove = (board: BoardType): number | null => {
  const availableMoves = board.map((val, idx) => (val === null ? idx : null)).filter(val => val !== null);
  return availableMoves.length ? availableMoves[Math.floor(Math.random() * availableMoves.length)] : null;
};

const App: React.FC = () => {
  const [board, setBoard] = useState<BoardType>(initialBoard);
  const [isUserTurn, setIsUserTurn] = useState<boolean>(true);
  const outcome = checkWinner(board);

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
      <div className="buttons">
        <button title="Restart" onClick={() => {
          setBoard(initialBoard);
          setIsUserTurn(true);
        }}><FontAwesomeIcon icon={faRotate} /></button>
        <button title="Visit GitHub Page" onClick={() => {
          window.open("https://github.com/ZenRajko/tic-tac-toe", "_blank");
        }
        }><FontAwesomeIcon icon={faGithub} /></button>
      </div>
      {outcome && <div className="backdrop"></div>}
      {outcome && <div className="outcome">
        {outcome === "X" && <FontAwesomeIcon icon={faTrophy} className="outcome-icon" />}
        {outcome === "O" && <FontAwesomeIcon icon={faSkullCrossbones} className="outcome-icon" />}
        {outcome === "Draw" && <FontAwesomeIcon icon={faMeh} className="outcome-icon" />}
        {getOutcome()}
      <button title="Restart" onClick={() => {
          setBoard(initialBoard);
          setIsUserTurn(true);
        }}>Of course! I'm no quitter.</button>
      </div>}
    </div>
  );
};

export default App;
