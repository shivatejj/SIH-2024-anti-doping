import dynamic from "next/dynamic";

const Scroll = dynamic(() => import("../components/Scroll/Scroll"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const ScrollPage = () => <Scroll />;

export default ScrollPage;
