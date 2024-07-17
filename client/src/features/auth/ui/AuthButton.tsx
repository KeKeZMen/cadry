import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  useAppDispatch,
  useAppSelector,
  useToast,
} from "@shared";
import { useCallback, useEffect, useState } from "react";
import { RegisterForm } from "./RegisterForm";
import { LoginForm } from "./LoginForm";
import { resetError } from "../model";

type VariantsType = "LOGIN" | "REGISTER";

export const AuthButton = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const [variant, setVariant] = useState<VariantsType>("LOGIN");
  const handleVariant = useCallback(
    () => setVariant((prev) => (prev === "LOGIN" ? "REGISTER" : "LOGIN")),
    []
  );

  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const handleModal = useCallback(() => setIsOpenedModal((prev) => !prev), []);

  const { errorMessage, isAuth, isError } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (errorMessage && !isAuth) {
      const { dismiss } = toast({
        title: "Ошибка",
        variant: "destructive",
        description: errorMessage,
      });

      setTimeout(() => {
        dispatch(resetError());
        dismiss();
      }, 3000);
    }

    if (isAuth && !isError) handleModal();
  }, [errorMessage, isAuth]);

  return (
    <>
      <Button variant="ghost" onClick={handleModal}>
        Войти
      </Button>

      <Dialog open={isOpenedModal} onOpenChange={handleModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {variant === "LOGIN" ? "Войти" : "Зарегистрироваться"}
            </DialogTitle>
            <DialogDescription />
          </DialogHeader>
          {variant === "LOGIN" ? (
            <LoginForm toggleVariant={handleVariant} />
          ) : (
            <RegisterForm toggleVariant={handleVariant} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
