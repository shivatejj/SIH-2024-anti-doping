import dynamic from "next/dynamic";

const AppLayout = dynamic(() => import("../components/Layout/Layout"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const Learning = dynamic(() => import("../components/Learning/Learning"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const LearningPage: React.FC = () => (
  <AppLayout>
    <Learning />
  </AppLayout>
);

export default LearningPage;
