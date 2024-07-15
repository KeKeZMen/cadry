import { Routing } from "@pages";
import { withProviders } from "./providers";

import { useEffect } from "react";
import { useAppDispatch } from "@shared";
import { reauth } from "@features/auth";

import "./index.css";

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (localStorage.getItem("token")) dispatch(reauth());
  }, []);

  return <Routing />;
};

export default withProviders(App);
