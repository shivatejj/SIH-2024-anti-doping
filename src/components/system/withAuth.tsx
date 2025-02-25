import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Spin } from "antd";

export const withAuth = <P extends object>(Component: React.ComponentType<P>, allowedRoles: string[]) => {
  return function AuthenticatedComponent(props: P) {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "loading") return <Spin size="large" style={{ display: "block", margin: "50px auto" }} />;
    if (!session) router.replace("/login");
    if (session && !allowedRoles.includes(session.user.role)) return router.replace("/unauthorized");

    return <Component {...props} />;
  };
};