import { HTTPSTATUS } from "@model";

export abstract class CustomError extends Error {
    statusCode: HTTPSTATUS;
    constructor(message: string, statusCode: HTTPSTATUS){
        super(message);
        this.statusCode = statusCode;
    }
}

export class BadRequestError extends CustomError {
    constructor(message: string){
        super(message, HTTPSTATUS.BAD_REQUEST);
    }
}
export class UnathrorizedError extends CustomError {
    constructor(message: string){
        super(message, HTTPSTATUS.UNAUTHORIZED);
    }
}
export class ForbiddenError extends CustomError {
    constructor(message: string){
        super(message, HTTPSTATUS.FORBIDDEN);
    }
}
export class NotFoundError extends CustomError {
    constructor(message: string){
        super(message, HTTPSTATUS.NOT_FOUND);
    }
}
export class InternalError extends CustomError {
    constructor(message: string){
        super(message, HTTPSTATUS.INTERNAL_SERVER_ERROR);
    }
}