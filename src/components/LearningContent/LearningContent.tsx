import React, { useEffect, useState } from "react";
import styles from "./LearningContent.module.css";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FiLock } from "react-icons/fi"; // Import the lock icon

const levels = ["easy", "medium", "hard"];

const LearningContent = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [currentLevel, setCurrentLevel] = useState("easy");
  const { data: session } = useSession();
  const [questions, setQuestions] = useState<[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // Set selectedCategory from router query
  useEffect(() => {
    if (router.query.sport) {
      setSelectedCategory(router.query.sport as string);
    }
  }, [router.query.sport]);

  // Fetch questions and content based on selectedCategory and currentLevel
  useEffect(() => {
    if (!selectedCategory) return;
    setLoading(true);
    fetch(`api/quiz/get?category=${selectedCategory}&level=${currentLevel}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data.questions || []);
        setContent(data.content || "");
      })
      .catch((error) => {
        console.error("Error fetching content and questions:", error);
      })
      .finally(() => setLoading(false));
  }, [session?.user?.accessToken, selectedCategory, currentLevel]);

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <h1>Learning Content - {selectedCategory}</h1>

        <div className={styles.levels}>
          {levels.map((level) => (
            <button
              key={level}
              className={`${styles.levelButton} ${
                currentLevel === level ? styles.activeLevel : ""
              }`}
              disabled={levels.indexOf(level) > levels.indexOf(currentLevel)}
              onClick={() => setCurrentLevel(level)}
            >
              {level === "medium" || level === "hard" ? (
                <div className={styles.lockIcon}>
                  <FiLock />
                </div>
              ) : null}
              {level.toUpperCase()}
            </button>
          ))}
        </div>

        <div className={styles.submitContainer}>
          <button className={styles.submitButton} onClick={() => {}}>
            Submit
          </button>
        </div>
      </div>

      <div className={styles.rightPanel}>
        {loading && <Loader className={styles.loader} />}

        <div className={styles.contentContainer}>
          <p className={styles.content}>{content}</p>
        </div>

        <div className={styles.quizContainer}>
          {questions.length > 0 ? (
            questions.map(
              (q: { question: string; options: string[] }, index: number) => (
                <div key={index} className={styles.questionContainer}>
                  <p className={styles.question}>{q.question}</p>
                  {q.options.map((option, idx) => (
                    <div key={idx} className={styles.option}>
                      <input
                        type="radio"
                        id={`question${index}_option${idx}`}
                        name={`question${index}`}
                        value={option}
                      />
                      <label htmlFor={`question${index}_option${idx}`}>
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              )
            )
          ) : (
            <p>No questions available for this category and level.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningContent;
