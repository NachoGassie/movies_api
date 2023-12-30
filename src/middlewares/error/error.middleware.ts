import { invalidJson, jwtError, mySqlError } from "@constant";
import { CustomError } from "@httpResponse";
import { HTTPSTATUS } from "@model";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

type ZodErrorArr = { 
    message: string; 
}[];

const errorHandler = (error: Error, _req:Request, res:Response, _next:NextFunction) => {
    if (error instanceof ZodError) {
        const errorMessages: ZodErrorArr = error.issues.map(issue => ({ message: issue.message }));
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
            error: {
                message: errorMessages
            }
        });
    }

    let statusCode: HTTPSTATUS | null = null;
    let { message } = error;

    if ("code" in error){
        if (mySqlError.includes(error.code as string)) {
            statusCode = HTTPSTATUS.UNAVAILABLE;
            message = "Unavailable to connect to Database";
        }
    }

    if ("type" in error){
        if (error.type === invalidJson) {
            statusCode = HTTPSTATUS.BAD_REQUEST;
            message = "Invalid Json Format";
        }
    }
    
    if (!statusCode) {
        statusCode = getStatusCode(error);
    }

    return res.status(statusCode).json({
        error: { message }
    });
}

const getStatusCode = (error: Error): HTTPSTATUS => {
    if (error instanceof CustomError) 
        return error.statusCode

    if (jwtError.includes(error.name)) 
        return HTTPSTATUS.UNAUTHORIZED;

    if ("status" in error) 
        return error.status as HTTPSTATUS;

    return HTTPSTATUS.INTERNAL_SERVER_ERROR;
}

export default errorHandler;