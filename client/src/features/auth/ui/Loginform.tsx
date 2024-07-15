import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "@shared";
import { login } from "../api";

const loginSchema = z.object({
  email: z.string().email({ message: "Неверный формат почты" }),
  password: z.string(),
});

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const { isError, errorMessage, isLoading } = useAppSelector(
    (state) => state.auth
  );
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof loginSchema>> = (data) =>
    dispatch(login(data));

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="email"
        {...register("email")}
        placeholder="Email"
        disabled={isLoading}
      />
      {errors.email && <span>{errors.email.message}</span>}

      <input
        type="password"
        {...register("password")}
        placeholder="Пароль"
        disabled={isLoading}
      />

      <button disabled={isLoading} type="submit">
        Войти
      </button>

      {isError && <p>{errorMessage}</p>}
    </form>
  );
};
