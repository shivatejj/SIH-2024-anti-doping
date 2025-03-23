import { useState } from "react";
import { Form, Input, Select, Button, Modal, Card, Row, Col } from "antd";
import { useSession } from "next-auth/react";
import styles from "./AddQuiz.module.css";

const { Option } = Select;

const AddQuiz = () => {
  const [form] = Form.useForm();
  const { data: session } = useSession();
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], answer: "" },
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], answer: "" },
    ]);
  };

  const handleQuestionChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const newQuestions = [...questions];
    if (field === "question") {
      newQuestions[index].question = value;
    } else if (field.startsWith("option")) {
      const optionIndex = parseInt(field.replace("option", ""));
      newQuestions[index].options[optionIndex] = value;
    } else if (field === "answer") {
      newQuestions[index].answer = value;
    }
    setQuestions(newQuestions);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (values: any) => {
    const quizData = { ...values, questions };

    try {
      const response = await fetch("/api/quiz/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quizData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        setErrorMessage(responseData.message || "Failed to create quiz");
        setIsErrorModalVisible(true);
        return;
      }

      setIsSuccessModalVisible(true);
      form.resetFields();
      setQuestions([{ question: "", options: ["", "", "", ""], answer: "" }]);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setErrorMessage("An unexpected error occurred");
      setIsErrorModalVisible(true);
    }
  };

  return (
    <Card title="Add New Quiz" className={styles.container}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        scrollToFirstError
      >
        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Category is required" }]}
        >
          <Input placeholder="Enter category" />
        </Form.Item>

        <Form.Item
          label="Content"
          name="content"
          rules={[{ required: true, message: "Content is required" }]}
        >
          <Input.TextArea placeholder="Enter content" />
        </Form.Item>

        <Form.Item
          label="Level"
          name="level"
          rules={[{ required: true, message: "Level is required" }]}
        >
          <Select placeholder="Select level">
            <Option value="easy">Easy</Option>
            <Option value="medium">Medium</Option>
            <Option value="hard">Hard</Option>
          </Select>
        </Form.Item>

        {questions.map((q, index) => (
          <Card
            key={index}
            title={`Question ${index + 1}`}
            className={styles.questionBlock}
          >
            <Form.Item label="Question" required>
              <Input
                value={q.question}
                onChange={(e) =>
                  handleQuestionChange(index, "question", e.target.value)
                }
                placeholder="Enter question"
              />
            </Form.Item>

            <Row gutter={[8, 8]}>
              {q.options.map((opt, optIndex) => (
                <Col key={optIndex} xs={24} sm={24} md={12} lg={12}>
                  <Form.Item required>
                    <Input
                      key={optIndex}
                      placeholder={`Option ${optIndex + 1}`}
                      value={opt}
                      onChange={(e) =>
                        handleQuestionChange(
                          index,
                          `option${optIndex}`,
                          e.target.value
                        )
                      }
                    />
                  </Form.Item>
                </Col>
              ))}
            </Row>

            <Form.Item label="Correct Answer" required>
              <Input
                value={q.answer}
                onChange={(e) =>
                  handleQuestionChange(index, "answer", e.target.value)
                }
                placeholder="Enter correct answer"
              />
            </Form.Item>
          </Card>
        ))}

        <Button
          type="dashed"
          onClick={addQuestion}
          style={{ width: "100%", marginBottom: 16 }}
        >
          + Add Question
        </Button>

        <Button type="primary" htmlType="submit" block>
          Create Quiz
        </Button>
      </Form>

      {/* Success Modal */}
      <Modal
        title="Success"
        open={isSuccessModalVisible}
        onOk={() => setIsSuccessModalVisible(false)}
        onCancel={() => setIsSuccessModalVisible(false)}
      >
        <p>Quiz created successfully!</p>
      </Modal>

      {/* Error Modal */}
      <Modal
        title="Error"
        open={isErrorModalVisible}
        onOk={() => setIsErrorModalVisible(false)}
        onCancel={() => setIsErrorModalVisible(false)}
      >
        <p>{errorMessage}</p>
      </Modal>
    </Card>
  );
};

export default AddQuiz;
