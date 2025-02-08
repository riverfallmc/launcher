import { z } from "zod";

export const authSchema = z.object({
  username: z.string()
    .min(4, "Минимальная длина никнейма 4 символа")
    .max(16, "Максимальная длина никнейма 16 символа"),
  password: z.string()
    .min(8, "Минимальная длина пароля 8 символа")
    .max(32, "Максимальная длина пароля 32 символа"),
  autoLogin: z.preprocess((val) => val === "true" || val === true, z.boolean()),
});

export type authSchemaData = z.infer<typeof authSchema>;

export const OTPSchema = z.object({
  code: z.string()
    .min(6, "OTP должен быть длинной в 6 символов")
    .max(6, "OTP должен быть длинной в 6 символов")
});

export type OTPSchemaData = z.infer<typeof OTPSchema>;