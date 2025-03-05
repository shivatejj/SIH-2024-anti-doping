import { FC, useEffect, useState } from "react";
import { Button, Table, message } from "antd";
import { signOut } from "next-auth/react";
import axios from "axios";
import Cookies from "js-cookie";

const AdminDashboard: FC = () => {
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ name?: string; role?: string } | null>(
    null
  );

  useEffect(() => {
    fetchUserData();
    fetchActivityData();
  }, []);

  const fetchUserData = () => {
    const token = Cookies.get("auth-token"); // Ensure your token name is correct
    if (!token) {
      message.error("Not authenticated");
      return;
    }

    try {
      const userData = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      setUser(userData);
    } catch (error) {
      console.error("Error decoding token:", error);
      message.error("Invalid token");
    }
  };

  const fetchActivityData = async () => {
    setLoading(true);
    const token = Cookies.get("auth-token");
    if (!token) {
      message.error("Authentication token missing");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("/api/activity", {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in headers
        },
      });

      console.log("API Response:", response.data);
      setActivityData(response.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to load activity data");
    }
    setLoading(false);
  };

  const columns = [
    { title: "User Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Login Time",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) =>
        text ? new Date(text).toLocaleString() : "N/A",
    },
  ];

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h1>Welcome, {user?.name || "Admin"}</h1>
      <p>Role: {user?.role || "Unknown"}</p>
      <Button
        type="primary"
        onClick={() => signOut()}
        style={{ marginBottom: 20 }}
      >
        Logout
      </Button>

      <Table
        dataSource={activityData}
        columns={columns}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default AdminDashboard;
