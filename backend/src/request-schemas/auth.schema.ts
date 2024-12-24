import { z } from "zod";

export const registerUser = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .max(100)
    .regex(
      /^(?=.*[a-zA-Z0-9])(?=.*[@#$%&^*|])[a-zA-Z0-9@#$%&^*|]{8,}$/,
      "Password too weak"
    ),
  redirectPath: z.string().regex(/^\/([^/])+/), // /path1/path2
});
