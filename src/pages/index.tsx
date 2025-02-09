import dynamic from "next/dynamic";

const Login = dynamic(() => import("../components/Scroll/Scroll"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function Home() {
  return <Login />;
}
