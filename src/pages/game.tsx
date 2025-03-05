import dynamic from "next/dynamic";

const AppLayout = dynamic(() => import("../components/Layout/Layout"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const Game = dynamic(() => import("../components/Game/Game"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const GamePage = () => (
  <AppLayout>
    <Game />
  </AppLayout>
);

export default dynamic(
  () =>
    import("../components/system/withAuth").then((mod) =>
      mod.withAuth(GamePage, ["user"])
    ),
  { ssr: false }
);
