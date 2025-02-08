import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import AppLayout from "../components/Layout/Layout";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();

  // Pages that should NOT have the layout
  const noLayoutPages = ["/", "/login", "/register"];

  const isNoLayoutPage = noLayoutPages.includes(router.pathname);

  return isNoLayoutPage ? (
    <Component {...pageProps} />
  ) : (
    <AppLayout>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </AppLayout>
  );
}

export default MyApp;
