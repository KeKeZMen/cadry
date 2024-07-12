import { makeStore } from "@app/store";
import { Provider } from "react-redux";

const store = makeStore();

export const withStore = (component: () => React.ReactNode) => () =>
  <Provider store={store}>{component()}</Provider>;
