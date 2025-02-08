import dynamic from "next/dynamic";

const LeaderBoard = dynamic(
  () => import("../components/LeaderBoard/LeaderBoard"),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

const LeaderBoardPage = () => <LeaderBoard />;

export default LeaderBoardPage;
