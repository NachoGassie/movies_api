export const basicError = (field: string, type: string) => (
    {
        required_error: `${field} is required`,
        invalid_type_error: `${field} must be a ${type}`
    }
);
export const anioLanzamientoError = () => (
    {
        required_error: `anioLanzamiento is required`,
        invalid_type_error: `anioLanzamiento must be a number greater than 1900`
    }
);

export const greaterThanError = (field: string, min: number) => (
    `${field} must be greater than ${min}`
);

export const stringLenghtError = (field: string, cant: number) => (
    `${field} must contain at least ${cant} character/s`
);