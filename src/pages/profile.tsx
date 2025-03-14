import dynamic from "next/dynamic";

const AppLayout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const Profile = dynamic(() => import("@/components/Profile/Profile"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ProfilePage = () => {
  return (
    <AppLayout>
      <Profile />
    </AppLayout>
  );
};

export default dynamic(
  () =>
    import("../components/system/withAuth").then((mod) =>
      mod.withAuth(Profile, ["user"])
    ),
  { ssr: false }
);
