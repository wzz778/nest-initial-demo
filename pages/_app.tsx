import "normalize.css";
import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import Layout from "@/components/C-user/layout";
import warpper from "../store";
import { Provider } from "react-redux";

export default function App({ Component, ...rest }: AppProps) {
  const { store, props } = warpper.useWrappedStore(rest);
  return (
    <div>
      <Provider store={store}>
        <Layout>
          <Component {...props.pageProps} />
        </Layout>
      </Provider>
    </div>
  );
}
