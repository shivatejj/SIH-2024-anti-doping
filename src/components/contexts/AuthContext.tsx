import { createContext, useEffect, useState, ReactNode, FC } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { message } from "antd";
import { useSession } from "next-auth/react";

interface User {
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface IAuthProvider {
  children: ReactNode
}

const AuthProvider: FC<IAuthProvider> = (props: IAuthProvider) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("/api/auth/me", { withCredentials: true });
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      setUser(null);
      message.success("Logged out successfully!");
      router.push("/login");
    } catch {
      message.error("Failed to log out. Try again!");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const user = session?.user;

  return { user, isLoading };
};

export default AuthProvider;