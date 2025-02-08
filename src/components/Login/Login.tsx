import { FC, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { Form, Input, Button, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import styles from "./Login.module.css";

const Login: FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      message.error(result.error);
    } else {
      message.success("Login successful!");
      router.push("/dashboard");
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* Left Side: Login Form */}
      <div className={styles.leftPanel}>
        <div className={styles.loginCard}>
          <h2 className={styles.loginTitle}>Login</h2>
          <Form onFinish={handleSubmit} layout="vertical">
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Email is required" }]}
            >
              <Input
                prefix={<UserOutlined className="input-icon" />}
                placeholder="Email"
                className={styles.inputField}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input.Password
                prefix={<LockOutlined className="input-icon" />}
                placeholder="Password"
                className={styles.inputField}
              />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className={styles.loginButton}
            >
              Login
            </Button>
            <Button
              onClick={() => router.push("/register")}
              block
              className={styles.signupButton}
            >
              Sign Up
            </Button>
          </Form>
        </div>
      </div>

      {/* Right Side: Image */}
      <div className={styles.rightPanel}></div>
    </div>
  );
};

export default Login;
