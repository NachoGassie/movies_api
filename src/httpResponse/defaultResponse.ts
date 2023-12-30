import { Response } from "express";
import { CustomReponse } from "@httpResponse/customResponse";

const ResponseHandler = (res: Response, httpResponse: CustomReponse<unknown>) => {
    const { statusCode, data } = httpResponse;

    return res.status(statusCode).json(
        data
    );
}

export default ResponseHandler;