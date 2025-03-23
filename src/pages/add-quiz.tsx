import dynamic from "next/dynamic";

const AppLayout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const AddQuiz = dynamic(() => import("@/components/AddQuiz/AddQuiz"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const AddQuizPage = () => (
  <AppLayout>
    <AddQuiz />
  </AppLayout>
);

export default dynamic(
  () =>
    import("../components/system/withAuth").then((mod) =>
      mod.withAuth(AddQuizPage, ["admin"])
    ),
  { ssr: false }
);
