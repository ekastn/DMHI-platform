export type APIResponseType<T> = {
    success: boolean;
    message: string;
    data: T;
};
