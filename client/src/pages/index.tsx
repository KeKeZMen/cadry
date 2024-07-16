import { RequiredRoles, RequireAuth, useAppDispatch } from "@shared";
import { lazy, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { reauth } from "@features/auth";
import MainPage from "./MainPage";

const AdminPage = lazy(() => import("./AdminPage"));

export const Routing = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (localStorage.getItem("token")) dispatch(reauth());
  }, []);

  return (
    <Routes>
      <Route path="/" element={<MainPage />} />

      <Route
        path="/admin"
        element={
          <RequireAuth>
            <RequiredRoles roles={["Admin"]}>
              <AdminPage />
            </RequiredRoles>
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to={"/"} replace />} />
    </Routes>
  );
};
