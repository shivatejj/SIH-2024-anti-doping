import { FC } from "react";
import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useRouter } from "next/router";

const Register: FC = () => {

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: { name: string; email: string; password: string }) => {
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    setLoading(false);

    if (res.ok) {
      message.success("Registration successful!");
      router.push("/login");
    } else {
      message.error("Error registering user");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", marginTop: 100 }}>
      <h2>Register</h2>
      <Form onFinish={handleSubmit}>
        <Form.Item name="name" rules={[{ required: true, message: "Name is required" }]}>
          <Input placeholder="Name" />
        </Form.Item>
        <Form.Item name="email" rules={[{ required: true, message: "Email is required" }]}>
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: "Password is required" }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Register
        </Button>
      </Form>
    </div>
  );
}

export default Register;