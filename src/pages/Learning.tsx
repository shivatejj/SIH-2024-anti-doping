import dynamic from "next/dynamic";

const Learning = dynamic(() => import("../components/Learning/Learning"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const LearningPage = () => <Learning />;

export default LearningPage;
