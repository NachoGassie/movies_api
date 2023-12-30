import { Response, Request, NextFunction } from "express";

type controllerExpected = (
    req: Request, res: Response, next?: NextFunction
) => unknown;

const controllerTryCatch = (controller: controllerExpected) => (

    async (req:Request, res: Response, next: NextFunction) => {
        try {
            await controller(req, res);
        } catch (error) {
            return next(error);
        }
    }
    
);


export default controllerTryCatch;