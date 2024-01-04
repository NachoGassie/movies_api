import { BadRequestError } from "../../httpResponse";
import { SortQuery } from "../../model";

export const isString = (string: any): boolean => typeof(string) === "string";
export const isNumber = (number: any): boolean => !!Number(number); 
export const isOrder = (order: any): boolean => Object.values(SortQuery).includes(order);

export const isPositiveNumber = (number: any): boolean => isNumber(number) && +number > 0;

export const parseToNumber = (x: any): number => {
    if (!isPositiveNumber(x)) {
        throw new BadRequestError(x +" is not a positive number");
    }
    return +x;
}

export const removeBlankFromString = (x: string) => x.split(" ").join("");