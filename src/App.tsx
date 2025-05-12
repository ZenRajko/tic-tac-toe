import React, { useState } from "react";
import "./App.css";

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
  const winner = checkWinner(board);

  const handleClick = (index: number) => {
    if (!board[index] && !winner && isUserTurn) {
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

  return (
    <div className="game">
      <div className="title">Tic-Tac-Toe</div>
      <div className="board">
        {board.map((cell, index) => (
          <button key={index} className={`${cell == "X" ? "cell-x" : (cell == "O" ? "cell-o" : "cell")}`} onClick={() => handleClick(index)}>
          </button>
        ))}
      </div>
      {winner && <h2>{winner === "Draw" ? "It's a draw!" : `Winner: ${winner}`}</h2>}
    </div>
  );
};

export default App;
