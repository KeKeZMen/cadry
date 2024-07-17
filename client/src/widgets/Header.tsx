import { UserProfile } from "@entities/user";
import { LogoutButton, AuthButton } from "@features/auth";
import { useAppSelector, useWindowSize } from "@shared";
import { Nav } from "./Nav";
import { Menu } from "./Menu";

export const Header = () => {
  const { isAuth } = useAppSelector((state) => state.auth);
  const { width } = useWindowSize();

  return (
    <header className="flex justify-between items-center py-3">
      <div className="container">
        <div className="flex justify-end gap-3 md:gap-0 md:justify-between items-center md:flex-row-reverse">
          {isAuth ? (
            <UserProfile logoutButton={<LogoutButton />} />
          ) : (
            <AuthButton />
          )}
          {width >= 768 ? <Nav /> : <Menu />}
        </div>
      </div>
    </header>
  );
};
