export const catchError = <T>(
    promise: Promise<T>
): Promise<[Error, undefined] | [undefined, T]> => {
    return promise
        .then((data) => [undefined, data] as [undefined, T])
        .catch((error) => [error, undefined] as [Error, undefined]);
};
