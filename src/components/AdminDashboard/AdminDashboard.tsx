import { FC, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button, Table } from "antd";
import styles from "./AdminDashboard.module.css"; // ✅ Connected CSS
import { signOut, useSession } from "next-auth/react";
import moment from "moment";

const AdminDashboard: FC = () => {
  const { user } = useAuth();
  const { data: session } = useSession();
  const [activities, setActivities] = useState([]);

  const getActivity = async () => {
    try {
      const response = await fetch("/api/activity", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch activities");
      const result = await response.json();
      setActivities(result.data);
    } catch (error) {
      console.error("Error fetching activity:", error);
    }
  };

  useEffect(() => {
    if (session) {
      getActivity();
    }

    const interval = setInterval(getActivity, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>👑 Welcome, {user?.name}! 🚀</h1>
      <p className={styles.role}>
        Role: <span>{user?.role}</span>
      </p>

      <div className={styles.tableContainer}>
        <Table
          className={styles.table}
          dataSource={activities}
          bordered
          columns={[
            {
              title: "👤 Name",
              dataIndex: "name",
              key: "name",
              render: (text) => <span className={styles.name}>{text}</span>,
            },
            {
              title: "📧 Email",
              dataIndex: "email",
              key: "email",
              render: (text) => <span className={styles.email}>{text}</span>,
            },
            {
              title: "⏰ Login Time",
              dataIndex: "loginTime",
              key: "loginTime",
              render: (text: string) =>
                text ? (
                  <span className={styles.loginTime}>
                    {moment(text).format("DD/MM/YYYY hh:mm:ss A")}
                  </span>
                ) : (
                  <span className={styles.noData}>No Data</span>
                ),
            },
          ]}
          rowKey="_id"
        />
      </div>

      <Button className={styles.button} onClick={() => signOut()}>
        🚪 Logout
      </Button>
    </div>
  );
};

export default AdminDashboard;
