import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Input, Select, Button, InputNumber, Form, Alert } from "antd";
import styles from "./Learning.module.css";

const Learning = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [selectedSport, setSelectedSport] = useState("");
  const [sports, setSports] = useState<string[]>([]);
  const [error, setError] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    fetch("api/quiz/categories", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setSports(data.categories))
      .catch((error) => console.error("Error fetching sports:", error));
  }, [session?.user?.accessToken]);

  const handleAccessContent = () => {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!age || age < 15 || age > 70) {
      setError("Enter a valid age between 15 and 70.");
      return;
    }
    if (!selectedSport) {
      setError("Please select a sport.");
      return;
    }
    setError("");
    router.push(
      `/learning-content?name=${encodeURIComponent(
        name
      )}&age=${age}&sport=${selectedSport}`
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <h2 className={styles.heading}>Enter Your Details</h2>
        {error && (
          <Alert message={error} type="error" className={styles.error} />
        )}

        <Form layout="vertical">
          <Form.Item className={styles.input}>
            <Input
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="large"
            />
          </Form.Item>

          <Form.Item className={styles.input}>
            <InputNumber
              placeholder="Enter Age (15-70)"
              value={age}
              onChange={(value) => setAge(value)}
              min={15}
              max={70}
              size="large"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item className={styles.select}>
            <Select
              placeholder="Select Sport"
              value={selectedSport || undefined}
              onChange={(value) => setSelectedSport(value)}
              size="large"
            >
              {sports.map((sport) => (
                <Select.Option key={sport} value={sport}>
                  {sport}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Button
            type="primary"
            className={styles.accessButton}
            onClick={handleAccessContent}
            size="large"
          >
            Access Content
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Learning;
