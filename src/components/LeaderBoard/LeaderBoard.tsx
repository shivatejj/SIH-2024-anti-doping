"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Table, Select, Spin, Alert } from "antd";
import styles from "./LeaderBoard.module.css";

const { Option } = Select;

const LeaderBoard: React.FC = () => {
  const { data: session } = useSession();
  const [sports, setSports] = useState<string[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>("swimming");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loadingSports, setLoadingSports] = useState(false);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session?.user?.accessToken) return;

    setLoadingSports(true);
    fetch("/api/quiz/categories", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setSports(data.categories || []))
      .catch(() => setError("Failed to fetch sports categories."))
      .finally(() => setLoadingSports(false));
  }, [session?.user?.accessToken]);

  const fetchLeaderboard = (sport: string) => {
    if (!session?.user?.accessToken || !sport) return;

    setLoadingLeaderboard(true);
    setSelectedSport(sport);

    fetch(`/api/stats/list?category=${sport}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("✅ Leaderboard API Response:", data);
        let leaderboardData = data?.result || [];

        if (!Array.isArray(leaderboardData)) {
          console.warn(
            "⚠️ Leaderboard data is not an array! Check API structure."
          );
          leaderboardData = [];
        }

        setLeaderboard(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          leaderboardData.map((item: any, index: number) => ({
            key: index + 1,
            rank: index + 1,
            name: item.userName || "Unknown",
            score: item.score || 0,
          }))
        );
      })
      .catch(() => setError("Failed to fetch leaderboard."))
      .finally(() => setLoadingLeaderboard(false));
  };

  useEffect(() => {
    fetchLeaderboard("swimming");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.accessToken]);

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return <span style={{ fontSize: "24px" }}>🏅</span>;
    } else if (rank === 2) {
      return <span style={{ fontSize: "24px" }}>🥈</span>;
    } else if (rank === 3) {
      return <span style={{ fontSize: "24px" }}>🥉</span>;
    }
    return <span className={styles.normalRank}>{rank}</span>;
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.heading}>Leaderboard</h2>
        <Select
          placeholder="Select a Sport"
          value={selectedSport}
          onChange={fetchLeaderboard}
          size="large"
          className={styles.select}
        >
          {sports.map((sport) => (
            <Option key={sport} value={sport}>
              {sport?.[0].toUpperCase() + sport.slice(1)}
            </Option>
          ))}
        </Select>
      </div>

      <p className={styles.instruction}>
        Select a sport from the dropdown to view its leaderboard rankings.
      </p>

      {error && <Alert message={error} type="error" className={styles.error} />}

      {loadingLeaderboard ? (
        <Spin size="large" />
      ) : leaderboard.length > 0 ? (
        <Table
          dataSource={leaderboard}
          pagination={false}
          columns={[
            {
              title: "Rank",
              dataIndex: "rank",
              key: "rank",
              render: (rank) => getRankBadge(rank),
            },
            { title: "Name", dataIndex: "name", key: "name" },
            { title: "Score", dataIndex: "score", key: "score" },
          ]}
          rowKey="rank"
          className={styles.table}
        />
      ) : (
        <p className={styles.noData}>No leaderboard data available.</p>
      )}
    </div>
  );
};

export default LeaderBoard;
