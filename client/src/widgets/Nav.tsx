import { Separator, useAppSelector } from "@shared";
import clsx from "clsx";
import { FC } from "react";
import { NavLink } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";

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

type PropsType = {
  onClick?: () => void;
};

export const Nav: FC<PropsType> = ({ onClick }) => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <nav className="flex gap-3 flex-col md:flex-row">
      {links
        .filter((link) => {
          if (link.roles.length === 0) return true;
          if (user.role === "Admin") return true;
          if (link.roles.includes(user.role)) return true;
        })
        .map((link, i) => (
          <Fragment key={i}>
            <NavLink
              to={link.path}
              onClick={() => onClick?.()}
              className={({ isActive }) =>
                clsx(
                  "text-2xl w-full md:w-max md:text-xl",
                  isActive && "text-blue-700"
                )
              }
            >
              {link.label}
            </NavLink>
            <Separator className="md:hidden" />
          </Fragment>
        ))}
    </nav>
  );
};
