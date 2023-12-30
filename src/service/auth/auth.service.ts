import { dbFactory } from "@db";
import { BadRequestError, InternalError, NotFoundError, UnathrorizedError } from "@httpResponse";
import { NewUser, ResponseUser, UpdateUser, User, ValidateUserResponse } from "@model";
import { newUserSchema, updateUserSchema } from "@schemas";
import { SECRET } from "@src/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authDb = dbFactory.mySqlDb.auth;

export const validateUser = async (newUser: NewUser): Promise<ValidateUserResponse> => {
    const { email: reqEmail, password: reqPassword } = await newUserSchema.parseAsync(newUser);

    const user = await authDb.getUserByEmail(reqEmail) as User;
    if (!user) {
        throw new UnathrorizedError("invalid user and/or password");
    }

    const { password: userPassword, ...restOfUser } = user;

    const isValidPassword = await bcrypt.compare(reqPassword, userPassword);
    if (!isValidPassword) {
        throw new UnathrorizedError("invalid user and/or password");
    }

    const token = getToken(user);
    return { 
        user: restOfUser,
        token 
    }
}
export const createUser = async (newUser: NewUser): Promise<ResponseUser> => {
    const parsedUser = await parseUserCreate(newUser);

    const { email } = parsedUser;

    const idUser = await authDb.createOneUser(parsedUser);
    if (!idUser) {
        throw new InternalError("it was not possible to create the user");
    }

    return { idUser, email };
}
export const updateUser = async (id: number, newUser: NewUser): Promise<number> => {
    const idUser = await validateUserId(id);
    const parsedUser = await parseUserUpdate(newUser);

    const affectedRows = await authDb.updateOneUser(parsedUser, idUser);
    if (affectedRows !== 1) {
        throw new InternalError("user with id " + idUser + " could not be updated");
    }

    return idUser;
}
export const deleteUser = async (id: number): Promise<number> => {
    const parsedId = await validateUserId(id);

    const affectedRows = await authDb.deleteOneUser(parsedId);
    if (affectedRows !== 1) {
        throw new InternalError("user with id " + parsedId + " could not be deleted");
    }

    return parsedId;
}

const parseUserCreate = async (user: NewUser): Promise<NewUser> => {
    const { email, password } = newUserSchema.parse(user);

    await verifyEmail(email);
    
    const hashedPassword = await hashPassword(password);
    return { email, password: hashedPassword }
}
const parseUserUpdate = async (user: NewUser): Promise<UpdateUser> => {
    const { email, password } = updateUserSchema.parse(user);

    await verifyEmail(email);

    if (password) {
        const hashedPassword = await hashPassword(password);
        if (email) {
            return { email, password: hashedPassword }
        }
        return { password: hashedPassword };
    }
    return { email };
}

const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword
}
const validateUserId = async (id: number): Promise<number> => {
    const existsUser = await authDb.existsUser(id);
    if (!existsUser) {
        throw new NotFoundError("user with id " + id + " does not exist");
    }

    return id;
}
const verifyEmail = async (email: string | undefined): Promise<void> => {
    if (!email) return;
    const isAlreadyRegisterd = await authDb.existsUserByEmail(email);
    if(isAlreadyRegisterd){
        throw new BadRequestError("email " + email + " is already registered");
    }
}
const getToken = (user: User): string => {
    return jwt.sign(user, SECRET);
}