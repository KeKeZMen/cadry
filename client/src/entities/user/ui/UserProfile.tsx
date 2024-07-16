import {
  Avatar,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  useAppSelector,
} from "@shared";
import { FC } from "react";

type PropsType = {
  logoutButton?: JSX.Element;
};

export const UserProfile: FC<PropsType> = ({ logoutButton }) => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex flex-col items-center md:p-3">
        <Avatar>
          <AvatarImage
            src={`https://avatar.iran.liara.run/public/${
              Math.floor(Math.random() * 10) + 1
            }`}
          />
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="z-[101]">
        <DropdownMenuLabel className="font-normal p-2">
          <div className="flex flex-col space-y-1">
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="flex justify-start p-2">
          {logoutButton}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
