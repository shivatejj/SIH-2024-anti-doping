import dynamic from "next/dynamic";

const AppLayout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const AdminDashboard = dynamic(() => import("@/components/AdminDashboard/AdminDashboard"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const AdminDashboardPage = () => (
  <AppLayout>
    <AdminDashboard />
  </AppLayout>
)

export default dynamic(
  () => import("../components/system/withAuth").then((mod) => mod.withAuth(AdminDashboardPage, ["admin"])),
  { ssr: false }
);