import { UserProfile } from "@entities/user";
import { LogoutButton, LoginButton } from "@features/auth";
import { useAppSelector } from "@shared";
import { Nav } from "./Nav";

export const Header = () => {
  const { isAuth } = useAppSelector((state) => state.auth);

  return (
    <header className="flex justify-between items-center py-3">
      <div className="container">
        <div className="flex justify-between items-center">
          <Nav />

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
