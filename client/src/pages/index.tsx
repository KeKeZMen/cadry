import { reauth } from "@features/auth";
import { useAppDispatch } from "@shared";
import { lazy, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Mainpage from "./Mainpage";

export const Routing = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (localStorage.getItem("token")) dispatch(reauth());
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Mainpage />} />

      <Route path="*" element={<Navigate to={"/"} replace />} />
    </Routes>
  );
};
