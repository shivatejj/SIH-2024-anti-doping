import { FC, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Spin, Table } from "antd";
import styles from "./AdminDashboard.module.css";
import { useSession } from "next-auth/react";
import moment from "moment";

const AdminDashboard: FC = () => {
  const { user } = useAuth();
  const { data: session } = useSession();
  const [activities, setActivities] = useState({
    success: false,
    data: [],
    pagination: {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
    },
  });
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/activity?page=${pageIndex}&limit=${pageSize}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((json) => setActivities(json))
      .catch((error) => {
        console.error("Error fetching activity:", error);
      })
      .finally(() => setLoading(false));
  }, [session?.user?.accessToken, pageIndex, pageSize]);

  const onChangePageIndex = (pageIndex: number) => {
    setPageIndex(pageIndex);
  };

  const onPageSizeChange = (currentPage: number, pageSize: number) => {
    setPageSize(pageSize);
  };

  return (
    <div className={styles.container}>
      <Spin spinning={loading} fullscreen />
      <h1 className={styles.title}>👑 Welcome, {user?.name}! 🚀</h1>
      <div className={styles.tableContainer}>
        <Table
          rowKey="_id"
          className={styles.table}
          dataSource={activities?.data}
          bordered
          columns={[
            {
              title: "👤 Name",
              dataIndex: "name",
              key: "name",
            },
            {
              title: "📧 Email",
              dataIndex: "email",
              key: "email",
            },
            {
              title: "⏰ Login Time",
              dataIndex: "loginTime",
              key: "loginTime",
              render: (loginTime: string) => (
                <span>{moment(loginTime).format("DD/MM/YYYY hh:mm:ss A")}</span>
              ),
            },
          ]}
          pagination={{
            showSizeChanger: true,
            defaultCurrent: 1,
            defaultPageSize: 10,
            pageSize: pageSize,
            current: pageIndex,
            pageSizeOptions: [10, 20, 50, 100],
            total: activities?.pagination?.total,
            onChange: onChangePageIndex,
            onShowSizeChange: onPageSizeChange,
          }}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
