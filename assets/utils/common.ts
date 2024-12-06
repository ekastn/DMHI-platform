export const catchError = <T, E>(
    promise: Promise<T>,
    errorsToCatch?: E[]
): Promise<[undefined, T] | [Error]> => {
    return promise
        .then((data) => [undefined, data] as [undefined, T])
        .catch((error) => {
            if (errorsToCatch == undefined) {
                return [error];
            }
            if (errorsToCatch.some((e) => error instanceof e)) {
                return [error];
            }
            throw error;
        });
};
