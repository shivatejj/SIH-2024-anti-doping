import dynamic from "next/dynamic";

const Skeleton = dynamic(
  () => import("antd").then((mod) => mod.Skeleton),
  {
    ssr: false,
  }
);

const AppLayout = dynamic(() => import("../components/Layout/Layout"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const LearningContent = dynamic(
  () => import("@/components/LearningContent/LearningContent"),
  {
    ssr: false,
    loading: () => <Skeleton />,
  }
);

const LearningContentPage: React.FC = () => (
  <AppLayout>
    <LearningContent />
  </AppLayout>
);

export default dynamic(
  () =>
    import("../components/system/withAuth").then((mod) =>
      mod.withAuth(LearningContentPage, ["user"])
    ),
  { ssr: false }
);
