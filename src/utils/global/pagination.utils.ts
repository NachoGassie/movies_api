import { GenreQueries, MovieQueries, NextPrevPag, NullishString, UrlPagObj } from "@model";
import { BadRequestError } from "@httpResponse";
import { defaultLimit, defaultPag } from "@constant";

type AcceptedQueries = MovieQueries | GenreQueries;
interface PagLimit { pag: number, limit: number }

export const getPaginationUrlUtil = (
    query: AcceptedQueries, baseUrl: string, cantTotal: number
): NextPrevPag => {
    const queryUrl = parseQueryUrl(query);
    const { pag, limit } = defineLimitPag(query);
    const urlObj = { pag, baseUrl, queryUrl }
    return getNextPrevPag(urlObj, limit, cantTotal);
}
export const isValidPagination = (pag: number, limit: number, cant: number): void => {    
    if (!isCorrectPagination(pag, limit, cant)) {
        throw new BadRequestError("you have exceeded the amount available");
    }
}

const parseQueryUrl = (reqQuery: AcceptedQueries): string => {
    const {pag, ...restofquery} = reqQuery;
    const arr3 = Object.entries(restofquery);
    let url = "";
    for (const x of arr3) {
        url += `&${x[0]}=${x[1]}`;
    }
    return url;
} 
const getNextPrevPag = (urlObj: UrlPagObj, limit: number, cantTotal: number): NextPrevPag => {
    const next = getNextPagination(urlObj, limit, cantTotal);
    const prev = getPrevPagination(urlObj);
    return { next, prev }
}
const isCorrectPagination = (pag: number, limit: number, cant: number): boolean => {
    return (pag * limit) < (cant + limit);
}
const getNextPagination = (urlObj: UrlPagObj, limit: number, cantTotal: number): NullishString => {
    const nextPag = (+urlObj.pag) + 1;
    const isNextPagValid = isCorrectPagination(nextPag, limit, cantTotal);
    return !isNextPagValid 
    ? null 
    : getPaginationUrl({...urlObj, pag: nextPag});
}
const getPrevPagination = (urlObj: UrlPagObj): NullishString => {
    const prevPag = (+urlObj.pag) - 1;
    return prevPag <= 0 
    ? null 
    : getPaginationUrl({...urlObj, pag: prevPag}); 
}
const getPaginationUrl = (urlObj: UrlPagObj): string => {
    const { pag, baseUrl, queryUrl } = urlObj;
    return `${baseUrl}?pag=${pag}${queryUrl}`
}
const defineLimitPag = (query: AcceptedQueries): PagLimit => {
    const { pag: tmpPag, limit: tmpLimit } = query;
    const pag = tmpPag ? tmpPag : defaultPag;
    const limit = tmpLimit ? tmpLimit : defaultLimit;
    return { pag, limit }
}