import { Button, Result } from "antd";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/router";
const NotFound = () => {

  const router = useRouter();
  const { user } = useAuth();

  const onClickHome = () => {
    if (user?.role === 'user') {
      router.push("/home");
    } else {
      router.push("/admin-dashboard");
    }
  }

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={<Button type="primary" onClick={onClickHome}>Back Home</Button>}
    />
  )
}

export default NotFound;