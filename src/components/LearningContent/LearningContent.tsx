import React, { useEffect, useState } from "react";
import styles from "./LearningContent.module.css";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FiLock } from "react-icons/fi";
import { Radio } from "antd";
import { QuizLevelEnum } from "@/models/Quiz";

const style: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const levels = ["easy", "medium", "hard"];

interface IQuestionResponse {
  id: string;
  content: string;
  level: QuizLevelEnum | undefined;
  questions: {
    id: string;
    question: string;
    options: string[];
  }[]
}

interface IEvaluatePayload {
  quizId: string;
  category: string;
  answers: {
    questionId: string;
    selectedOption: string;
  }[]
}

const LearningContent = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [questionResponse, setQuestionResponse] = useState<IQuestionResponse>({
    id: '',
    content: '',
    level: undefined,
    questions: []
  });
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [evaluatePayload, setEvaluatePayload] = useState<IEvaluatePayload>({
    quizId: '',
    category: '',
    answers: []
  });

  useEffect(() => {
    const getQuestions = async () => {
      if (session?.user?.accessToken && router?.query?.sport) {
        try {
          setLoading(true);
          const response = await fetch(
            `api/quiz/get?category=${router?.query?.sport}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${session?.user?.accessToken}`,
                "Content-Type": "application/json",
              },
              credentials: "include",
            }
          )
          if (!response.ok) {
            const errorData = await response.json();
            setErrorMessage(errorData.message);
            setLoading(false);
            throw new Error(errorData.message || 'Failed to get questions');
          }
          const questionsData = await response.json();
          setQuestionResponse(questionsData);
          setLoading(false);
        } catch (e) {
          console.error(e);
          setLoading(false);
        }
      }
    }

    getQuestions();
  }, [session?.user?.accessToken, router?.query?.sport, session?.user?.level]);

  const evaluateQuiz = async (data: IEvaluatePayload) => {
    try {
      const response = await fetch(
        `api/quiz/evaluate`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        }
      )

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
        setLoading(false);
        throw new Error(errorData.message || 'Failed to evaluate');
      }
      const result = await response.json();
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  }

  const onSubmit = (data: IEvaluatePayload) => {
    evaluateQuiz(data);
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <h1>Learning Content - {router?.query?.sport}</h1>

        <div className={styles.levels}>
          {levels.map((level) => (
            <button
              key={level}
              className={`${styles.levelButton} ${questionResponse?.level === level ? styles.activeLevel : ""}`}
            >
              {questionResponse?.level !== level ? (
                <div className={styles.lockIcon}>
                  <FiLock />
                </div>
              ) : null}
              {level.toUpperCase()}
            </button>
          ))}
        </div>

        <div className={styles.submitContainer}>
          <button
            className={styles.submitButton}
            onClick={() => onSubmit(evaluatePayload)}
            disabled={evaluatePayload?.answers?.length !== 5}
          >
            Submit
          </button>
        </div>
      </div>

      <div className={styles.rightPanel}>
        {
          loading ? <Loader className={styles.loader} /> :
            <>
              <div className={styles.contentContainer}>
                <p className={styles.content}>{questionResponse.content}</p>
              </div>
              <div className={styles.quizContainer}>
                {questionResponse?.questions?.length > 0 ? (
                  questionResponse?.questions?.map(
                    (question, index: number) => (
                      <div key={index} className={styles.questionContainer}>
                        <p className={styles.question}>{question.question}</p>
                        <Radio.Group
                          key={question.id}
                          style={style}
                          className={styles.option}
                          onChange={(event) => {
                            setEvaluatePayload({
                              quizId: questionResponse.id,
                              category: router?.query?.sport as string,
                              answers: [
                                ...evaluatePayload.answers.filter((ans) => ans.questionId !== question.id), // Remove previous answer for the same question
                                { questionId: question.id, selectedOption: event.target.value }
                              ]
                            });
                          }}
                        >
                          {question.options.map((option) => (
                            <Radio key={option} value={option}>
                              {option}
                            </Radio>
                          ))}
                        </Radio.Group>
                      </div>
                    )
                  )
                ) : (
                  <p>{errorMessage}</p>
                )}
              </div>
            </>
        }
      </div>
    </div>
  );
};

export default LearningContent;
