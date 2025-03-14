import dynamic from "next/dynamic";

const AppLayout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const LeaderBoard = dynamic(
  () => import("@/components/LeaderBoard/LeaderBoard"),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

const LeaderBoardPage = () => {
  return (
    <AppLayout>
      <LeaderBoard />
    </AppLayout>
  );
};

export default dynamic(
  () =>
    import("../components/system/withAuth").then((mod) =>
      mod.withAuth(LeaderBoardPage, ["user", "admin"])
    ),
  { ssr: false }
);
