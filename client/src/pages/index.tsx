import { reauth } from "@features/auth";
import { useAppDispatch } from "@shared";
import { lazy, useEffect } from "react";
import { Route, Routes } from "react-router-dom";

const Mainpage = lazy(() => import("./Mainpage"));

export const Routing = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (localStorage.getItem("token")) dispatch(reauth());
  }, []);
  
  return (
    <Routes>
      <Route path="/" element={<Mainpage />} />
    </Routes>
  );
};
