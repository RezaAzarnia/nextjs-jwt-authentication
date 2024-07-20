import { z } from "zod";

export const registerSchema = z
  .object({
    username: z
      .string()
      .trim()
      .nonempty("please enter your username")
      .min(4, { message: "username at least should be 4 character" })
      .max(20, { message: "username can't be more than 20 caharacter" }),
    email: z
      .string()
      .trim()
      .nonempty("please enter your email")
      .email("please enter your email correctly"),

    password: z
      .string()
      .trim()
      .nonempty("please enter your password")
      .min(8, { message: "password should be at least 8 charachter" })
      .max(32, { message: "password can't be more than 32 characters" }),

    confirm: z.string().trim().nonempty("please enter your confirm password"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .nonempty("please enter your email")
    .email("please enter your email correctly"),

  password: z.string().trim().nonempty("please enter your password"),
});
