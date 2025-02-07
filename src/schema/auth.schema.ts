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