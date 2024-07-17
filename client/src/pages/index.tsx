import { RequiredRoles, RequireAuth, useAppDispatch } from "@shared";
import { lazy, useEffect } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { reauth } from "@features/auth";
import MainPage from "./MainPage";
import { Layout } from "@widgets/Layout";

const AdminPage = lazy(() => import("./AdminPage"));

export const Routing = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (localStorage.getItem("token")) dispatch(reauth());
  }, []);

  return (
    <Routes>
      <Route
        element={
          <Layout>
            <Outlet />
          </Layout>
        }
      >
        <Route path="/" element={<MainPage />} />

        <Route
          element={
            <RequireAuth>
              <Outlet />
            </RequireAuth>
          }
        >
          <Route
            path="/admin"
            element={
              <RequiredRoles roles={["Admin"]}>
                <AdminPage />
              </RequiredRoles>
            }
          />

          <Route
            path="/organization"
            element={
              <RequiredRoles roles={["Organization"]}>
                <></>
              </RequiredRoles>
            }
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={"/"} replace />} />
    </Routes>
  );
};
