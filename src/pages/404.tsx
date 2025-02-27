import dynamic from "next/dynamic";

const Skeleton = dynamic(
  () => import("antd").then((mod) => mod.Skeleton),
  {
    ssr: false,
  }
)

const NotFound = dynamic(() => import("@/components/404/404"), {
  ssr: false,
  loading: () => <Skeleton />,
});

const NotFoundPage = () => <NotFound />

export default NotFoundPage;