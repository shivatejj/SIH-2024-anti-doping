import dynamic from "next/dynamic";

const Login = dynamic(
  () => import("../components/Login/Login"),
  { ssr: false, loading: () => <p>Loading...</p> }
)


export default function Home() {
  return (
    <Login />
  );
}
