import {
  SheetTrigger,
  Sheet,
  SheetContent,
  SheetTitle,
  SheetHeader,
  Separator,
  SheetDescription,
} from "@shared";
import { Menu as Burger } from "lucide-react";
import { Nav } from "./Nav";
import { useCallback, useState } from "react";

export const Menu = () => {
  const [isOpenedMenu, setIsOpenedMenu] = useState(false);
  const handleToggleMenu = useCallback(
    () => setIsOpenedMenu((prev) => !prev),
    []
  );

  return (
    <Sheet open={isOpenedMenu} onOpenChange={handleToggleMenu}>
      <SheetTrigger>
        <Burger />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="mb-3">
          <SheetTitle>Кадры Подмосковья</SheetTitle>
          <SheetDescription />
        </SheetHeader>
        <Separator className="my-3" />
        <Nav onClick={handleToggleMenu} />
      </SheetContent>
    </Sheet>
  );
};
