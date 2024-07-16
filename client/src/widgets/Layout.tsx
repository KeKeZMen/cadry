import { FC, ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Toaster } from "@shared";

type PropsType = {
  children: ReactNode;
};

export const Layout: FC<PropsType> = ({ children }) => {
  return (
    <>
      <Toaster />
      <Header />
      {children}
      <Footer />
    </>
  );
};
