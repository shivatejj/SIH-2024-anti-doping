import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { Button } from "antd";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <p>Loading...</p>;
  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h1>Welcome, {session.user?.name}</h1>
      <Button type="primary" onClick={() => signOut()}>
        Logout
      </Button>
    </div>
  );
}
