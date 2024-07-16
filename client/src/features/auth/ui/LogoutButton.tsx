import { useAppDispatch } from "@shared";
import { useCallback } from "react";
import { logout } from "../api";

export const LogoutButton = () => {
  const dispatch = useAppDispatch();
  const handleLogout = useCallback(() => dispatch(logout()), []);

  return <button onClick={handleLogout}>Выйти</button>;
};
