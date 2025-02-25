import dynamic from "next/dynamic";

const Unauthorized = dynamic(() => import("@/components/Unauthorized/Unauthorized"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

const UnauthorizedPage = () => (
  <Unauthorized />
)

export default UnauthorizedPage;