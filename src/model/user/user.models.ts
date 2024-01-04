import { fullUserSchema, newUserSchema, updateUserSchema, userResponseSchema } from "../../schemas";
import { z } from "zod";

export type User = z.infer<typeof fullUserSchema>;

export type NewUser = z.infer<typeof newUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>

export type ResponseUser = z.infer<typeof userResponseSchema>;

export interface ValidateUserResponse{
    token: string;
    user: ResponseUser
}