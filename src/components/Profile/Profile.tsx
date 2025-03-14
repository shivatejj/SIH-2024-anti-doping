import { Card } from "antd";
import { useSession } from "next-auth/react";
import AppLayout from "../Layout/Layout"; // Ensure layout is wrapped
import styles from "./Profile.module.css";

// Mock Data: Replace with real API/database data
const userSports = [
  { sport: "Swimming", level: "Hard", score: 85 },
  { sport: "Cycling", level: "Medium", score: 75 },
  { sport: "Wrestling", level: "Easy", score: 60 },
  { sport: "Badminton", level: "Hard", score: 90 },
];

const Profile: React.FC = () => {
  const { data: session } = useSession();

  if (!session) return <p>Loading...</p>;

  return (
    <AppLayout>
      {" "}
      {/* Wrap content with Layout */}
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
                    <td>{sport.sport}</td>
                    <td>{sport.level}</td>
                    <td>{sport.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className={styles.profileInfo}>No sports played yet.</p>
          )}
        </Card>
      </div>
    </AppLayout>
  );
};

export default Profile;
