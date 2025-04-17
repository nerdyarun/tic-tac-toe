"use client";

import { useState } from 'react';
import Howler from 'react-howler';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [showCongrats, setShowCongrats] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [draw, setDraw] = useState(false);
  const [score, setScore] = useState({ X: 0, O: 0 });

  const getSymbolOwnerName = (symbol) => (symbol === 'X' ? player1 : player2);
  const getCurrentPlayerName = () => (isXNext ? player1 : player2);
  const getCurrentSymbol = () => (isXNext ? 'X' : 'O');

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (!gameStarted || board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = getCurrentSymbol();
    setBoard(newBoard);

    const win = calculateWinner(newBoard);
    if (win) {
      setWinner(win);
      setScore((prev) => ({ ...prev, [win]: prev[win] + 1 }));
      setShowCongrats(true);
      setDraw(false);
    } else if (newBoard.every(Boolean)) {
      setDraw(true);
      setShowCongrats(true);
    } else {
      setIsXNext(!isXNext);
    }
  };

  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setShowCongrats(false);
    setDraw(false);
  };

  const handleStart = () => {
    if (player1 && player2) {
      setGameStarted(true);
    } else {
      alert("Please enter both player names!");
    }
  };

  return (
    <div className={styles.container}>
      <h1>🎮 Tic Tac Toe</h1>

      {!gameStarted && (
        <>
          <input
            type="text"
            placeholder="Player 1 Name"
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
            style={{ marginRight: '1rem' }}
          />
          <input
            type="text"
            placeholder="Player 2 Name"
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
          />
          <br /><br />
          <button onClick={handleStart} className={styles.resetButton}>Start Game</button>
        </>
      )}

      {gameStarted && (
        <>
          <h2>Turn: {getCurrentPlayerName()}</h2>

          <div className={styles.scoreboard}>
            <span>{player1 || 'Player 1'}: {score.X} 🟥</span>
            <span>{player2 || 'Player 2'}: {score.O} 🟦</span>
          </div>

          <div className={styles.board}>
            {board.map((square, index) => (
              <button
                key={index}
                className={`${styles.square} ${square === 'X' ? 'p1' : square === 'O' ? 'p2' : ''}`}
                onClick={() => handleClick(index)}
              >
                {square && getSymbolOwnerName(square)}
              </button>
            ))}
          </div>

          {showCongrats && (
            <div className={styles.congrats}>
              {winner ? (
                <h2>🎉Congratulations {getSymbolOwnerName(winner)}! You win! 🎉</h2>
              ) : draw ? (
                <h2>😅 It&apos;s a draw! Well played both!</h2>
              ) : null}
            </div>
          )}

          <button onClick={handleReset} className={styles.resetButton}>Next Round</button>
        </>
      )}

      {(winner || draw) && <Howler src="/win-sound.mp3" playing={true} />}
    </div>
  );
}
