import { FileFilterCallback } from "multer";

export interface NextPrevPag {
    next: string | null;
    prev: string | null;
}

export interface getAllResponse extends NextPrevPag{
    pag: number;
    maxPag: number;
    totalCount: number;
}

export interface UrlPagObj {
    pag: number;
    queryUrl: string;
    baseUrl: string;
}

export type NullishString = string | null;

export type multerFile = Express.Multer.File;
export type multerCallBack = FileFilterCallback;