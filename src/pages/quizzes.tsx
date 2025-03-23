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

const Quizzes = dynamic(() => import("@/components/Quizzes/Quizzes"), {
  ssr: false,
  loading: () => <Skeleton />,
});

const QuizzesPage = () => (
  <AppLayout>
    <Quizzes />
  </AppLayout>
)

export default dynamic(
  () => import("../components/system/withAuth").then((mod) => mod.withAuth(QuizzesPage, ["admin"])),
  { ssr: false }
);