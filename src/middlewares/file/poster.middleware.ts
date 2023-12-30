import { MimeTypesAllowed } from "@constant";
import { BadRequestError } from "@httpResponse";
import { multerCallBack, multerFile } from "@model";
import { removeBlankFromString } from "@utils";
import { Request } from "express";
import multer from "multer";
import { extname, join } from "path";

const filePath = join(__dirname, "../../public/posters");

const posterStorage = multer.diskStorage({
    destination: filePath,
    filename: (_req, file, cb) => {
        const fileExtension = extname(file.originalname);

        const originalname = file.originalname.split(".")[0];
        const fileName = removeBlankFromString(originalname);

        if (!fileExtension || !fileName) {
           return cb(new BadRequestError("file name or extension was not included"), "");
        }

        return cb(null, `${fileName}_${Date.now()}${fileExtension}`);
    }
});

const posterFilter = (_req: Request, file: multerFile, cb: multerCallBack) => {
    if (MimeTypesAllowed.includes(file.mimetype)) 
        return cb(null, true);

    return cb(new BadRequestError(`only ${MimeTypesAllowed.join(" ")} are allowed`));
}

const posterUpload = multer({
    storage: posterStorage,
    fileFilter: posterFilter
});

const posterValidation = posterUpload.single("poster");

export default posterValidation;