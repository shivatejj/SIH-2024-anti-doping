import dynamic from "next/dynamic";

const Dashboard = dynamic(
  () => import("../components/Dashboard/Dashboard"),
  { ssr: false, loading: () => <p>Loading...</p> }
)

const DashboardPage = () => <Dashboard />

export default DashboardPage;