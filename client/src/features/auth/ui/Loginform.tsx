import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useAppDispatch,
  useAppSelector,
} from "@shared";
import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { login } from "../api";

type PropsType = {
  onClose: () => void;
  toggleVariant: () => void;
  onError: () => void;
};

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Поле не может быть пустым" })
    .email({ message: "Неверный формат почты" }),
  password: z.string().min(1, { message: "Поле не может быть пустым" }),
});

export const LoginForm: FC<PropsType> = ({
  onClose,
  toggleVariant,
  onError,
}) => {
  const dispatch = useAppDispatch();
  const { isError, isLoading } = useAppSelector((state) => state.auth);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof loginSchema>> = (data) => {
    dispatch(login(data));
    if (!isError) onClose();
    else onError();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-3 flex-col"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Электронная почта</FormLabel>
              <FormControl>
                <Input {...field} type="email" required disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  required
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          Войти
        </Button>
      </form>

      <div className="flex gap-2 justify-center text-sm mt-3 px-2 text-gray-500">
        <div>Нет аккаунта?</div>
        <div onClick={toggleVariant} className="underline cursor-pointer">
          Создать аккаунт
        </div>
      </div>
    </Form>
  );
};
