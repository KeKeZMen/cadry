import { useAppSelector } from "@shared";
import { NavLink } from "react-router-dom";

const links = [
  {
    label: "Главная",
    path: "/",
    roles: [],
  },
  {
    label: "Администрирование",
    path: "/admin",
    roles: ["Admin"],
  },
];

export const Nav = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <nav className="">
      {links
        .filter((link) => {
          if (link.roles.length === 0) return true;
          if (link.roles.includes(user.role)) return true;
        })
        .map((link, i) => (
          <NavLink to={link.path} key={i}>
            {link.label}
          </NavLink>
        ))}
    </nav>
  );
};
