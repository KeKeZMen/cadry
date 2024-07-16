import { UserProfile } from "@entities/user";
import { LogoutButton, LoginButton } from "@features/auth";
import { useAppSelector } from "@shared";
import { Link } from "react-router-dom";

export const Header = () => {
  const { isAuth } = useAppSelector((state) => state.auth);

  return (
    <header className="flex justify-between items-center py-3">
      <div className="container">
        <div className="flex justify-between items-center">
          <Link to={"/"}>Главная</Link>

          {isAuth ? (
            <UserProfile logoutButton={<LogoutButton />} />
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </header>
  );
};
