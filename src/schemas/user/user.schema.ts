import { basicError, greaterThanError, stringLenghtError } from "../global";
import { z } from "zod";

export const fullUserSchema = z.object({
    idUser: z
        .number(basicError("id_user", "number"))
        .positive(greaterThanError("id_user", 0)),
    email: z
        .string(basicError("email", "string"))
        .email("email is not valid"),
    password: z
        .string(basicError("password", "string"))
        .min(5, stringLenghtError("password", 5))
});

export const newUserSchema = fullUserSchema.omit({ idUser: true });
export const userResponseSchema = fullUserSchema.omit({ password: true });

export const updateUserSchema = newUserSchema.partial().refine(
    ({ email, password }) => email || password, "at least one field is expected"
);