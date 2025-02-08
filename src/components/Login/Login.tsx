import { FC } from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { Form, Input, Button, message } from "antd";

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
    <div style={{ maxWidth: 400, margin: "auto", marginTop: 100 }}>
      <h2>Login</h2>
      <Form onFinish={handleSubmit}>
        <Form.Item name="email" rules={[{ required: true, message: "Email is required" }]}>
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: "Password is required" }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Login
        </Button>
        <Button type="default" onClick={() => router.push('/register')} block>
          SIGN IN
        </Button>
      </Form>
    </div>
  );
}

export default Login;