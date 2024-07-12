import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const Mainpage = lazy(() => import("./Mainpage"));

export const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<Mainpage />} />
    </Routes>
  );
};
