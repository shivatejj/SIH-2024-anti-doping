import dynamic from "next/dynamic";

const AppLayout = dynamic(() => import("../components/Layout/Layout"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const Dashboard = dynamic(() => import("../components/Dashboard/Dashboard"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const DashboardPage = () => (
  <AppLayout>
    <Dashboard />
  </AppLayout>
);

export default DashboardPage;
