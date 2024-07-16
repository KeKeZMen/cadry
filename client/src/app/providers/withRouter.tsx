import { Layout } from "@widgets/Layout";
import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";

export const withRouter = (component: () => React.ReactNode) => () =>
  (
    <BrowserRouter>
      <Layout>
        <Suspense>{component()}</Suspense>
      </Layout>
    </BrowserRouter>
  );
