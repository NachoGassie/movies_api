import { defaultLimit, defaultPag, defaultSort } from "../../constant";
import { SortQuery } from "../../model";
import { basicError, greaterThanError } from "../global";
import { z } from "zod";

export const QuerySchema = z.object({
    pag: z
        .number(basicError("pag", "number"))
        .positive(greaterThanError("pag", 0))
        .default(defaultPag),

    limit: z
        .number(basicError("limit", "number"))
        .positive(greaterThanError("limit", 0))
        .default(defaultLimit),
        
    sort: z.nativeEnum(SortQuery).default(defaultSort),
});