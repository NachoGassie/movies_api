import { ResponseHandler, ResponseOk } from "../../../httpResponse";
import express from "express";

const router = express.Router();

router.get("", (req, res) => {
    const { baseUrl } = req;
    return ResponseHandler(res, new ResponseOk({
        documentation: `${baseUrl}/api/v1/docs`,
        movies: `${baseUrl}/api/v1/movies`,
        genres: `${baseUrl}/api/v1/genres`,
        auth: `${baseUrl}/api/v1/auth`,
    }));
});

export default router;
