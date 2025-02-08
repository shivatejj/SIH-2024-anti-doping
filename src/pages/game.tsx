import dynamic from "next/dynamic";

const Game = dynamic(() => import("../components/Game/Game"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const GamePage = () => <Game />;

export default GamePage;
