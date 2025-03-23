import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { jwtDecode } from "jwt-decode";

const useAutoLogout = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.accessToken) return;

    try {
      const decoded: { exp: number } = jwtDecode(session.user.accessToken);
      const expiryTime = decoded.exp * 1000;
      const currentTime = Date.now();
      const timeRemaining = expiryTime - currentTime;

      if (timeRemaining <= 0) {
        signOut();
      } else {
        const timer = setTimeout(() => {
          signOut();
        }, timeRemaining);

        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      signOut();
    }
  }, [session?.user?.accessToken]);
};

export default useAutoLogout;