import React, { useState } from "react";
import { Table, Tabs, Pagination } from "antd";
import { CrownOutlined } from "@ant-design/icons";
import styles from "./LeaderBoard.module.css";

const { TabPane } = Tabs;

const generateData = (sport: string, page: number) => {
  return Array.from({ length: 10 }, (_, index) => ({
    key: index + 1,
    rank: index + 1 + (page - 1) * 10,
    name: `${sport} Player ${index + 1 + (page - 1) * 10}`,
    score: Math.floor(Math.random() * 1000) + 500,
  }));
};

const LeaderBoard = () => {
  const [activeTab, setActiveTab] = useState("Swimming");
  const [page, setPage] = useState(1);
  const [data, setData] = useState(generateData(activeTab, page));

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setPage(1);
    setData(generateData(key, 1));
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setData(generateData(activeTab, newPage));
  };

  // Leaderboard columns
  const columns = [
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
      render: (rank: number) =>
        rank === 1 ? (
          <span className={styles.gold}>
            <CrownOutlined /> {rank}
          </span>
        ) : rank === 2 ? (
          <span className={styles.silver}>
            <CrownOutlined /> {rank}
          </span>
        ) : rank === 3 ? (
          <span className={styles.bronze}>
            <CrownOutlined /> {rank}
          </span>
        ) : (
          rank
        ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sorter: (a: any, b: any) => a.score - b.score,
    },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>🏆 Leaderboard</h1>
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        className={styles.tabs}
      >
        {["Swimming", "Cycling", "Wrestling", "Badminton"].map((sport) => (
          <TabPane tab={sport} key={sport}>
            <div className={styles.leaderboard}>
              <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                className={styles.table}
              />
              <Pagination
                current={page}
                total={100}
                pageSize={10}
                onChange={handlePageChange}
                className={styles.pagination}
              />
            </div>
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default LeaderBoard;
