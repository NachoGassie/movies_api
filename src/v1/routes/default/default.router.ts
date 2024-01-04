import { BadRequestError } from "../../../httpResponse";
import { Router } from "express";

const router = Router();

router.use((req, _res) => {
    throw new BadRequestError(`url: ${req.url} is not a valid directory by ${req.method} action`);
});

export default router;