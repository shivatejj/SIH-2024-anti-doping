import { Card, Spin } from "antd";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import AppLayout from "../Layout/Layout";
import styles from "./Profile.module.css";

interface UserSport {
  category: string;
  level: string;
  score: number;
}

const Profile: React.FC = () => {
  const { data: session } = useSession();
  const [userSports, setUserSports] = useState<UserSport[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setLoading(true);
      fetch("/api/stats/userStats", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => setUserSports(data.userStat || []))
        .catch((err) => console.error("Error fetching user stats:", err))
        .finally(() => setLoading(false));
    }
  }, [session?.user]);

  if (!session) return <p>Loading...</p>;

  return (
    <AppLayout>
      <div className={styles.profileContainer}>
        <Card title="User Profile" className={styles.profileCard}>
          <p className={styles.profileInfo}>
            <strong>Name:</strong> {session.user.name}
          </p>
          <p className={styles.profileInfo}>
            <strong>Email:</strong> {session.user.email}
          </p>

          {/* Played Sports with Levels & Scores */}
          <h3 className={styles.sectionTitle}>Played Sports</h3>
          <Spin spinning={loading}>
            {userSports.length > 0 ? (
              <table className={styles.sportsTable}>
                <thead>
                  <tr>
                    <th>Sport</th>
                    <th>Level</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {userSports.map((sport, index) => (
                    <tr key={index}>
                      <td>{sport.category}</td>
                      <td>{sport.level}</td>
                      <td>{sport.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className={styles.profileInfo}>No sports played yet.</p>
            )}
          </Spin>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Profile;
