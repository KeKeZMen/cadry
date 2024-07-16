import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/reduxHooks";
import { FC } from "react";

type PropsType = {
  roles: string[];
  children: JSX.Element;
};

export const RequiredRoles: FC<PropsType> = ({ roles, children }) => {
  const { user } = useAppSelector((state) => state.auth);

  if (!roles.includes(user.role)) return <Navigate to={"/"} replace={true} />;

  return children;
};
