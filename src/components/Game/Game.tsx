import { useState } from "react";
import styles from "./Game.module.css";

const Game = () => {
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const goodItems = [
    "Fruits",
    "Whey Protein",
    "Veggies",
    "Milk",
    "Water",
    "Oats",
  ];
  const badItems = [
    "Anabolics",
    "Performance Enhancing Drugs",
    "Injection",
    "Steroids",
    "Banned Pills",
    "Testosterone Boosters",
  ];
  const allItems = [...goodItems, ...badItems].sort(() => Math.random() - 0.5);
  const [remainingGoodItems, setRemainingGoodItems] = useState(
    goodItems.length
  );
  const [items, setItems] = useState(allItems);
  const [popup, setPopup] = useState<{ message: string; type: string } | null>(
    null
  );

  const updateLives = (change: number) => {
    setLives((prevLives) => {
      const newLives = prevLives + change;
      if (newLives <= 0) {
        setPopup({ message: "Game Over! You lost all lives.", type: "wrong" });
        setTimeout(() => window.location.reload(), 2000);
      }
      return newLives;
    });
  };

  const updateScore = (change: number) => {
    setScore((prevScore) => prevScore + change);
  };

  const checkWin = () => {
    if (remainingGoodItems === 0) {
      setPopup({
        message: "🎉 Congratulations! You won the game! 🎉",
        type: "correct",
      });
      setTimeout(() => window.location.reload(), 3000);
    }
  };

  const handleClick = (item: string) => {
    if (goodItems.includes(item)) {
      setPopup({ message: "✔ Correct! +10 Points", type: "correct" });
      updateScore(10);
      setRemainingGoodItems((prev) => prev - 1);
      checkWin();
    } else {
      setPopup({ message: "❌ Wrong! -10 Points & Life Lost", type: "wrong" });
      updateScore(-10);
      updateLives(-1);
    }
    setItems((prevItems) => prevItems.filter((i) => i !== item));
  };

  return (
    <div className={styles.container}>
      <h1>Anti-Doping Awareness Game</h1>
      <div className={styles.gameBox}>
        <p>Click on the healthy items!</p>
        <div className={styles.itemsContainer}>
          {items.map((item) => (
            <div
              key={item}
              className={styles.item}
              onClick={() => handleClick(item)}
            >
              {item}
            </div>
          ))}
        </div>
        <p className={styles.stats}>
          Lives: <span>{lives}</span>
        </p>
        <p className={styles.stats}>
          Score: <span>{score}</span>
        </p>
      </div>
      {popup && (
        <div className={`${styles.popup} ${styles[popup.type]}`}>
          {popup.message}
        </div>
      )}
    </div>
  );
};

export default Game;
