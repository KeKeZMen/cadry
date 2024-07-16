import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/reduxHooks";

type PropsType = {
  children: JSX.Element;
};

export const RequireAuth = ({ children }: PropsType) => {
  const { isAuth } = useAppSelector((state) => state.auth);

  if (!isAuth) return <Navigate to={"/"} replace={true} />;

  return children;
};
