export type APIResponseType<T = null> = {
    success: boolean;
    message: string;
    data: T;
};
