import { z } from "zod";

export const createSchema = z
  .object({
    name: z.string().min(1, { message: "Поле не может быть пустым" }),
    phoneNumber: z
      .string()
      .min(11, { message: "Неверный формат номера телефона" }),
    inn: z
      .string()
      .min(10, { message: "ИНН не может быть короче 10 символов" })
      .max(12, { message: "Инн не может быть длиннее 12 символов" }),
    email: z
      .string()
      .min(1, { message: "Поле не может быть пустым" })
      .email({ message: "Неверный формат почты" }),
    password: z
      .string()
      .min(6, { message: "Поле не может короче 6 символов" })
      .max(12, { message: "Поле не может быть длиннее 12 символов" }),
    address: z.string().min(1, { message: "Поле не может быть пустым" }),
    web: z.optional(z.string()),
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
