import { Button, Result } from "antd";
import { useRouter } from "next/router";
import { FC } from "react";
import { useAuth } from "../contexts/AuthContext";

const Unauthorized: FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const onClickHome = () => {
    if (user?.role === "user") {
      router.push("/home");
    } else {
      router.push("/admin-dashboard");
    }
  };

  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={
        <Button type="primary" onClick={onClickHome}>
          Back Home
        </Button>
      }
    />
  );
};

export default Unauthorized;
