import React, { useCallback, useEffect, useState } from "react";
import styles from "./LearningContent.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Radio, Modal, Button, Spin, Typography, Row, Col, Skeleton, Result } from "antd";
import { CheckCircleFilled, CloseCircleOutlined, EditOutlined, FrownOutlined, LockFilled, SmileOutlined } from "@ant-design/icons";
import { QuizLevelEnum } from "@/utils/Constants";

const { Text } = Typography

const style: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const levels = [
  QuizLevelEnum.EASY,
  QuizLevelEnum.MEDIUM,
  QuizLevelEnum.HARD,
  QuizLevelEnum.COMPLETED,
  undefined,
];

interface IQuestionResponse {
  id: string;
  content: string;
  level: QuizLevelEnum | undefined;
  questions: {
    id: string;
    question: string;
    options: string[];
  }[];
}

interface IQuestionErrorResponse {
  message: string;
  level?: QuizLevelEnum.COMPLETED;
}

interface IEvaluatePayload {
  quizId: string;
  category: string;
  answers: {
    questionId: string;
    selectedOption: string;
  }[];
  isAutoSubmitted?: boolean;
}

interface IEvaluateResponse {
  message: string;
  score: number;
  attempts: number;
  level: QuizLevelEnum;
  isCleared: boolean;
  isCategoryCompleted: boolean;
}

const LearningContent = () => {
  const router = useRouter();
  const [modal, contextHolder] = Modal.useModal();
  const { data: session } = useSession();
  const [questionSuccessResponse, setQuestionSuccessResponse] = useState<IQuestionResponse | null>(null);
  const [questionsErrorResponse, setQuestionsErrorResponse] = useState<IQuestionErrorResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [evaluatePayload, setEvaluatePayload] = useState<IEvaluatePayload>({
    quizId: "",
    category: "",
    answers: [],
  });
  const [evaluateResponse, setEvaluateResponse] = useState<IEvaluateResponse | null>(null);
  const [evaluateSuccessModalVisible, setEvaluateSuccessModalVisible] = useState<boolean>(false);
  const [retryLoading, setRetryLoading] = useState<boolean>(false);

  const getQuestions = useCallback(async () => {
    if (session?.user?.accessToken && router?.query?.sport) {
      try {
        setLoading(true);
        const response = await fetch(
          `api/quiz/get?category=${router?.query?.sport}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session?.user?.accessToken}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          setQuestionsErrorResponse(errorData);
          setLoading(false);
          throw new Error(errorData.message || "Failed to get questions");
        }
        const questionsData = await response.json();
        setQuestionSuccessResponse(questionsData);
        setEvaluatePayload({
          quizId: questionsData?.id,
          category: router?.query?.sport as string,
          answers: [],
        });
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    }
  }, [session?.user?.accessToken, router?.query?.sport]);

  useEffect(() => {
    getQuestions();
  }, [getQuestions]);

  const evaluateQuiz = async (data: IEvaluatePayload) => {
    try {
      setLoading(true);
      const response = await fetch(`api/quiz/evaluate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        setLoading(false);
        throw new Error(errorData.message || "Failed to evaluate");
      }
      const result = await response.json();
      if (!result.isAutoSubmitted) {
        setEvaluateResponse(result);
        setEvaluateSuccessModalVisible(true);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const onSubmit = (data: IEvaluatePayload) => {
    evaluateQuiz(data);
  };

  const reset = () => {
    setEvaluateResponse(null);
    setEvaluateSuccessModalVisible(false);
    setRetryLoading(false);
    setEvaluatePayload({
      quizId: "",
      category: "",
      answers: [],
    });
  }

  const handleExitOk = async () => {
    setRetryLoading(true);
    try {
      const data: IEvaluatePayload = {
        quizId: questionSuccessResponse?.id as string,
        category: router?.query?.sport as string,
        answers: [],
        isAutoSubmitted: true,
      }
      await evaluateQuiz(data);
    } catch (error) {
      console.error("Error on retry:", error);
    } finally {
      setTimeout(() => {
        reset();
        router.push('/learning');
      }, 500);
    }
  }

  const handleCancel = () => {
    reset();
    router.push('/learning');
  }

  const handleRetry = async () => {
    setRetryLoading(true);
    try {
      await getQuestions();
    } catch (error) {
      console.error("Error on retry:", error);
    } finally {
      setTimeout(() => {
        reset();
      }, 500);
    }
  }

  const exitConfig = {
    title: 'Are you sure you want to exit the exam?',
    content: <>
      <p>Your answers may not be saved.</p>
      <strong>Note : </strong> Exiting will be considered as a submission.
    </>,
    okText: 'Yes',
    cancelText: 'No',
    onOk: handleExitOk
  };

  return (
    <>
      <Spin spinning={loading} size="large">
        {contextHolder}
        <div className={styles.container}>
          <div className={styles.leftPanel}>
            {
              questionSuccessResponse || questionsErrorResponse ?
                <>
                  <h1>Learning Content - {router?.query?.sport}</h1>
                  <div className={styles.levels}>
                    {
                      levels.map((level, index) => {
                        const currentIndex = levels.indexOf(questionSuccessResponse?.level || questionsErrorResponse?.level || undefined);
                        const isCompleted = currentIndex !== 4 && index < currentIndex;
                        const isCurrent = index === currentIndex;
                        const isLocked = currentIndex === 4 || index > currentIndex;

                        if (level && level !== QuizLevelEnum.COMPLETED) {
                          return (
                            <div
                              key={level}
                              className={`${styles.levelBox} 
                                ${isCompleted ? styles.completed : ""} 
                                ${isCurrent ? styles.current : ""}
                                ${isLocked ? styles.locked : ""}`
                              }
                            >
                              {isLocked && <LockFilled className={styles.lockIcon} />}
                              {isCurrent && <EditOutlined className={styles.editIcon} />}
                              {isCompleted && <CheckCircleFilled className={styles.checkIcon} />}
                              <span>{level.toUpperCase()}</span>
                            </div>
                          );
                        }
                        return;
                      })
                    }
                  </div>
                </>
                :
                <Skeleton />
            }
            {
              questionSuccessResponse &&
              <div className={styles.submitContainer}>
                <button
                  className={styles.submitButton}
                  onClick={() => onSubmit(evaluatePayload)}
                  disabled={evaluatePayload?.answers?.length !== 5}
                >
                  Submit
                </button>
              </div>
            }
          </div>
          <div className={styles.rightPanel}>
            {
              questionSuccessResponse ?
                <>
                  <Row className={styles.headerWrapper}>
                    <Col span={20}>
                      <Text className={styles.noteWrapper}><strong>Note:</strong> You need to answer at least 3 questions correctly to progress to the next level.</Text>
                    </Col>
                    <Col span={4} className={styles.discardButtonWrapper}>
                      <Button
                        type="default"
                        className={styles.discardButton}
                        onClick={() => modal.confirm(exitConfig)}
                        icon={<CloseCircleOutlined />}
                      >
                        EXIT
                      </Button>
                    </Col>
                  </Row>
                  <div className={styles.contentContainer}>
                    <p className={styles.content}>{questionSuccessResponse.content}</p>
                  </div>
                  <div className={styles.quizContainer}>
                    {
                      questionSuccessResponse?.questions?.map(
                        (question, index: number) => (
                          <div key={index} className={styles.questionContainer}>
                            <p className={styles.question}>{question.question}</p>
                            <Radio.Group
                              key={question.id}
                              style={style}
                              className={styles.option}
                              onChange={(event) => {
                                setEvaluatePayload({
                                  quizId: questionSuccessResponse.id,
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
                    }
                  </div>
                </>
                :
                questionsErrorResponse ?
                  <Result
                    status={questionsErrorResponse.level === QuizLevelEnum.COMPLETED ? "success" : 'error'}
                    title={questionsErrorResponse?.message}
                    extra={[
                      <Button type="primary" key="console" onClick={() => handleCancel()}>
                        BACK
                      </Button>,
                    ]}
                  />
                  :
                  <Skeleton />
            }
          </div>
        </div>
        {
          evaluateResponse && evaluateSuccessModalVisible &&
          <Modal
            open={evaluateResponse && evaluateSuccessModalVisible}
            maskClosable={false}
            closable={false}
            title={
              <div className={styles.successModalTitleWrapper}>
                {
                  evaluateResponse?.isCleared ?
                    <SmileOutlined className={styles.successIcon} />
                    :
                    <FrownOutlined className={styles.failIcon} />
                }
              </div>
            }
            okText={evaluateResponse?.isCleared ? 'Proceed to Next Level' : 'Retry'}
            onCancel={handleCancel}
            onOk={handleRetry}
            confirmLoading={retryLoading}
            footer={
              evaluateResponse?.isCategoryCompleted ?
                [
                  <Button
                    key={'category-complete'}
                    onClick={handleCancel}
                  >
                    BACK
                  </Button>
                ] :
                [
                  <>
                    <Button
                      key='cancel'
                      type="default"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      key='retry'
                      type="primary"
                      onClick={handleRetry}
                    >
                      {evaluateResponse?.isCleared ? 'Proceed to Next Level' : 'Retry'}
                    </Button>
                  </>
                ]
            }
          >
            <>
              <p>{`You scored ${evaluateResponse?.score} points`}</p>
              <p>{evaluateResponse?.message}</p>
            </>
          </Modal>
        }
      </Spin>
    </>
  );
};

export default LearningContent;
