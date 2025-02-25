/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import styles from "./Game.module.css";

const Game = () => {
  const initialLives = 3;
  const initialScore = 0;

  const textGoodItems = [
    "Banana",
    "Spinach",
    "Almonds",
    "Eggs",
    "Milk",
    "Brown Rice",
  ];
  const textBadItems = [
    "Anabolic Steroids",
    "EPO",
    "HGH",
    "Stimulants",
    "Beta-Blockers",
    "Blood Doping",
  ];

  const imageItems = [
    { name: "Apple", src: "/images/apple.jpg", type: "good" },
    { name: "Broccoli", src: "/images/broccoli.jpg", type: "good" },
    { name: "Protein Shake", src: "/images/protein_shake.jpg", type: "good" },
    { name: "Steroid Pills", src: "/images/steroid_pills.jpg", type: "bad" },
    { name: "Injection", src: "/images/injection.png", type: "bad" },
    { name: "Banned Powder", src: "/images/banned_powder.jpg", type: "bad" },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shuffleArray = (array: any[]) => array.sort(() => Math.random() - 0.5);

  const [lives, setLives] = useState(initialLives);
  const [score, setScore] = useState(initialScore);
  const [popup, setPopup] = useState<{ message: string; type: string } | null>(
    null
  );
  const [gameOverMessage, setGameOverMessage] = useState<string | null>(null);
  const [textItems, setTextItems] = useState(
    shuffleArray([...textGoodItems, ...textBadItems])
  );
  const [imageChoices, setImageChoices] = useState(shuffleArray(imageItems));

  useEffect(() => {
    if (popup) {
      const timer = setTimeout(() => setPopup(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [popup]);

  useEffect(() => {
    if (lives === 0) {
      setGameOverMessage("❌ You lost the game!");
      restartGame();
    } else if (
      textItems.every((item) => !textGoodItems.includes(item)) &&
      imageChoices.every((item) => item.type !== "good")
    ) {
      setGameOverMessage("🎉 You have won the game! 🎉");
      restartGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lives, textItems, imageChoices]);

  const restartGame = () => {
    setTimeout(() => {
      setLives(initialLives);
      setScore(initialScore);
      setGameOverMessage(null);
      setTextItems(shuffleArray([...textGoodItems, ...textBadItems]));
      setImageChoices(shuffleArray(imageItems));
    }, 5000); // Restart after 5 seconds
  };

  const handleClick = (item: string, type: string) => {
    if (type === "good") {
      setPopup({ message: "✔ Correct! +10 Points", type: "correct" });
      setScore((prev) => prev + 10);
    } else {
      setPopup({ message: "❌ Wrong! -10 Points & Life Lost", type: "wrong" });
      setScore((prev) => prev - 10);
      setLives((prev) => (prev > 1 ? prev - 1 : 0));
    }
    setTextItems((prev) => prev.filter((i) => i !== item));
  };

  const handleImageClick = (item: {
    name: string;
    src: string;
    type: string;
  }) => {
    handleClick(item.name, item.type);
    setImageChoices((prev) => prev.filter((i) => i.name !== item.name));
  };

  return (
    <div className={styles.container}>
      {gameOverMessage ? (
        <div className={styles.gameOver}>{gameOverMessage}</div>
      ) : (
        <>
          <div className={styles.livesContainer}>
            <h2>Lives: {lives}</h2>
          </div>
          <div className={styles.gameSection}>
            <div className={styles.gameBox}>
              <h1>Text-Based Game</h1>
              <p>Select the healthy items!</p>
              <div className={styles.itemsContainer}>
                {textItems.map((item) => (
                  <div
                    key={item}
                    className={styles.item}
                    onClick={() =>
                      handleClick(
                        item,
                        textGoodItems.includes(item) ? "good" : "bad"
                      )
                    }
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.scoreBox}>
              <h1>Total Score</h1>
              <p className={styles.totalScore}>{score}</p>
            </div>
            <div className={styles.gameBox}>
              <h1>Image-Based Game</h1>
              <p>Select the correct items!</p>
              <div className={styles.imageContainer}>
                {imageChoices.map((item) => (
                  <div
                    key={item.name}
                    className={styles.imageItem}
                    onClick={() => handleImageClick(item)}
                  >
                    <img src={item.src} alt={item.name} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
      {popup && (
        <div className={`${styles.popup} ${styles[popup.type]}`}>
          {popup.message}
        </div>
      )}
    </div>
  );
};

export default Game;
