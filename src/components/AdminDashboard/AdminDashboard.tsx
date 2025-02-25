import { FC } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "antd";
import { signOut } from "next-auth/react";

const AdminDashboard: FC = () => {

  const { user } = useAuth();

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h1>Welcome, {user?.name}</h1>
      <p>Role: {user?.role}</p>
      <Button type="primary" onClick={() => signOut()}>
        Logout
      </Button>
    </div>
  )
}

export default AdminDashboard;