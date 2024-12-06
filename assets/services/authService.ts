import axios, { isAxiosError } from "axios";
import { APIResponseType } from "../types/api";
import { UserType } from "../types/user.";
import { catchError } from "../utils/common";

type UserPayload = { user: UserType };

export const loginApi = async (username: string, password: string) => {
    const { data } = await axios.post<APIResponseType<UserPayload>>("/auth/login", {
        username,
        password,
    });
    return data;
};

export const registerApi = async (username: string, password: string) => {
    const { data } = await axios.post<APIResponseType<UserPayload>>("/auth/register", {
        username,
        password,
    });
    return data;
};

export const logoutApi = async () => {
    const [error] = await catchError(axios.get<APIResponseType<null>>("/auth/logout"));
    if (isAxiosError<APIResponseType>(error)) {
        console.log(error);
    } else {
        throw error;
    }
};

export const checkAuthApi = async () => {
    const [error, res] = await catchError(
        axios.get<APIResponseType<UserPayload | null>>("/auth/me")
    );
    if (error) console.log(error);
    return res?.data;
};
