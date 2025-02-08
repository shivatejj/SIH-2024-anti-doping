import dynamic from "next/dynamic";

const Register = dynamic(() => import("../components/Register/Register"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const RegisterPage = () => <Register />;

export default RegisterPage;
