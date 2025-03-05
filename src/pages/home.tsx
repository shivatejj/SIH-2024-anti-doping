import dynamic from "next/dynamic";

const AppLayout = dynamic(() => import("../components/Layout/Layout"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const Home = dynamic(() => import("../components/Home/Home"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const HomePage = () => (
  <AppLayout>
    <Home />
  </AppLayout>
);

export default dynamic(
  () =>
    import("../components/system/withAuth").then((mod) =>
      mod.withAuth(HomePage, ["user"])
    ),
  { ssr: false }
);
