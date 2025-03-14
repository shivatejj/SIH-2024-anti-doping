import { Layout, Menu, Dropdown } from "antd";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { UserOutlined } from "@ant-design/icons";
import styles from "./Layout.module.css";

const { Header, Content, Footer } = Layout;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { data: session } = useSession();

  const menuItems = [
    { key: "/home", label: "Home" },
    { key: "/game", label: "Fun-Game" },
    { key: "/learning", label: "Learning" },
    { key: "/leaderboard", label: "LeaderBoard" },
    { key: "/addquiz", label: "Add Quiz" },
  ];

  const currentTab =
    menuItems.find((item) => router.pathname.startsWith(item.key))?.key ||
    "/home";

  const profileMenu = (
    <Menu>
      <Menu.Item key="profile" onClick={() => router.push("/profile")}>
        Profile
      </Menu.Item>
      <Menu.Item
        key="logout"
        onClick={() => signOut({ callbackUrl: "/login" })}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout className={styles.layout}>
      {/* Header Section */}
      <Header className={styles.header}>
        <div className={styles.logo} onClick={() => router.push("/home")}>
          Anti-Doping Education
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[currentTab]} // 🔹 Dynamically highlights current tab
          className={styles.menu}
          style={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            overflow: "visible",
            whiteSpace: "nowrap",
          }}
        >
          {menuItems.map((item) => (
            <Menu.Item key={item.key} onClick={() => router.push(item.key)}>
              {item.label}
            </Menu.Item>
          ))}
        </Menu>

        {/* Profile Dropdown */}
        {session && (
          <Dropdown overlay={profileMenu} trigger={["click"]}>
            <div className={styles.profile} style={{ cursor: "pointer" }}>
              <UserOutlined
                style={{ fontSize: "18px", color: "white", marginRight: "8px" }}
              />
              <span style={{ color: "white" }}>{session.user.name}</span>
            </div>
          </Dropdown>
        )}
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
