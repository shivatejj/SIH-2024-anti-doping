import { Layout, Menu } from "antd";
import { useRouter } from "next/router";
import styles from "./Layout.module.css";
import { signOut, useSession } from "next-auth/react";

const { Header, Content, Footer } = Layout;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <Layout className={styles.layout}>
      {/* Header Section */}
      <Header className={styles.header}>
        <div className={styles.logo} onClick={() => router.push("/")}>
          Anti-Doping Education
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          className={styles.menu}
          style={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            overflow: "visible",
            whiteSpace: "nowrap",
          }}
        >
          <Menu.Item key="1" onClick={() => router.push("/home")}>
            Home
          </Menu.Item>
          <Menu.Item key="2" onClick={() => router.push("/game")}>
            Fun-Game
          </Menu.Item>
          <Menu.Item key="3" onClick={() => router.push("/learning")}>
            Learning
          </Menu.Item>
          <Menu.Item key="4" onClick={() => router.push("/leaderboard")}>
            LeaderBoard
          </Menu.Item>
          {session ? (
            <Menu.Item key="5" onClick={() => signOut({ callbackUrl: "/" })}>
              Logout
            </Menu.Item>
          ) : (
            <Menu.Item key="6" onClick={() => router.push("/login")}>
              Login
            </Menu.Item>
          )}
        </Menu>
      </Header>

      {/* Content Section */}
      <Content className={styles.content}>{children}</Content>

      {/* Footer Section */}
      <Footer className={styles.footer}>
        © 2025 My App. All rights reserved.
      </Footer>
    </Layout>
  );
};

export default AppLayout;
