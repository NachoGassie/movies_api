import { ResponseCreated, ResponseHandler, ResponseOk } from "@httpResponse";
import * as authService from "@service/auth"; 
import { NewUser, ResponseUser, ValidateUserResponse } from "@model";
import { Request, Response } from "express";
import { parseToNumber } from "@utils";

export const validateUser = async (req: Request, res: Response) => {
    const body = req.body as unknown as NewUser;

    const { user, token }: ValidateUserResponse = await authService.validateUser(body);
    return ResponseHandler(res, new ResponseOk({
        user, 
        token
    }));
}
export const createUser = async (req: Request, res: Response) => {
    const body = req.body as unknown as NewUser;

    const user: ResponseUser = await authService.createUser(body);
    return ResponseHandler(res, new ResponseCreated(
        user
    ));
}
export const updateUser = async (req: Request, res: Response) => {
    const idUser = parseToNumber(req.params.userId);
    const body = req.body as unknown as NewUser;

    const updatedId: number = await authService.updateUser(idUser, body);
    return ResponseHandler(res, new ResponseOk({
        id_user: updatedId
    }));
}
export const deleteUser = async (req: Request, res: Response) => {
    const idUser = parseToNumber(req.params.userId);
    
    const updatedId: number = await authService.deleteUser(idUser);
    return ResponseHandler(res, new ResponseOk({
        id_user: updatedId
    }));
}
