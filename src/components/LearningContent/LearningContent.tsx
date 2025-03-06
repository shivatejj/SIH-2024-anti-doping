import { useEffect, useState } from "react";
import styles from "./LearningContent.module.css";

interface Question {
  id: number;
  question: string;
  paragraph: string;
  options: string[];
  answer: string;
}

const LearningContent = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [score, setScore] = useState<number>(0);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://your-api-endpoint.com/questions")
      .then((response) => response.json())
      .then((data) => setQuestions(data))
      .catch((error) => console.error("Error fetching questions:", error));
  }, []);

  const handleLevelClick = (level: number) => {
    if (level === 2 && score < 3) return;
    if (level === 3 && score < 6) return;
    setSelectedLevel(selectedLevel === level ? null : level);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Master Your Learning</h1>
      <p className={styles.subtitle}>
        Unlock levels and enhance your knowledge!
      </p>

      <div className={styles.levels}>
        {[1, 2, 3].map((level) => (
          <div
            key={level}
            className={`${styles.levelBox} ${
              score >= (level - 1) * 3 ? styles.unlocked : styles.locked
            }`}
            onClick={() => handleLevelClick(level)}
          >
            <h2 className={styles.levelTitle}>Level {level}</h2>
            {score < (level - 1) * 3 && <div className={styles.lock}>🔒</div>}

            {selectedLevel === level && (
              <div className={styles.contentBox}>
                {questions.length > 0 ? (
                  <>
                    <p className={styles.paragraph}>{questions[0].paragraph}</p>
                    <ul className={styles.questionList}>
                      {questions.map((q) => (
                        <li key={q.id} className={styles.questionBox}>
                          {q.question}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className={styles.loading}>Loading content...</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningContent;
