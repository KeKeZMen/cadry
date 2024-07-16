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
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { registerOrganization } from "../api";
import { FC } from "react";

type PropsType = {
  toggleVariant: () => void;
};

const registerSchema = z
  .object({
    inn: z
      .string()
      .min(10, { message: "ИНН не может быть короче 10 символов" }),
    email: z
      .string()
      .min(1, { message: "Поле не может быть пустым" })
      .email({ message: "Неверный формат почты" }),
    password: z.string().min(1, { message: "Поле не может быть пустым" }),
    passwordRepeat: z.string().min(1, { message: "Поле не может быть пустым" }),
  })
  .superRefine(({ password, passwordRepeat }, ctx) => {
    if (password !== passwordRepeat) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        fatal: true,
        message: "Пароли не совпадают",
        path: ["passwordRepeat"],
      });
    }
  });

export const RegisterForm: FC<PropsType> = ({ toggleVariant }) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      inn: "",
      email: "",
      password: "",
      passwordRepeat: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof registerSchema>> = (data) =>
    dispatch(registerOrganization(data));

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-3 flex-col"
      >
        <FormField
          control={form.control}
          name="inn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ИНН</FormLabel>
              <FormControl>
                <Input {...field} type="text" required disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <FormField
          control={form.control}
          name="passwordRepeat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Повторите пароль</FormLabel>
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
          Зарегистрироваться
        </Button>
      </form>

      <div className="flex gap-2 justify-center text-sm mt-3 px-2 text-gray-500">
        <div>Уже есть аккаунт?</div>
        <div onClick={toggleVariant} className="underline cursor-pointer">
          Войти
        </div>
      </div>
    </Form>
  );
};
