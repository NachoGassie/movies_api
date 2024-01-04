import { ValidationTypes } from "../../model";
import { SECRET } from "../..//config";
import { ForbiddenError, UnathrorizedError } from "../../httpResponse";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const bearerString = "Bearer";

const validateToken = ({ validationType } : { validationType: ValidationTypes }) => (
    (req: Request, _res: Response, next: NextFunction) => {
        const { authorization } = req.headers;

        const decodedToken = decodeToken(authorization);

        if (validationType === ValidationTypes.USERMOD) {
            const tokenId = decodedToken.id_user;
            const requestId = +req.params.userId;
        
            if (requestId !== tokenId) {
                throw new ForbiddenError("not allowed to modify this user");
            }
        }
        
        next();
    }
)

const decodeToken = (authorization: string | undefined) => {

    if (!authorization || !authorization.startsWith(bearerString)) {
        throw new UnathrorizedError("invalid token");
    }

    const token = authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, SECRET) as JwtPayload;
    
    if (!token || !decodedToken.id_user) {
        throw new UnathrorizedError("invalid token");
    }

    return decodedToken;
}
export default validateToken;