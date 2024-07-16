import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  useAppSelector,
  useToast,
} from "@shared";
import { useCallback, useState } from "react";
import { RegisterForm } from "./RegisterForm";
import { LoginForm } from "./LoginForm";

type VariantsType = "LOGIN" | "REGISTER";

export const LoginButton = () => {
  const { toast } = useToast();

  const [variant, setVariant] = useState<VariantsType>("LOGIN");
  const handleVariant = useCallback(
    () => setVariant((prev) => (prev === "LOGIN" ? "REGISTER" : "LOGIN")),
    []
  );

  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const handleModal = useCallback(() => setIsOpenedModal((prev) => !prev), []);

  const { errorMessage } = useAppSelector((state) => state.auth);
  const onError = useCallback(() => {
    const { dismiss } = toast({
      title: "Ошибка",
      variant: "destructive",
      description: errorMessage,
    });

    setTimeout(() => {
      dismiss();
    }, 3000);
  }, [errorMessage]);

  return (
    <>
      <Button variant="ghost" onClick={handleModal}>
        Войти
      </Button>

      <Dialog open={isOpenedModal} onOpenChange={handleModal}>
        <DialogContent>
          <DialogTitle>
            {variant === "LOGIN" ? "Войти" : "Зарегистрироваться"}
          </DialogTitle>
          {variant === "LOGIN" ? (
            <LoginForm
              onClose={handleModal}
              toggleVariant={handleVariant}
              onError={onError}
            />
          ) : (
            <RegisterForm
              onClose={handleModal}
              toggleVariant={handleVariant}
              onError={onError}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
