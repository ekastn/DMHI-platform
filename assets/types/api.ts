export type APIResponseType<T = null> = {
    user(user: any): unknown;
    success: boolean;
    message: string;
    data: T;
};
